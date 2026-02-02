/**
 * MACHINE CODING 08: Async Utilities — parallel, series, waterfall, parallelLimit
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ parallel  — fire all tasks at once, collect results in order             ║
 * ║ series    — run tasks one after another, collect results                 ║
 * ║ waterfall — run tasks in sequence, pass result of each to the next       ║
 * ║ parallelLimit — like parallel but max N tasks running at a time          ║
 * ║                                                                          ║
 * ║ All tasks follow callback pattern: task(callback) where cb(err, result)  ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                         │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │ parallel   = All workers start at the same time, boss waits for all      │
 * │ series     = Assembly line: one worker finishes, next starts             │
 * │ waterfall  = Relay race: each runner passes baton to the next            │
 * │ parallelLimit = Only N checkout lanes open at a time                     │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM                                                            │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │                                                                           │
 * │  parallel:      [T1]──────►                                               │
 * │                 [T2]────►        → cb(null, [r1, r2, r3])                 │
 * │                 [T3]──────────►                                            │
 * │                                                                           │
 * │  series:        [T1]────► [T2]────► [T3]────► → cb(null, [r1,r2,r3])     │
 * │                                                                           │
 * │  waterfall:     [T1]─r1─► [T2(r1)]─r2─► [T3(r2)]─r3─► → cb(null, r3)   │
 * │                                                                           │
 * │  parallelLimit(2): [T1]──► [T3]──►                                        │
 * │                    [T2]────────►    → cb(null, [r1,r2,r3])               │
 * │                                                                           │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/javascript/29-machine-coding/08-async-parallel-series.js
 */

// ─────────────────────────────────────────────
// asyncParallel
// ─────────────────────────────────────────────

function asyncParallel(tasks, finalCb) {
  var results = [];
  var completed = 0;
  var hasError = false;

  if (tasks.length === 0) return finalCb(null, []);

  tasks.forEach(function(task, index) {
    task(function(err, result) {
      if (hasError) return;
      if (err) { hasError = true; return finalCb(err); }
      results[index] = result;
      completed++;
      if (completed === tasks.length) finalCb(null, results);
    });
  });
}

// ─────────────────────────────────────────────
// asyncSeries
// ─────────────────────────────────────────────

function asyncSeries(tasks, finalCb) {
  var results = [];
  var index = 0;

  function next() {
    if (index === tasks.length) return finalCb(null, results);
    tasks[index](function(err, result) {
      if (err) return finalCb(err);
      results.push(result);
      index++;
      next();
    });
  }
  next();
}

// ─────────────────────────────────────────────
// asyncWaterfall
// ─────────────────────────────────────────────

function asyncWaterfall(tasks, finalCb) {
  var index = 0;

  function next(prevResult) {
    if (index === tasks.length) return finalCb(null, prevResult);
    var task = tasks[index];
    index++;

    var cb = function(err, result) {
      if (err) return finalCb(err);
      next(result);
    };

    if (prevResult === undefined) {
      task(cb);
    } else {
      task(prevResult, cb);
    }
  }
  next(undefined);
}

// ─────────────────────────────────────────────
// asyncParallelLimit
// ─────────────────────────────────────────────

function asyncParallelLimit(tasks, limit, finalCb) {
  var results = [];
  var running = 0;
  var index = 0;
  var completed = 0;
  var hasError = false;

  if (tasks.length === 0) return finalCb(null, []);

  function runNext() {
    while (running < limit && index < tasks.length) {
      (function(i) {
        running++;
        index++;
        tasks[i](function(err, result) {
          if (hasError) return;
          if (err) { hasError = true; return finalCb(err); }
          running--;
          completed++;
          results[i] = result;
          if (completed === tasks.length) return finalCb(null, results);
          runNext();
        });
      })(index);
    }
  }
  runNext();
}

// ─────────────────────────────────────────────
// Helper: create delayed task
// ─────────────────────────────────────────────

function makeTask(name, delay, value) {
  return function(cb) {
    console.log('  [START] ' + name);
    setTimeout(function() {
      console.log('  [DONE]  ' + name + ' => ' + value);
      cb(null, value);
    }, delay);
  };
}

// ─────────────────────────────────────────────
// TEST CASES
// ─────────────────────────────────────────────

console.log('A: === asyncParallel ===');
asyncParallel([
  makeTask('T1', 100, 'one'),
  makeTask('T2', 50, 'two'),
  makeTask('T3', 80, 'three')
], function(err, results) {
  console.log('A result:', results);
  // ['one', 'two', 'three'] — order preserved despite T2 finishing first

  console.log('\nB: === asyncSeries ===');
  asyncSeries([
    makeTask('S1', 50, 'first'),
    makeTask('S2', 30, 'second'),
    makeTask('S3', 40, 'third')
  ], function(err, results) {
    console.log('B result:', results);
    // ['first', 'second', 'third'] — sequential order

    console.log('\nC: === asyncWaterfall ===');
    asyncWaterfall([
      function(cb) {
        console.log('  [W1] starting with 1');
        cb(null, 1);
      },
      function(prev, cb) {
        console.log('  [W2] received ' + prev + ', adding 10');
        cb(null, prev + 10);
      },
      function(prev, cb) {
        console.log('  [W3] received ' + prev + ', multiplying by 2');
        cb(null, prev * 2);
      }
    ], function(err, result) {
      console.log('C result:', result);
      // 22 — (1+10)*2

      console.log('\nD: === asyncParallelLimit (limit=2) ===');
      asyncParallelLimit([
        makeTask('L1', 100, 'a'),
        makeTask('L2', 80, 'b'),
        makeTask('L3', 60, 'c'),
        makeTask('L4', 40, 'd')
      ], 2, function(err, results) {
        console.log('D result:', results);
        // ['a', 'b', 'c', 'd'] — max 2 running at once

        // E: Error handling test
        console.log('\nE: === Error Handling ===');
        asyncParallel([
          function(cb) { cb(null, 'ok'); },
          function(cb) { cb(new Error('fail!')); },
          function(cb) { cb(null, 'ok2'); }
        ], function(err, results) {
          console.log('E result:', err ? 'Error: ' + err.message : results);
          // Error: fail!
        });
      });
    });
  });
});

/**
 * FOLLOW-UP QUESTIONS:
 *
 * 1. How would you add timeout support to each task?
 * 2. How does Promise.all relate to asyncParallel?
 * 3. What if a callback is called twice? How do you guard against that?
 *    - Use a flag `called` per task to ensure callback is only processed once.
 * 4. How would you implement asyncMap(items, asyncFn, cb)?
 * 5. What is backpressure and how does parallelLimit help?
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER                                                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ parallel: Fire all tasks, track completions with a counter. Store        ║
 * ║ results by index to preserve order. Call finalCb when counter === len.   ║
 * ║                                                                          ║
 * ║ series: Use a recursive next() function. Each task's callback triggers   ║
 * ║ the next task. Collect results in an array.                              ║
 * ║                                                                          ║
 * ║ waterfall: Like series but pass each result as an argument to the next.  ║
 * ║                                                                          ║
 * ║ parallelLimit: Maintain a running counter. Start up to `limit` tasks.    ║
 * ║ When one finishes, start the next queued task. Same result collection.   ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
