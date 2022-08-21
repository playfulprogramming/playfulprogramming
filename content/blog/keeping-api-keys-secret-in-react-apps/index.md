---
{
    title: 'Keeping API Keys Secret in React Apps',
    description: 'Save yourself money by hiding your API keys from prying eyes and nasty bots.',
    published: '2020-04-20T22:07:09.945Z',
    authors: ['MDutro'],
    tags: ['react', 'node'],
    attached: [],
    license: 'cc-by-nc-nd-4'
}
---

React is a powerful JavaScript library that can make front end magic happen on screen. If you are on the path to understanding components, props, and state there are a lot of great free resources out there to help you along the way.

It doesn't take long before you begin learning how to make calls to external APIs. Getting data and manipulating it to populate great UI design is a big part of any front end developer's job, whether that data comes from an external source or from an internal API that links to your company's private customer database.

But there are a few pitfalls out there for the unwary new React developer. One of the big traps that can catch you off guard early on has to do with safely storing keys for external API calls. Personally, I had a hard time finding resources on how to accomplish this goal. In the end, I got the answers from a mentor, but I wanted to provide clear, written instructions on how to keep your API keys away from the prying eyes of nefarious bots and users.

What does that mean?

# Browsing in Public {#public}

Well, as it turns out, anything that happens in the browser basically happens out in the open. Anyone who knows how to open a developer console can see the output of the JavaScript console, the results of network requests/responses, and anything hidden in the HTML or CSS of the current page. While you are able to mitigate this type of reverse-engineering by randomizing variable names in a build step (often called "Obfuscating" your code), even a fairly quick Google session can often undo all of the efforts you took to muddy the waters. The browser is a terrible place to try to store or use secret information like unencrypted passwords or API keys - and React runs in the browser!

In other words, React keeps no secrets from the user which means that it's a terrible place to keep _your_ secrets.

So, what is the answer? How do you keep your API keys from falling into the hands of vicious web scraping bots in React? It's simple, really. You don't keep your secrets in React at all.

We can't keep things like API keys a secret in React because it runs in the browser on the user's computer. The solution is to make sure your React application never sees the API key or uses it all - that way, it is never sent to the user's local machine. Instead, we have to get a proxy server to make our API calls and send the data back to the React app.

# What is a Proxy Server? {#proxy}

If you are unfamiliar with the term "proxy server", that's alright! If you think about how a React app would typically interface with an API, you'd have a `GET` call to the API server in order to get the data you want from the API. However, for APIs that require an API key of "client\_secret", we have to include an API key along with the `GET` request in order to get the data we want. This is a perfectly understandable method for securing and limiting an API, but it introduces the problem pointed out above: We can't simply bundle the API key in our client-side code. As such, we need a way to keep the API key out of reach of our users but still make data accessible. To do so, we can utilize another server (that we make and host ourselves) that knows the API key and uses it to make the API call _for_ us. Here's what an API call would look like without a proxy server:

![API request](./api_request.svg)

Meanwhile, this is what an API call looks like with a proxy server:

![Proxy server API request](./proxy_request.svg)

As you can see, the proxy server takes calls that you would like to make, adds the API key, and returns the data from the API server. It's a straightforward concept that we can implement ourselves.

# How to use a Proxy Server {#how-to-use}

It might make more sense to talk about things the other way around and start with the front end. Instead of using React to make a direct request to an API for information, we tell React to send an HTTP request to our proxy server. Since we are writing our front end application in JavaScript, it makes life a little easier to write our server in Node, though you could use Ruby or Python or any other back end friendly language if you want.

Let's take a look at a couple of code samples and get down to the details. The code snippets below are from an app I am developing that shows you the weather on Mars from the past week. The data is collected from NASA's InSight lander and is available from the [space agency's open APIs](https://api.nasa.gov/).

```javascript
// Get weather data from NASA API
componentDidMount() {
    fetch("http://localhost:3001")
        .then(res => res.json())
        .then(data => {
        const weather = data.sol_keys.map(key => {
            data[key].AT.dayNumber = key*1;
            // Add a key: value pair to toggle between Celsius and Farenheit
            data[key].AT.isFarenheit = 'C';
            return data[key];
        });
        this.setState({ weather });
    })
        .catch(console.log);  
} 
```

This is an example of a basic HTTP request in React using the `fetch` API. This `fetch` request is wrapped in a `componentDidMount()` so the request is made when the component initially loads. The thing to note here is that the `fetch` request is to your development environment for the proxy server running on your own machine instead of directly to NASA's external API. React won't keep our secrets so we make sure the browser is communicating with the proxy server.

> Remember that you can't run two things on the same port! So make sure that your development server and React app are running on different ports - 3000 and 3001 will work just fine.

Since `fetch` returns a promise, we tack on a few `.then`s to do something with the data once we get it. In this case, since I'm using the `fetch` API, we need to parse the response into JSON with `res => res.json()`. NASA's JSON object's structure is a little awkward since I want to use the "day number" as a prop and NASA uses it as a key, so I add a couple of lines of code to manipulate the data and make it easier to use later. Finally, I use `this.setState()` so I can use it, pass it to child components, and otherwise bend it to my will.

All of this works without React ever making a direct connection to the NASA API.

So let's take a look at where we make that connection on the server side.

```javascript
app.get('/', (req, res) => {
  const marsUrl = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;
  axios.get(marsUrl)
  .then(response => response.data)
  .then(response => res.send(response))
  .catch(err => console.log(err))
});
```

This snippet shows part of the server for my Mars Weather app written in Node.js and Express.js. Let's walk through it.

First, the server is listening for a call to the root route. Since the app itself only has one page, and I want to get the latest Martian weather data when the page loads, this works great. That said, you might want to change the route name in Node and React depending on your deployment strategy.

Next, I construct a URL using an ES6+ template literal. That's because I'm using a variable for my API key, the `mars` in the middle of the constructed URL. How does that variable work? Where does it come from? Don't worry, we'll get there!

The next block of code is an HTTP request using the `axios` library. In case, you're not familiar, `axios` is a library that makes HTTP requests easier and provides some simple ways to provide parameters and manipulate the resulting data. I used it here to show a different way to make an API call, but could have just as easily used the `fetch` API in Node too. Here, `axios` makes a get request to our constructed URL named `marsURL`.

Just like `fetch`, `axios` returns a promise. So we get the data portion of the response object and send it back to the React app running in the browser which is waiting patiently for it thanks to the power of asynchronous JavaScript.

There are a couple of things I should mention before I show you where I hid my super-secret API key. First, you will need to make sure your server is using `cors`. A full explanation of [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) is beyond the scope of this article, but the short version is that the cross-origin HTTP requests are a security no-no by default. In other words, it will stop you from accessing requests from different origins. Fortunately, Express.js provides a simple, built-in way to solve this problem. Just toss `const cors = require('cors')` at the top of your server and make sure to include `app.use(cors())` before your `axios`/`fetch` requests and you should be now able to make cross-origin requests on your server.

The other thing is a little more ES6+ in `axios`. Because it returns a promise, `axios` supports the use of the `async` and `await` keywords. To use them with `axios`, you could refactor our Node `axios` request above to something like this:

```javascript
app.get('/', async (req, res) => {
	const marsUrl = 'https://api.nasa.gov/insight_weather/?api_key=' + mars + 	'&feedtype=json&ver=1.0';
	try {
		const response = await axios.get(marsURL);
		res.send(response.data)
	} catch (error) {
		console.error(error);
	}
}
```

With that out of the way, let's get to the good part - keeping your API keys out of your source code!

# Environmental Variables and You {#environment}

Most of the time, we want to keep things like API keys and other credentials out of the source code of an app. There are some very good security reasons for this practice. For one thing, if your project is open source and hosted on a place like GitHub, it will be exposed to anyone browsing the website, not to mention the fact that there are some less-than-savory people out there who have written web scraping scripts to look for publicly exposed API keys and exploit them. Furthermore, even for private projects API keys integrated into the source code is a potential security vulnerability. A hacker could find a way into your system and compromise the usage of the API key. Being able to hide them away in a more configurable manner might keep things safer.

The trick to hiding your API keys and other credentials is to use environmental variables. If those sound intimidating, don't worry, they are actually pretty simple to understand and easy to use. In basic terms, environmental variables are variables that are set outside of the program itself, the Node server in our case.

Once we set some environmental variables, we import them into the server code so we can access and use them. This keeps our secrets out of the code itself since they are only referenced by the variable name we have assigned them.

Let's break all of this down and take it step by step using the Mars Weather app as an example.

For a production environment, we would typically set environmental variables in a secure file that's [then injected into our bash environment](https://www.serverlab.ca/tutorials/linux/administration-linux/how-to-set-environment-variables-in-linux/). Alternatively, your server host might have a solution to safely store environmental variables. Be sure to research a bit about how to do so in a production environment for your use-case. For development mode, however, we store our variables in a file called `.env`

First, create a file named `.env` and place it in the root directory of your project. In my `.env` I have exports that look something like this: `MARS_KEY=[API key goes here]`. Make sure your variable name is in all caps and that there are no spaces around the `=`. As usual, the syntax is important!

```
MARS_KEY=asdfasdfasdf
```

Next, we head back to our server code and add `const mars = process.env.MARS_KEY` at the top of your file with all of your `require()` statements. Now you're ready to use your secret API key (or whatever it is).

As usual, there are a couple of caveats. For one, you actually have to tell the server to use the environmental variables. Fortunately, that's easy - just type `source .env` into your command line before you start your server. It's no problem to do that in development but once in production, you might run into problems if your host server ever restarts for some reason. One solution is to use the `dotenv` npm package in your Node server, which will make sure the environmental variables are loaded automatically. All you have to do is put `require('dotenv').config()` as early as possible in your server code. I include it on line 1 just to be safe.

The other potential "gotcha" is to make sure to include the `.env` file in your project's `.gitignore`. Otherwise, you will find the API key you have worked so hard to keep secret posted on GitHub for the world to see. Not sure how to do that? Just open up your `.gitignore` file. It should be located in your project's root directory - if not, just make one. Then type `.env` on the next available line of the file and save it. That's all there is to it! Now you won't accidentally upload your secret credentials to GitHub, which would totally defeat the purpose of hiding them in the first place. If you do accidentally post your `.env` file to GitHub, the best thing to do is to add the file to your `.gitignore` and request a new API key from the external API service you are using.

Now, It's true that you can use environmental variables in React. But they [will not keep your secrets](https://create-react-app.dev/docs/adding-custom-environment-variables/) the way they do in Node! Those variables will be embedded into your React build, which means that anyone will be able to see them.

# Conclusion {#conclusion}

Now you know how to whip up a simple Node server and use environmental variables to keep your secrets when making API calls with front end libraries/frameworks like React. It's actually pretty easy and can serve as an introduction to the basics of Node and Express if you haven't had a reason to use them before.

If your app is meant for your own educational purposes and you don't intend to deploy it, you might not have to worry about hiding your valuable API keys too much, though you should still make sure not to upload them to GitHub.

Either way, following these steps will make your API calls more secure and keep your API keys a secret, tucked safely away on your deployment server and let you focus on presenting the API response data in interesting and user-friendly ways.
