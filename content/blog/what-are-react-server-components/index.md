---
{
    title: "What are React Server Components (RSCs)?",
    description: "",
    published: '2023-12-14T21:52:59.284Z',
    authors: ['crutchcorn'],
    tags: ['react', 'webdev'],
    attached: [],
    license: 'cc-by-4',
    collection: "React Beyond the Render",
    order: 1
}
---

So! Instead, what React did is introduce "Server Components", where you can do a few things:

- Not re-render on the client
- Fetch data on the server and return it to the client 🤫 (spoilers for what I'm _gonna_ write)

So instead of:

```tsx
<Layout>
  <Header/>
  <Content/>
  <Footer/>
</Layout>
```

And having React render 4 components on the server, then re-render 4 components on the client - you might have:

```tsx
<ServerLayout>
  <ServerHeader/>
  <ClientContent/>
  <ServerFooter/>
</ServerLayout>
```

And keep the first 4 component renders on the server, but _only_ re-render `ClientContent` on the client, saving the amount of JS needed and the speed in parsing

So that's the RSC (React Server Component) story

![// TODO: Write alt](./react-server-components.svg)
