/**
 * NEXT.JS: 06 - API Routes
 *
 * ONE CONCEPT: Build backend APIs inside your Next.js app
 */


// =============================================================================
// API ROUTES
// =============================================================================

console.log('=== API Routes ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  API ROUTES (App Router: Route Handlers)                            │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // app/api/users/route.ts                                          │
 *   │  import { NextResponse } from 'next/server';                       │
 *   │                                                                      │
 *   │  export async function GET() {                                      │
 *   │    const users = await db.user.findMany();                         │
 *   │    return NextResponse.json(users);                                │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  export async function POST(request: Request) {                    │
 *   │    const body = await request.json();                              │
 *   │    const user = await db.user.create({ data: body });             │
 *   │    return NextResponse.json(user, { status: 201 });               │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  // app/api/users/[id]/route.ts                                     │
 *   │  export async function GET(request, { params }) {                  │
 *   │    const user = await db.user.findUnique({                        │
 *   │      where: { id: params.id }                                      │
 *   │    });                                                              │
 *   │    if (!user) return NextResponse.json(                            │
 *   │      { error: 'Not found' }, { status: 404 }                     │
 *   │    );                                                               │
 *   │    return NextResponse.json(user);                                 │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  Supported: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS          │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('app/api/users/route.ts → GET /api/users');
console.log('Export named functions: GET, POST, PUT, DELETE');
console.log('Full access to DB, secrets, Node.js APIs');


// =============================================================================
// SERVER ACTIONS
// =============================================================================

console.log('\n=== Server Actions ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  SERVER ACTIONS: Call server functions from client                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // Server Action (in server component or separate file)           │
 *   │  "use server";                                                      │
 *   │  async function createPost(formData: FormData) {                   │
 *   │    const title = formData.get('title');                            │
 *   │    await db.post.create({ data: { title } });                    │
 *   │    revalidatePath('/posts');                                       │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  // Use in form (works WITHOUT JavaScript!)                        │
 *   │  <form action={createPost}>                                        │
 *   │    <input name="title" />                                          │
 *   │    <button type="submit">Create</button>                          │
 *   │  </form>                                                            │
 *   │                                                                      │
 *   │  // Use with useFormStatus for loading state                       │
 *   │  "use client";                                                      │
 *   │  function SubmitButton() {                                          │
 *   │    const { pending } = useFormStatus();                            │
 *   │    return <button disabled={pending}>                              │
 *   │      {pending ? 'Saving...' : 'Save'}                             │
 *   │    </button>;                                                       │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  Server Actions = RPC-style function calls                        │
 *   │  No API route needed for mutations!                                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Server Actions: "use server" functions called from forms');
console.log('Works without JavaScript (progressive enhancement)');
console.log('No need for API routes for form submissions');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Next.js offers two approaches for backend logic. Route Handlers
 * (app/api/route.ts) are traditional REST endpoints where I export
 * functions named GET, POST, PUT, DELETE. They have full access to
 * the database, secrets, and Node.js APIs. They're deployed as
 * serverless functions on Vercel.
 *
 * Server Actions are newer — functions marked with 'use server' that
 * can be called directly from forms or client components. They're
 * like RPC calls: the framework handles serialization and the HTTP
 * request. They work without JavaScript enabled (progressive
 * enhancement), and I can call revalidatePath or revalidateTag to
 * update cached pages after a mutation.
 *
 * I use API routes for RESTful APIs consumed by external clients or
 * mobile apps. I use Server Actions for internal mutations like form
 * submissions where I don't need a formal API."
 */


// RUN: node docs/32-nextjs/06-api-routes.js
