---
{
    title: "How to Incrementally Migrate a Codebase",
    description: "Join me as I explore my decision-making matrix on how I approach incrementally adopting new technologies into old codebases.",
    published: "2025-12-01T13:45:00.284Z",
    tags: ['leadership', 'opinion'],
    license: 'cc-by-4',
    order: 3
}
---


In the past, I've mentioned ["increment migrations"](/posts/inheriting-bad-tech) as my go-to guide to rescuing a codebase from languishing in rewrite hell.

But this leaves an open-ended question: How _do_ you incrementally migrate a codebase?







# Core Concepts

## Feature Flags

- Allow the user to opt-out of new versions?
- How to toggle them easily for developers and exposing that in dev only UIs
- "Shadow launching": The old system handles the request, but a copy of the traffic is also sent to the new service. You can then compare the results, performance, and error rates without impacting users.

## Versioning

- Semver
- Talk about how to expose this to users for debugging purposes

## Invisible vs. Evident Changes

- Good time to change UI? Or adopt individually?
- Good time to introduce new features?
- Testing methodologies?????



# Application Splitting

## Splitting by Route

- Page-by-page on the FE
- Route-by-route on the BE

## Splitting by Feature

- Microservices (BE)
- iFrames (FE)





# Data Migrations

- Shared database between systems?
- Communication layers between systems?
- Data sync scripts?

Remember, the FE can have data too



# Framework Interop

- Nest.js <-> AdonisJS on the BE
- React <-> Vue on the FE

