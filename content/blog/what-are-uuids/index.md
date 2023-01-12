---
{
    title: "What are UUIDs?",
    description: "",
    published: '2023-02-20T21:52:59.284Z',
    authors: ['crutchcorn'],
    tags: ['computer science'],
    attached: [],
    license: 'cc-by-4'
}
---

Oftentimes, in computer programming, you'll find yourself needing a way to give a unique identifier to a digital asset. Whether those are books in your "To Read" digital bookshelf, computers on your network, or anything in between; you need a quick and easy way to access that data with an ID that's distinct.

If you've done much research on this problem, you'll likely have heard of a "universally unique identifier" (UUID) or "globally unique identifier" (GUID) as their usage is wide reaching in the software industry.

While it's good to recognize popular technologies, a few questions remain:

- What is a UUID?
- What are the various versions of UUID?
- Why are they so widely utilized?

# What is a UUID?

Broadly speaking, a UUID is a numerical value of 128 bits that can be used to provide an indentification number to a resource. 

While there are multiple different kinds of UUIDs, which we'll touch on shortly, all UUID formats follow a few general ideas.

**First**; UUIDs are, for all intents and purposes, unique. While that might seem obvious, here's the part that isn't: The garuntee that a number is unqiue does not require previous knowledge of other generated UUIDs.

This differs from a simple counter up from `0`, where you would need to lookup the previous number stored in order to generate a new number. 

> We'll explore why this has led to UUID's prolific usage at the end of the article.

**Second**; While it's not literally impossible to generate two UUIDs with the same value, it's generally safe to assume that it's _nearly_ impossible.

**Finally**, all UUIDs are formatted in a similar manner. An example UUIDv4 might be formatted to look something like this:

```
a5abec44-7ce0-437c-972a-cf451b4fde2b
```

This number is then often represented using 36 characters of:

- 8 characters
- A dash (`-`)
- 4 characters
- A dash
- 4 characters
- A dash
- 4 characters
- A dash
- 12 characters

Two of these characters include information about which kind of UUID it is:

```
xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
```

Here, `M` is the UUID version number, while `N` is the variant of UUID version. Think of this as information encoded within the UUID _about_ the UUID generation process that yeilded the output value.

> Speaking of "UUID version numbers", what are those? I know we outlined earlier that there were different ways of generating an UUID; what are they?

I'm glad you asked.

# What are the different types of UUID?

At the time of writing, [there are 8 different types of UUIDs](https://ietf-wg-uuidrev.github.io/rfc4122bis/draft-00/draft-ietf-uuidrev-rfc4122bis.html):

- [UUIDv1](#UUIDv1)
  - A machine's network card information + a timestamp
- [UUIDv2](#UUIDv2)
  - UUIDv1 + Obscure Security Stuff (it's complicated)
- [UUIDv3](#UUIDv3and5)
  - Encode a string using MD5
- [UUIDv4](#UUIDv4)
  - Random UUID with effectively zero chance of producing the same number twice
- [UUIDv5](#UUIDv3and5)
  - UUIDv3 but more secure (uses SHA-1)
- [UUIDv6](#UUIDv6)
  - UUIDv1 but better for database indexes
- [UUIDv7](#UUIDv7)
  - UUIDv1 without network card information and with a more standard timestamp
- [UUIDv8](#UUIDv8)
  - An intentionally broad UUID spec for all non-standard UUIDs - make up your own UUIDs



## Track Network Systems Using UUIDv1 {#UUIDv1}

// TODO: Write



## UUIDv2s are _weird_ {#UUIDv2}



## Namespace Your IDs with UUIDv3 and UUIDv5 {#UUIDv3and5}

> https://stackoverflow.com/questions/20342058/which-uuid-version-to-use

## Generate non-clashing random IDs with UUIDv4 {#UUIDv4}

// TODO: Write

## Create a Database Index with UUIDv6 {#UUIDv6}

https://blog.devgenius.io/analyzing-new-unique-identifier-formats-uuidv6-uuidv7-and-uuidv8-d6cc5cd7391a

https://ietf-wg-uuidrev.github.io/rfc4122bis/draft-00/draft-ietf-uuidrev-rfc4122bis.html#name-uuid-version-6

[Better for database indexes](](https://ietf-wg-uuidrev.github.io/rfc4122bis/draft-00/draft-ietf-uuidrev-rfc4122bis.html#section-6.10))

## More Standard Timestamps with UUIDv7 {#UUIDv7}

https://blog.devgenius.io/analyzing-new-unique-identifier-formats-uuidv6-uuidv7-and-uuidv8-d6cc5cd7391a

https://ietf-wg-uuidrev.github.io/rfc4122bis/draft-00/draft-ietf-uuidrev-rfc4122bis.html#name-uuid-version-7

## Make your own UUID rules with UUIDv8 {#UUIDv8}

https://blog.devgenius.io/analyzing-new-unique-identifier-formats-uuidv6-uuidv7-and-uuidv8-d6cc5cd7391a

https://ietf-wg-uuidrev.github.io/rfc4122bis/draft-00/draft-ietf-uuidrev-rfc4122bis.html#name-uuid-version-8

# Why would you want to use UUID?

// TODO: Write
