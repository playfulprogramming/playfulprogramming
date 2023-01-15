---
{
    title: "What Happened to UUIDv2?",
    description: "",
    published: '2023-02-20T21:52:59.284Z',
    authors: ['crutchcorn'],
    tags: ['computer science'],
    attached: [],
    license: 'cc-by-4',
    series: "Explaining UUIDs",
    order: 2
}
---

If you read [my last post introducing UUIDs](/posts/what-are-uuids), you'll remember that I said:

> UUIDv2 is _weird_.

After this, [I left a very short (one or two sentences) explaination of what a UUIDv2 is](/posts/what-are-uuids#UUIDv2).

Why would I do that [when UUIDv3 and UUIDv5 got four whole headers worth of explanation](/posts/what-are-uuids#UUIDv3and5)? What makes UUIDv2 different or "weird" as I put it?

The answer is that while UUID _is_ a form of UUID by some definitions, it effectively is not in others.

> What?!

I know... It's a bit jarring. What's worse; even within the definitions we _do_ have, UUID is deeply flawed. Enough so that most are comfortable leaving it in the past.

To figure out how UUIDv2 became this way, let's explore:

- What makes a UUID a UUID?
- How is UUIDv2 defined?
- What was UUIDv2 supposed to be used for?
- What are the problems with UUIDv2?

<!-- // TODO: Add links -->

# What makes a UUID a UUID? {#specs}

As you may have noticed; UUIDs aren't a free-for-all. There are specific rules that apply to UUID that come from a document released in 2005 by the "[Internet Engineering Task Force](https://www.ietf.org/)" (IETF). This document is known as [`RFC 4122`](https://datatracker.ietf.org/doc/html/rfc4122) and acts as the de-facto UUID specification.

This is all [the official UUID specification has to say about UUIDv2](https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.3): 

> Description: DCE Security version, with embedded POSIX UIDs.

That's it.

Even in a proposal to update RFC 4122	

This makes the UUIDv2 the only official version of UUID that does not have an explicit definition as part of the 2005 specification.

This doesn't mean that it doesn't have rules, however; The UUIDv2 specification can be found in an older standard set for UUIDs. This older standard was created by an organizational body then called the "Open Software Foundation" (OSF), now called "The Open Group"

This older specification, which outlines the rules for UUIDv2 and was released in 1997, is called [the DCE 1.1 Authentication and Security Services specification](https://pubs.opengroup.org/onlinepubs/9696989899/toc.htm).

> Interesting in more history of UUIDs? [Twilio Segment's blog has an amazing history lesson about how they came to be](https://segment.com/blog/a-brief-history-of-the-uuid/). 

# How is UUIDv2 Defined?

While the DCE specification is happy to go in-depth about [the fine-grained details of UUIDv2](https://pubs.opengroup.org/onlinepubs/9696989899/chap5.htm#tagcjh_08_02_01_01), let's take a more zoomed out look at it:

UUIDv2 is almost to [UUIDv1](/posts/what-are-uuids#UUIDv1). It contains the same components of:

- A timestamp
- A version
- A variant
- A clock sequence
- A Mac address

However, there are a few small differences. Namely:

- The "Clock Sequence" from UUIDv1 is changed from 3 bytes to 1 as the last 2 bytes are replaced with a new "Local Domain" enum value.

- The "Low Time" is replaced with a "Local Domain Number" 

![// TODO: Write](./UUIDv2.svg)



> Wait, what is a "Local Domain" or "Local Domain Number"?

Well, to answer this, we have to take a short detour to explain what UUIDv2 was supposed to be used for.

# What was UUIDv2 Supposed to Be Used for?

In [Unix-like operating systems](https://en.wikipedia.org/wiki/Unix-like) such as Linux and macOS, your machine needs a way to keep track of the users on its system. The primary way computers in this family of OSes do this is by assigning you a ["User ID", or "UID"](https://en.wikipedia.org/wiki/User_identifier).

This what the "Local Domain" is referring to. The `0` in the "Local Domain" field is saying that "Local Domain Number" is tracking the UID of a Unix-like system's user. The "Local Domain Number" is the UID itself.

> But wait, why would we need a "Local Domain" field anyway?

Well, as it turns out, Unix-like systems track more data on the user than a single number. Consider the following usecase for a Linux-based school server:

You want to provide permissions to all teachers to access the `Homework Answers` directory, but not the student users. Wouldn't it be nice to have a "group" of users that you could assign specific permissions to?

It was with this thought process that the concept of a ["Group ID" or "GID"](https://en.wikipedia.org/wiki/Group_identifier) was invented. Similar to UIDs, GIDs are a number that keeps information about a group of users on the system.

UUIDv2s are able to track a GID rather than a UID by changing the `Local Domain` to the number `1`. 

> Are those the only two "Local Domains"?

Alas, they are not. Let's continue our example of a school Linux server once more to explain why. Assume you're the [University of California system of schools](https://en.wikipedia.org/wiki/University_of_California) and want to create a directory that allows for emails to be sent to everyone in the [UC Davis campus](https://en.wikipedia.org/wiki/University_of_California,_Davis). That's where an organization might come into play.

This organization would relate to a collection of groups, which in turn relates to a collection of users. This would be tracked with an "organization ID" and assigned a `Local Domain` of `2`.

**This was UUIDv2's original purpose: Encoding of POSIX data in a unique ID**: There are application instances where having the user's operating system information easily accessible would be handy in the resource's ID.

# Why do UUIDv2s suck?

UUIDv2 has a lot of problems today:

- **Few implementations**: Because of the scaresity of UUIDv2 usage and the lack of formal specification in RFC 4122 there are very few implementations of UUIDv2 in most languages and libraries. This may make implementing them more challenging than other versions of UUID.
- **Difficult to research**: Because there are few implementations of UUIDv2, it's challenging to learn about this version of UUIDs. Most articles ([including own my introducion to UUIDs](/posts/what-are-uuids)) leave a single paragraph (if even!) about the subject.

Both of these feel a bit more like symptoms of a deeper rooted problem. Dig deep enough and you'll end up finding exactly what this problem is: **UUIDv2 has a very high likelyhood of ID collision**.

This means that if you run UUIDv2 multiple times in rapid succession, the likelyhood you'll get the exact same ID.

This is an absolute showstopper for most applications, as the entire idea behind UUIDv1 (which, remember, UUIDv2 is based off of) is to generate unique IDs for each generation.

## Explaining Why UUIDv2 Collisions Occur

