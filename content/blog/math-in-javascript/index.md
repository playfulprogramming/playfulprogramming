---
{
    title: "Math in JavaScript",
    description: "Math in JavaScript may seem simple and sometimes easy, but sometimes what seems right is wrong.",
    published: '',
    authors: ['Jerico'],
    tags: ['math', 'javascript'],
    attached: [],
    license: 'cc-by-4'
}
---

JavaScript is a language usually used for general math when used in software, but it’s how you do the math that’s important.

In this article, I will explain the basics of doing math in JavaScript and how to expand on it.

## Math Js
Math Js is a built-in object for JavaScript that does math. A good starting example of Math Js would be solving and returning a basic equation like this.

```
console.log(Math(1+1)); //Result 2
```

The code above shows the math function being used for a simple equation like one plus one and giving a result of two.  

The symbols use in Math Js is “+” for adding, “-” for subtraction, “*” for multiplication, and “/” for dividing.
 
Math Js is commonly used for concatenating and changing variables to solvable equations. We use “.toNumber” to change our equation that’s in string form, that we have concatinate to, to number form something we can feed to Math Js and get a result on. 

```
let string = "1+1";

string.concat("+2"); //Add more to the sring at the end  of it.

string = string.toNumber();

console.log(Math(string)); //Result 4
```

Some think doing math in variables is the proper way to do math in JavaScript, but this is an un-well practice as lots of the times when working in the field you will have many changing values. That's why using Math and using its features need to be understood. 

Math also has features like Math.PI which gives a value of PI and others listed below.

```
console.log(Math.PI) //Returns 3.14

console.log(Math.ceil(0.86)); //Returns 1 rounds up

console.log(Math.floor(3.87)) //Returns 3 rounds down

console.log(Math.pow(7, 3)) //Returns 343 does a number to a power
```
Math in JavaScript has so many uses and features. I hope you gained something from this short introduction, and I also hope you have a good day. 

Sources: 
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math



