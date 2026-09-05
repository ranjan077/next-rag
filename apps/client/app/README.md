# Client Application

This is the Next.js client for the RAG (Retrieval-Augmented Generation) application. It provides the user interface for interacting with the application and uses Clerk for authentication.

## Features

- Next.js application routing and UI
- Clerk-based user authentication
- Authenticated access to RAG functionality
- Responsive interface for submitting questions and viewing generated answers

## Prerequisites

- Node.js 18 or later
- A Clerk application with its publishable and secret keys configured
- The RAG API or backend service running as required by the application

## Environment variables

Create a `.env.local` file in the client app and configure the Clerk credentials used by the application. Typical values include:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

Use the variable names expected by the application configuration and never commit secrets to source control.

## Development

Install dependencies from the repository root, then start the client:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production

Build and start the application with:

```bash
npm run build
npm run start
```

Ensure all required Clerk and backend configuration is available in the deployment environment.
