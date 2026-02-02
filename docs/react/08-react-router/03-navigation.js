/**
 * TOPIC: Navigation — useNavigate, Link, NavLink, Redirects
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  <Link> for declarative navigation (user clicks).     ║
 * ║  useNavigate() for programmatic navigation (code).    ║
 * ║  <Navigate> for declarative redirects.                ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────┐
 * │ Link = a door with a sign (user walks through).       │
 * │ useNavigate = a trapdoor (code sends you somewhere).  │
 * │ NavLink = a door that glows when you're in that room. │
 * │ Navigate = an automatic conveyor belt (redirect).     │
 * └───────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────┐
 * │  <Link to="/about">About</Link>      → <a> tag       │
 * │  <NavLink to="/about">About</NavLink> → <a> + active │
 * │  navigate('/about')                   → programmatic  │
 * │  <Navigate to="/login" />             → redirect      │
 * │  navigate(-1)                         → go back       │
 * └───────────────────────────────────────────────────────┘
 */

// --- Simulate browser history + navigation ---

function createHistory() {
  const stack = [];
  let index = -1;

  return {
    push(path) {
      stack.splice(index + 1); // remove forward entries
      stack.push(path);
      index++;
      console.log(`  → push("${path}") | history: [${stack.join(', ')}] pos=${index}`);
    },
    back() {
      if (index > 0) { index--; console.log(`  ← back to "${stack[index]}"`); }
      else console.log('  ← cannot go back');
    },
    forward() {
      if (index < stack.length - 1) { index++; console.log(`  → forward to "${stack[index]}"`); }
      else console.log('  → cannot go forward');
    },
    current() { return stack[index]; },
    go(n) {
      const newIdx = index + n;
      if (newIdx >= 0 && newIdx < stack.length) {
        index = newIdx;
        console.log(`  go(${n}) → "${stack[index]}"`);
      }
    }
  };
}

const history = createHistory();

// --- Link simulation (declarative) ---
console.log('A: <Link> — declarative navigation:');
function Link(to) {
  console.log(`  <Link to="${to}"> clicked`);
  history.push(to);
}
Link('/');
Link('/about');
Link('/user/42');

// --- NavLink simulation (active state) ---
console.log('\nB: <NavLink> — active link styling:');
function NavLink(to, label) {
  const isActive = history.current() === to;
  const cls = isActive ? 'nav-link active' : 'nav-link';
  console.log(`  <NavLink to="${to}"> class="${cls}" → ${label}`);
}
NavLink('/', 'Home');
NavLink('/about', 'About');
NavLink('/user/42', 'Profile'); // this is active

// --- useNavigate simulation (programmatic) ---
console.log('\nC: useNavigate() — programmatic navigation:');

function useNavigate() {
  return (to) => {
    if (typeof to === 'number') {
      history.go(to);
    } else {
      console.log(`  navigate("${to}")`);
      history.push(to);
    }
  };
}

const navigate = useNavigate();

// After login, redirect to dashboard
function handleLogin(success) {
  if (success) {
    console.log('  Login success!');
    navigate('/dashboard');
  }
}
handleLogin(true);

// Go back
console.log('\nD: navigate(-1) — go back:');
history.back();
console.log(`  Now at: ${history.current()}`);

// Go forward
console.log('\nE: Go forward:');
history.forward();
console.log(`  Now at: ${history.current()}`);

// --- Navigate component (redirect) ---
console.log('\nF: <Navigate> — declarative redirect:');
function NavigateComponent(to, replace) {
  console.log(`  <Navigate to="${to}" replace={${!!replace}} />`);
  if (replace) {
    console.log(`  Replaces current entry (no back to previous)`);
  }
  history.push(to);
}

function ProtectedRoute(isAuth, childName) {
  if (!isAuth) {
    console.log(`  Not authenticated! Redirecting...`);
    NavigateComponent('/login', true);
    return;
  }
  console.log(`  Authenticated → render <${childName} />`);
}

ProtectedRoute(false, 'Dashboard');
console.log('');
ProtectedRoute(true, 'Dashboard');

/**
 * OUTPUT:
 * A: <Link> — declarative navigation:
 *   <Link to="/"> clicked → push ...
 *   <Link to="/about"> clicked → push ...
 *   <Link to="/user/42"> clicked → push ...
 *
 * B: <NavLink> — active link styling:
 *   <NavLink to="/"> class="nav-link"
 *   <NavLink to="/user/42"> class="nav-link active"
 *
 * C: useNavigate() — programmatic navigation:
 *   Login success! navigate("/dashboard")
 * D: navigate(-1) — go back
 * E: Go forward
 * F: <Navigate> — redirect for protected routes
 *
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ Link for clickable navigation (renders <a>). NavLink  │
 * │ adds active class for current route. useNavigate for  │
 * │ programmatic (after form submit, auth). Navigate      │
 * │ component for declarative redirects. navigate(-1) to  │
 * │ go back.                                              │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/08-react-router/03-navigation.js
 */
