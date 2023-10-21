---
{
    title: 'When to use HashMap instead of Loop',
    description: 'Learn to use when to use HashMap instead of Loop',
    published: '2022-06-24T05:12:03.284Z',
    edited: '2022-06-27T05:12:04.284Z',
    tags: ['javascript', 'computer science'],
    originalLink: 'https://dev.to/kaleemniz/when-to-use-map-instead-of-loop-3cda',
    license: 'cc-by-nc-nd-4'
}
---
Many programmers use a **loop** or **filter** where HashMap data structure could be considered.

## Finding user by id using Loops
```js
let userIdToBeSearched = 103;
const users = [
    {id: 101, name: "Josh"},
    {id: 102, name: "Mosh"},
    {id: 103, name: "Eli"},
    {id: 104, name: "Jad"},
    {id: 105, name: "Susan"}
];

let user = null;
for (let i = 0; i < users.length; i++) {
    if (users[i].id === userIdToBeSearched) {
        user = users[i];
        break;
    }
}

if (user) {
    console.log("User Found: ", user);
} else {
    console.log("user does not exit with id: ", userIdToBeSearched);
}
```
The above solution has a time complexity of **O(n)**, where n represents the number of users. If there are 1 thousand users, in the worst case, we will search every user to find a match.

> Considering user id will be unique for each user, this is a good indication to use a HashMap instead of a loop since all keys in the Map are Unique.

## Finding user by id using Map
```js
let userIdToBeSearched = 103;
const users = new Map();
users.set(101, {id: 101, name: "Josh"});
users.set(102, {id: 102, name: "Mosh"});
users.set(103, {id: 103, name: "Eli"});
users.set(104, {id: 104, name: "Jad"});
users.set(105, {id: 105, name: "Susan"});

if(users.has(userIdToBeSearched)){
  console.log("User Found: ", users.get(userIdToBeSearched));
}
else {
  console.log("user does not exit with id: ", userIdToBeSearched);
}
```
When using a **Map**, it takes constant time **O(1)** to find the user! All great, but note constructing the HashMap from the array still requires **O(n)** time.

In conclusion, use Map when frequently searching based on the **unique** field such as **id**. Please note Map cannot be used in case of searching based on the non-unique field such as **name**

Thank you for reading! Check the part 2 where we discuss **A Practical Use Case** of HashMaps. [When to use HashMap instead of Loop Part 2](https://dev.to/kaleemniz/when-to-use-hashmap-instead-of-loop-part-2-31pi)
