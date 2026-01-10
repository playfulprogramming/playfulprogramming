---
{
title: "How to Mock dependencies with Jest",
published: "2022-01-12T09:26:13Z",
edited: "2022-11-04T13:38:42Z",
tags: ["testing", "javascript", "webdev"],
description: "When we want to test our code, some things have dependencies inside, and you don't want to call these...",
originalLink: "https://www.danywalls.com/how-to-mock-dependencies-with-jest",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

When we want to test our code, some things have dependencies inside, and you don't want to call these stuff. You won't be sure your code works, not external dependencies or external code not related to my code.

Today we will add tests into our example weather app using Jest and Mock the dependencies.

## The app
Our example app has two principal codes, the `weatherAPI.js` and `showWeather.js`; the `showWeather` uses weatherAPi.js code to display the data.

The weatherAPI.js
```javascript
const getWeather = (format) => {
    const min = format = 'C' ? 50 : 100;
    return  50;
}

module.exports = { getWeather}
```
The showWeather.js 
```javascript
const weatherAPI = require('./weatherAPI');

const messageWeather = () => {
    let weather = weatherAPI.getWeather('C');
    return `Today weather is ${weather}, have a nice day!`
}

module.exports = { messageWeather }
```

We have a clear idea about our app, and the next step is to add tests for showWeather code.

> You see the final example code from GitHub repo https://github.com/danywalls/02-mocking-code

## Writing the test

We use jest functions `test` to declare our test and the assertion functions `expect` and `toBe` matchers.

> The idea focuses on mocking; to read more about the assertion functions, feel free to read [the official documentation](https://jestjs.io/docs/expect).



```javascript
const weatherAPI = require('./weatherAPI');
const { messageWeather } = require('./showWeather');

test('should return weather message with celsius temperature', () => {
    const result = messageWeather();
    const expected = `Today weather is 50, have a nice day!`;
    expect(result).toBe(expected);
})

```
Run our test npx jest, and all test works using our mocks!

```bash
 PASS  ./showWeather.test.js
  Show Weather functions
    ✓ should return weather message with celsius temperature (3 ms)
    ✓ Should return async weather (1 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.383 s, estimated 1 s
```
Nice, but our test calls the getWeather using the actual code, and my test only needs to cover the showWeather code.

## How to fake the weatherAPI methods? 

Jest provides a few ways to mock the weatherAPI methods. 

- Override the methods with j [est.fn](https://jestjs.io/docs/mock-functions#using-a-mock-function) 
- Use  [jest.spyOn](https://jestjs.io/docs/jest-object#jestspyonobject-methodname)  
- Mock the module with  [jest.mock](https://jestjs.io/docs/es6-class-mocks#the-4-ways-to-create-an-es6-class-mock) 

We will use the three options, with the same result but each, you can pick which is better for you.

## Override functions with jest.fn

The easiest way is to reassign the getWeather method and assign a jest.fn mock function, we update the test with the following points.

- assign jest.fn and return 20 by default. 
- validate the getWeather method to get the C parameter.
- validate the result and expect are equal.

```javascript
test('should return weather message with celsius temperature', () => {
    weatherAPI.getWeather = jest.fn((format) => `20`);

    expect(weatherAPI.getWeather).toHaveBeenCalledWith('C');
    const result = messageWeather();
    const expected = `Today weather is 20, have a nice day!`;

    expect(weatherAPI.getWeather).toHaveBeenCalledWith('C');
    expect(result).toBe(expected);
    weatherAPI.getWeather.mockRestore();
})

```

> The function mockRestore assigns the original value to getWeather function.

## Use jest.spyOn 
The spyOn help us to assign a mock function to the object, in our case, the weatherAPI object.

The spyOn override and the function getWeather mock have the mock implementation function to return the simulated value.

```javascript
    jest.spyOn(weatherAPI, 'getWeather')
    weatherAPI.getWeather.mockImplementation((format) => `20`)

    const result = messageWeather();
    const expected = `Today weather is 20, have a nice day!`;
   
    expect(weatherAPI.getWeather).toHaveBeenCalledWith('C');
    expect(result).toBe(expected);

    weatherAPI.getWeather.mockRestore();

```

## Mock the module 

Instead of mocking every function, jest helps us mimic the entire module using jest.mock.

Create  __mocks__ directory into the same path of the file to mock, export the functions, and create the module's name in our case weatherAPI.


```javascript
module.exports = {
    getWeather: jest.fn((format) => `20`)
}
```
In our test, the to jest uses the mock module with jest.mock.

```javascript
jest.mock('./weatherAPI');
test('should return weather message with celsius temperature', () => {
    
    const result = messageWeather();
    const expected = `Today weather is 20, have a nice day!`;
    expect(weatherAPI.getWeather).toHaveBeenCalledWith('C');
    expect(result).toBe(expected);
    weatherAPI.getWeather.mockRestore();
  
})

```

## Testing async functions

Async functions are very common in our code, lets add a new function promise into the weatherAPI and use it, in the showWeather.js.

> Read more about  [async and await keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)  

```javascript
const getMetaWeather = async () => {
    return new Promise((resolve) => {
        resolve('Summer time!')
    })
    
}

module.exports = { getWeather, getMetaWeather}
```

The getMetaWeather function is a promise, to use it in our new function showWeatherStatus, we use the await and async to wait for the getMetaWeather response.

```javascript
const showWeatherStatus = async () => {
    let weather =  await weatherAPI.getMetaWeather();
    return `${weather}, Enjoy!`
}

module.exports = { messageWeather, showWeatherStatus }
```

The next step is to update our test to cover the showWeatherStatus, editing the __mocks__/weatherAPI.js to return the mock version of the getMetaWeather function returns a promise with the mock data.

```javascript
getMetaWeather: jest.fn(() => new Promise((resolve) => resolve('Great day') ))
```

We create a new test for async weather status,  but using the async and await keyword because we update the mocks, our tests automatic will get the mocking example :)

```javascript
test('Should return async weather status', async () => {
    const result = await showWeatherStatus();
    const expected = 'Great day, Enjoy!';
    expect(result).toBe(expected);
})
```


Perfect, run your test `npx jest` and all cases works using mock data.

```bash
 PASS  ./showWeather.test.js
  Show Weather functions
    ✓ should return weather message with celsius temperature (3 ms)
    ✓ Should return async weather (1 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.383 s, estimated 1 s
```

## Final

Jest makes it easy to test our code and external dependencies. I recommend using the __mocks__ overriding the complete module because it makes it easy to update the mocks and read the tests because it only has assertions methods.

If you want to read more about mocking with jest, please read the  [official documentation.](https://jestjs.io/docs/mock-functions) 

Photo by <a href="https://unsplash.com/@kc_gertenbach?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Christian Gertenbach</a> on <a href="https://unsplash.com/s/photos/fake?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  