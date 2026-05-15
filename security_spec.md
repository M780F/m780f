# Security Specification for Word Document App

## Data Invariants
1. Every document must have a `userId` that matches the authenticated user.
2. `pages` must be an array of strings.
3. `updatedAt` and `createdAt` must be server timestamps.
4. Document IDs must be valid alphanumeric strings.

## The Dirty Dozen (Test Matrix)
1. Unauthenticated user attempts to create a document -> DENIED
2. Authenticated user attempts to create a document for another user (spoofing `userId`) -> DENIED
3. User attempts to read another user's document -> DENIED
4. User attempts to update a document they don't own -> DENIED
5. User attempts to delete a document they don't own -> DENIED
6. User attempts to inject a 1MB string into the `title` field -> DENIED
7. User attempts to bypass the `pages` type (e.g., sending a number) -> DENIED
8. User attempts to update a document and change its `userId` (ownership takeover) -> DENIED
9. User attempts to update a document and change its `createdAt` (immutable field) -> DENIED
10. Unauthenticated user attempts to list all documents -> DENIED
11. User attempts to list documents without a filter on their own `userId` -> DENIED
12. User attempts to update a document with extra "ghost fields" (e.g., `isAdmin: true`) -> DENIED
