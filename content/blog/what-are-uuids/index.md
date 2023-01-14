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

If you've done much research on this problem, you'll likely have heard of a "universally unique identifier" (UUID) or "globally unique identifier" (GUID); a way to generate IDs for these assets quickly. After all, UUID usage is wide reaching in the software industry.

While it's good to recognize popular technologies, a few questions remain:

- What is a UUID?
- What are the various versions of UUID?
- Why are they so widely utilized?

# What is a UUID?

Broadly speaking, a UUID is a numerical value of 128 bits that can be used to provide an identification number to a resource. 

While there are multiple different kinds of UUIDs, which we'll touch on shortly, all UUID formats follow a few general ideas.

**First**; UUIDs are, for all intents and purposes, unique. While that might seem obvious, here's the part that isn't: The garuntee that a number is unqiue does not require previous knowledge of other generated UUIDs.

This differs from a simple counter up from `0`, where you would need to lookup the previous number stored in order to generate a new number. 

> We'll explore why this has led to UUID's prolific usage at the end of the article.

**Second**; While it's not literally impossible to generate two UUIDs with the same value, it's generally safe to assume that it's _nearly_ impossible.

**Finally**, all UUIDs are formatted in a similar manner. The numerical value of the UUID is encoded into a string of [hexidecimal numbers](/posts/non-decimal-numbers-in-tech) and dashes (`-`) when displayed a string. An example UUIDv4 might be formatted to look something like this:

```
a5abec44-7ce0-437c-972a-cf451b4fde2b
```

Two of these characters include information about which kind of UUID it is:

```
xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
```

Here, `M` is the UUID version number, while `N` is the variant of UUID version. Think of this as information encoded within the UUID _about_ the UUID generation process that yeilded the output value. 

> While we'll explain what the UUID "version" is in the next section, let's quickly explain what the "variant" means:
>
> - If the variant is `0` through `7`, it means the UUID is backwards compatible with [**very** old computer systems from the 1980s](https://en.wikipedia.org/wiki/Apollo_Computer).
> - If the variant is `8` through `b`, it means the UUID is part of [the "RFC 4122" standard](https://www.ietf.org/rfc/rfc4122.txt)
> - If the variant is `c` or `d`, it means the UUID is compatible with early Windows systems
> - Variants `e` and `f` are reserved for future UUID versions

This means that we can take the previous UUID:

```
a5abec44-7ce0-437c-972a-cf451b4fde2b
```

And determine that this is a UUID with the version of `4` and the variant of `9`.

> Speaking of "UUID version numbers", what are those? I know we outlined earlier that there were different ways of generating an UUID; what are they?

I'm glad you asked.

# What are the different types of UUID?

A "UUID version" outlines which type of UUID you're generating; each version of UUID has a different generation mechanism, and therefore different usecases.

At the time of writing, [there are 5 different types of UUIDs](https://ietf-wg-uuidrev.github.io/rfc4122bis/draft-00/draft-ietf-uuidrev-rfc4122bis.html) that are part of [the official UUID specification](https://datatracker.ietf.org/doc/html/rfc4122):

- [UUIDv1](#UUIDv1)
  - A machine's network card information + a timestamp
- [UUIDv2](#UUIDv2)
  - It's a long story.
- [UUIDv3](#UUIDv3and5)
  - Encode a string using MD5
- [UUIDv4](#UUIDv4)
  - Random UUID with effectively zero chance of producing the same number twice
- [UUIDv5](#UUIDv3and5)
  - UUIDv3 but more secure (uses SHA-1)

## Track Network Systems Using UUIDv1 {#UUIDv1}





https://www.mparticle.com/blog/what-is-a-uuid/

https://ietf-wg-uuidrev.github.io/rfc4122bis/draft-00/draft-ietf-uuidrev-rfc4122bis.html#name-uuid-version-1

https://www.sohamkamani.com/uuid-versions-explained/

https://versprite.com/blog/universally-unique-identifiers/

![// TODO: Write](./UUIDv1.svg)



### Pros of UUIDv1

- **Low likelyhood of collision**: While Mac addresses are not _truly_ unique, [thanks to vender re-use](https://www.howtogeek.com/228286/how-is-the-uniqueness-of-mac-addresses-enforced/), the combination of timestamp and Mac address makes it **extremely** unlikely to duplicate the same UUID in mutliple generations on the same network system. Furthermore, introducing a clock sequence adds another layer of protection against UUIDv1 collision.

### Cons of UUIDv1

- **Anonymity**: Because we're encoding a system's Mac address into the UUIDv1, it cannot be used as an anonymous value - since it links the UUID to a system that can be identified by its network card metadata. 

- **Easy to guess the sequence**: Likewise, let's say you want to use a UUID to generate a reset password link to the user:

  ```
  https://example.com/reset/ef5dc6d0-93ca-11ed-acdd-6fb6f98f3ada
  ```

  An attacker can decode the Mac address of the server (in this case, `6f:b6:f9:8f:3a:da`) and use it to brute force the rest of the URL, as demonstrated [in this article by Versprite](https://versprite.com/blog/universally-unique-identifiers/).



## UUIDv2s are _weird_ {#UUIDv2}

> I know you mentioned it's a long story with UUIDv2... Surely it can't be that bad, can it?

No, really, it's a ***long*** story. It's complex enough that I'm writing a second blog post explaining what UUIDv2s are, why they're not widely used, and how they came to be.

In the meantime, the short version of UUIDv2 is:

----

UUIDv2 matches the specification for UUIDv1 but replaces some of the timing and clock information with identification numbers for operating system usage.

They're rarely implemented into most UUID libraries, and are used even more rarely. This is because of 2 reasons:

1) They're not documented as part of the newest UUID specification
2) Significant pitfalls in UUIDv2's generation schema that **regularly** leads to collision with other generated UUIDv2s

As a result, we won't talk about UUIDv2s any more today. Stay tuned for an upcoming article outlining them more.


## Namespace Your IDs with UUIDv3 and UUIDv5 {#UUIDv3and5}

https://stackoverflow.com/questions/20342058/which-uuid-version-to-use

https://www.uuidtools.com/uuid-versions-explained

> The UUID specification establishes 4 pre-defined namespaces. The pre-defined namespaces are:
>
> - DNS — `6ba7b810-9dad-11d1-80b4-00c04fd430c8`
> - URL — `6ba7b811-9dad-11d1-80b4-00c04fd430c8`
> - OID — `6ba7b812-9dad-11d1-80b4-00c04fd430c8`
> - X.500 DN — `6ba7b814-9dad-11d1-80b4-00c04fd430c8`





You can think of the generation algorthm for both of these UUID versions as the following:

```
UUID = hash(NAMESPACE_IDENTIFIER + NAME)
```





![// TODO: Write](./UUIDv3.svg)



// TODO: Write

![// TODO: Write](./UUIDv5.svg)

## Generate non-clashing random IDs with UUIDv4 {#UUIDv4}

// TODO: Write

![A UUIDv4 is defined by 5 different segments of random data separated by a dash. Inside of this UUID is also encoded a UUID version code and a variant code. An example UUIDv4 might be "170e8013-f7b9-4a15-9e2e-6fc86dcb98fd".](./UUIDv4.svg)







# Why would you want to use UUID?

// TODO: Write
