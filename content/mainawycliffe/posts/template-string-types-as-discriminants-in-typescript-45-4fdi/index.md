---
{
title: "Template String Types as Discriminants in Typescript 4.5",
published: "2021-11-18T08:21:00Z",
tags: ["typescript", "javascript", "webdev", "node"],
description: "Typescript 4.5 was just released and one of the features that stood out to me is the Template String...",
originalLink: "https://mainawycliffe.dev/blog/template-string-types-as-discriminants/",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "a-byte-of-typescript",
order: 5
}
---

Typescript 4.5 was just released and one of the features that stood out to me is the Template String Types as Discriminants. In this article, we are going to explore this new feature using rudimentary examples.  In my last [article](https://mainawycliffe.dev/blog/better-types-using-discriminated-types-in-typescript/), we covered using discriminated unions to write better types that are easy to narrow.

This is an extension of that but instead of having a concrete literal type, you can use a non-concrete literal type i.e. *string*, *number*, etc. instead as part of the template literal type, and Typescript will be able to use it as a discriminant.

In order to understand this feature, we are going to start by creating two types: `SuccessType` and `ErrorType`. They are going to represent possible responses for different operations we can perform in a computer system i.e. HTTP Request, FTP Request, IO Request, etc. So, if an HTTP request succeeds we get a `SuccessType` data, if it fails we get an `ErrorType` data.

For the two types, each will have a `type` property, which we can use to discriminate between the two types when they are used in a union i.e. `ResponseType` union. But Instead of using a concrete literal type, we will use a template string type instead.

This means that the resulting template literal type could be any string combined with `Success` or `Error`  i.e. `${string}Success` and `${string}Error`. This will allow our success type to cover a number of possible operations like `httpSuccess`, `ftpSuccess`, etc. and the same goes for `ErrorType`.

```ts
type SuccessType = {
    type: `${string}Success`,
    data: Record<string, unknown>;
}

type ErrorType = {
    type: `${string}Error`,
    message: string;
}

type ResponseType = SuccessType | ErrorType;
```

```ts
function processHTTPResponse(response: ResponseType) {
    // function body here
}
```

In previous versions, Typescript won't be able to narrow down the type of the `ResponseType` union based on the type field, as shown below.

![Template String Types as Discriminants in Typescript 4.5](https://cms.mainawycliffe.dev/content/images/2021/11/image.png)

But as of the latest version (4.5 and above), typescript is able to narrow the type of `response` to `SuccessType` as shown below.

![Template String Types as Discriminants in Typescript 4.5](https://cms.mainawycliffe.dev/content/images/2021/11/image-1.png)

As you can imagine, this opens up a world of new possibilities by providing a literal type that is not concrete, typescript can discriminate between two unions as long as the field used to discriminate is contained in the string being compared to. Here is another rudimentary example:

```ts
type HttpOK = {
    status: `2${string}`;
    data: string;
}

type Http500 = {
    status: `5${number}`;
    message: string;
}

type Http300 = {
    status: `3${string}`;
    redirect: string;   
}

function processResponse(response: HttpOK | Http300 | Http500) {
    if(response.status === "200") {
        console.log(response.data);
    }

    if(response.status === "300") {
        console.log(response.redirect);
    }

    if(response.status === "500") {
        console.log(response.message);
    }
}
```

Here is a link to [Typescript Playground](https://www.typescriptlang.org/play?ts=4.5.0-beta\&ssl=28\&ssc=2\&pln=1\&pc=1#code/C4TwDgpgBAEsxgPIGkoF4oG8CwAoKBUAzsAIbACuRAXFAAYBMAJJiQE4CWAdgOYC+dANx5CUACblStdtx7DcfPHlCRY8MAFYADFvRYRhEuSq06GllwoBbAEYQ2A+aKsQiRUjwjTgnXvMW4yuDQcAgAzDp6OPiGZJQ09GEsMryOBgRsEGIcmQDGwN6+coR4AXgAZhRc+RwA9lxQYGy1ua5EAEquYPVEEAAUmUTdXL20oUioAD5q4ZHT49paAJT6MQQc5QNdPRAAdEbx6GgYAEQMOicr0aKiuT21ADZ7D7U8W0M7uxJkS06EZWsoBt3sNevs4lQjqcIlpLqsboQ7iNHs9XiDPplsnlgL90lAAaJgYNQXsDpDjqdFnDrgioEiiCjdi83sTPi43B4ILjAQE+EA) for the above code.

## Conclusion

In this brief article, we looked at a new feature coming to Typescript v4.5 for using Template String Types as a discriminant. This allows us to build more versatile types by relying on a template pattern for the discriminant property rather than an exact string.
