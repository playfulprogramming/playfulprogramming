---
{
title: "Typescript - Tips & Tricks - Index Signature",
published: "2021-03-05T07:16:45Z",
edited: "2021-09-09T07:04:13Z",
tags: ["typescript", "webdev"],
description: "Welcome back guys, today I'll speak about the \"Index Signature\". In some cases, we need to create...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-index-signature-2og6",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "Typescript - Tips & Tricks",
order: 9
}
---

Welcome back guys, today I'll speak about the *"Index Signature"*.
In some cases, we need to create some special types like dictionaries.
These special types have some keys that identifies the elements and the datas.
A simple example:

```ts
export type User = {
    name: string,
    email: string;
    session: string
}

export type UserDictionary = {
    [username: string]: User
}

const userDictionary: UserDictionary = {
  'myusername': { email: "myemail@email.it", name: "myname", session: "session" },
  'myusername1': {
    email: "myemail1@email.it",
    name: "myname1",
    session: "session",
  },
};

console.log(userDictionary.myusername); // { email: 'myemail@email.it', name: 'myname', session: 'session' }
console.log(userDictionary["myusername"]); // { email: 'myemail@email.it', name: 'myname', session: 'session' }
console.log(userDictionary.myusername1); // { email: 'myemail1@email.it', name: 'myname1', session: 'session' }
console.log(userDictionary["myusername1"]); // { email: 'myemail1@email.it', name: 'myname1', session: 'session' }
delete userDictionary.myusername;

```

In this case, the *UserDictionary* is a special type where the usernames are the keys of the objects and the user data are the values.
This type is powerful because it permits the consumer to access directly to the data if it knows the keys and it permits to store a unique value of a specific key.
With the index signature, we can create special types where the keys can be string or number.
An important thing that you must remember is that the keys of these objects can be iterated with the for-in loop or with the Object.keys method.

```ts
console.log(Object.keys(userDictionary)); // [ 'myusername', 'myusername1' ]
for (const key in userDictionary) {
  console.log(key);
}
/*
'myusername'
'myusername1'
*/
```

It's all from the *Index Signature* for today.
Bye-bye guys!
