---
{
	title: "Making a Slack Bot using NodeJS and MongoDB",
	description: 'Join us as we teach you how to create a Slack bot from scratch using their Node SDK and MongoDB for persistence',
	published: '2020-02-18T05:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['mongodb', 'node', 'slack'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}

---

Modern-day remote live communication has never been as efficient or fast as it is today. Services like Slack make it easy to join huge multi-channel communication workspaces for pleasure or business. These channels are often able to be super-powered by in-chat bots and applications that can inform you of new information from external services or even add new functionality to the chat. Luckily for us, Slack has put a lot of effort into making these extensions to Slack easy to write.

One way they've made extension development easier is by providing an SDK for Node developers to use and create extensions with. This post will outline how we can create a Slack bot to add functionality to chats.

# Initial Signup {#signup-for-dev-account}

To start, we'll need to [sign up for a developer account and create an app to host our application logic using this link](https://api.slack.com/apps). This will allow us to create new Slack apps and bots to add into our workspace.

![The create app dialog that shows up once "create app" is pressed](./create_app_dialog.png)

Enter in an app name, and assign the workspace where you want the app to live during development. Once done, you should be greeted by a dashboard for your Slack app. You'll want to keep this screen open during development, as we'll be referring to it throughout this post.

![The initial screen that'll be shown when a new app is created](./initial_screen.png)

This screen (and the tabs off to the side) provides the configuration for all of the interactions with Slack that we'll build upon with our code. We're even able to customize the look of our application in our Slack settings at the bottom of this homepage.

![Towards the bottom of the initial page will show how to customize the description and such.](./display_info.png)

As mentioned previously, Slack provides an SDK for Node applications. [You can find the homepage for the npm package at the following URL.](https://github.com/slackapi/node-slack-sdk)

In order to quickly set up the SDK, we'll create a new directory for our code to live. Once we have a clear directory, we can run:

```
npm init -y
```

To setup an initial `package.json`. Once we have a `package.json`, we can add the packages we require to use the Slack SDK:

```
npm install @slack/web-api @slack/events-api
```

After this, we'll then be able to use their example API from the README of their project as a starter for our app:

```javascript
// index.js
// Initialize using signing secret from environment variables
const { createEventAdapter } = require('@slack/events-api');
// Slack requires a secret key to run your bot code. We'll find and figure out this signing secret thing in the next steps
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const port = process.env.PORT || 3000;

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on('message', (event) => {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

// Start a basic HTTP server
slackEvents.start(port).then(() => {
  // Listening on path '/slack/events' by default
  console.log(`server listening on port ${port}`);
});
```

This code is what we'll need to run a `console.log` every time a user sends a message. However, _we'll need to set things up more to get this code actually working due to Slack's permissions systems_ and such. For now, we'll save this code to `index.js` in the same folder we saved our `package.json` file.

Another thing that was mentioned in the code sample was the `process.env.SLACK_SIGNING_SECRET`. This is the key that Slack will use to connect your code to your workspace. We'll want to keep in mind how to store the signing secret (as the name implies, _we want to keep this key a secret as otherwise anyone can hijack your Slack app_). As the above code hints at, it's suggested to use an environment variable file or configuration.

While environment variables are typically assigned by system configurations, we'll make development easier by setting up a `.env` file with the expected credentials. Then, to inject the `.env` file contents into our process, we'll run our code using [the `env-cmd` package](https://www.npmjs.com/package/env-cmd). We'll start by installing the package:

```
npm i env-cmd
```

This package will look for a `.env` file and inject it into your command that follows `env-cmd`. So, for example, you can **make a new file called `.env` and place the following contents in it**:

```
SLACK_SIGNING_SECRET=<SIGNING_SECRET_FROM_HOMESCREEN>
```

Then, in your `package.json`, you can **edit your `start` script** to reflect the following:

```json
{
  "scripts": {
    "start": "env-cmd node ./index.js"
  }
}
```

Now, whenever your code uses `process.env.SLACK_SIGNING_SECRET`, it'll represent the value present in your `.env` file.

# Development Hosting {#development-environment-setup}

In order to have these events called, we'll need to get a public URL to route to our local development server. In order to do this, we can [use `ngrok`](https://github.com/inconshreveable/ngrok) to host a public URL in our local environment:

```
npm i -D ngrok
npx ngrok http 3000
```

> Keep in mind that this should NOT be used to host your Slack application when you're ready to publish.
> This should only be used during development process. In order to see how to deploy, you'll want to check out [the section on doing so using Heroku](#deployment).

After doing so, you should be given an `ngrok.io` subdomain to map to your local IP address with a message like this:

```
Forwarding https://9fca9f3e.ngrok.io -> http://localhost:3000
```

![Showing ngrok running in the terminal](./ngrok_running.png)

We're now able to use this URL as a bridge between the external internet and the local environment we're in. This is how we'll tell Slack to run our `index.js` file when we receive a new event.

However, there's yet another step to enable the functionality. Slack, in order to ensure security, wants to confirm that you own this domain. As such, they have _a utility you'll need to run to ensure that you own the domain_. So, for example, in order to add in the events subscription to our current code, we'll run the following command:

```
./node_modules/.bin/slack-verify --secret <signing_secret>
```

Where the `<signing_secret>` is the same signing secret from the `.env` file.

![Showing the command running](./slack_verify.png)

With this command still running, you can **press on the "Add features and functionality" tab** in the homescreen you saw when you first created your Slack app in the browser. Once the "features and functionality" is open, **press "Event Subscriptions"**.

This will bring you to a page with an "On/Off" toggle. **Toggle it to "On"** and **add the `ngrok` domain** in the request URL.

![Adding the ngrok domain into the "event subscription" area](./event_subscription_enable.png)

This should show "Verified" to explain that your domain is verified to have belonged to you, but the domain isn't saved yet; We first need to **add workspace events to subscribe to**. This is to ensure that any app doesn't simply have root permissions to everything for privacy and security's sake and instead has to ask for granular permissions.

![Searching for OAuth permissions to add to the event handler.](./searching_events.png)

Let's say we want to handle all of the public messages to a channel, we can add `message.channels` to get the permissions to do so.

![After adding the permission and the app is saved, it should look like this](./added_channels_read.png)

If you look through the code that we now have in the `index.js` file, you'll see that we're listening for `messages`:

```javascript
slackEvents.on('message', (event) => {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});
```

I can hear you asking "But here we're requesting `message.channels`, how do we know that those two match each other?"

You can actually check the event `type` from [the API reference documentation](https://api.slack.com/events/message.channels) to see that the `type`s match up.

# Development App Installation {#development-installation}

You'll notice, as I first did, that if you start your server with `npm start` and then send a message to a public channel that you'll notice something in your terminal. Or, well, rather, a lack of something in your terminal. The `console.log` that you would expect to run isn't doing so - why is that?

That's because the app isn't actually enabled in your workspace yet (A real 🤦‍♂️ for me when I discovered this one).

To do so, check the sidebar to the right of your Slack API homepage for the `install` section:

![The preview of the "install" page](./install_app.png)

Simply click `Install App to Workspace`, then `Allow` to give permissions to add the app to your workspace.

> Keep in mind, folks can use Slack for personal communication. You may want to give folks in your workspace a heads-up or simply create a new Slack workspace for testing.

Once this is done, you can send a test message to a public channel and see it printed out in your console!

![A showcase of the message "Hello, World" being sent to the app](./hello_world.png)

# App Interactivity {#interactive-message-package}

While listening to events alone can be very useful in some circumstances, oftentimes having a way to interact with your application can be very helpful. As a result, the Slack SDK also includes the `@slack/interactive-messages` package to help you provide interactions with the user more directly. Using this package, you can respond to the user's input. For example, let's say we wanted to replicate the [PlusPlus](https://go.pluspl.us/) Slack bot as a way to track a user's score.

We want to have the following functionality for an MVP:

- `@UserOrThing++`: A way to add a point to a user or thing
- `@UserOrThing--`: A way to remove a point from a user or thing
- `@PointsRUs leaderboard`: A flat list of the items/people with points

Each of these messages will prompt the bot to respond with a message in the same channel. Ideally we'd use a database to store score for long-term projects, but for now, let's use in-memory storage for an MVP of the interactivity we're hoping for.

## Setup {#interactive-bot-setup}

First and foremost, something you'll need to do is add a new OAuth permission to enable the functionality for the bot to write to the channel. Go into the dashboard and go to the "OAuth & Permissions" tab. The second section of the screen should be called "Scopes", where you can add the `chat:write:bot` permission.
![The permissions searching for "chat" which shows that "chat:write:bot" permission we need to add](./chat_write_bot_oauth.png)

After enabling the new OAuth permission, you'll need to reinstall your app. This is because you're changing the permissions of your apps and you need to accept the new permissions when you reinstall the app. If you scroll to the top of the same OAuth page, you should see a `Reinstall App` button that will help you do this easily.

![The top of the "OAuth & Permissions" screen that shows that access token and the "Reinstall app" button](./oauth_tokens.png)

Once this is done, you can access the OAuth token for the fresh installation of your workspace. This token will enable us to send messages to the workspace itself. It acts as a user-login of sorts for your Slack bot.

> This token is unique per-workspace, so if you're intending for a broader release of your bot (to be easily added to multiple workspaces with a single button click), you'll likely need to [walk through their OAuth token request system](https://api.slack.com/authentication/oauth-v2#asking). Since this is meant as an introductory look at their APIs, we'll simply keep things locally and copy-paste.

Copying the token from the top of the screen, store it into our `.ENV` file so that we can utilize it in our application. I named the environment variable `OAUTH_TOKEN`, so when you see that in code examples, know that this is in reference to this value.

## The Code {#leaderboard-local-code}

To start adding in response functionality, we need to install the package that'll allow us to use the web API:

```
npm i @slack/web-api
```

The web API should enable us to use the [`postMessage`](https://api.slack.com/methods/chat.postMessage) method to send messages to a channel when they send a message.

Once this is installed, we're able to instantiate the web API with the OAuth token we grabbed earlier

```javascript
const { WebClient } = require('@slack/web-api');
const token = process.env.OAUTH_TOKEN;
const web = new WebClient(token);
```

After this is setup, we could run code like:

```javascript
web.chat.postMessage({
  text: 'A post message',
  channel: channelId,
});
```

To send a message. Let's try to use this API to add some trivial logic into our existing `events` listening functionality.

```javascript
const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/web-api');

const token = process.env.OAUTH_TOKEN;
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;

const slackEvents = createEventAdapter(slackSigningSecret);
const web = new WebClient(token);
const port = process.env.PORT || 3000;

slackEvents.on('message', async event => {
	console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);

  // Check if the text includes the text we'd want to use to check the leaderboard
	if (/@pointsrus leaderboard/i.exec(event.text)) {
		const result = await web.chat.postMessage({
      // We'll add more functionality in the future. We just want to test it works, first
			text: 'This should output a leaderboard',
			channel: event.channel,
		});

		console.log(`Successfully send message ${result.ts} in conversation ${event.channel}`);
	}
});

slackEvents.on('error', console.error);

slackEvents.start(port).then(() => {
	console.log(`server listening on port ${port}`);
});
```

As it did before, the code will listen for every message we send. Then, we listen for any time the user typed the message `@pointsrus leaderboard` and respond with a placeholder value when they do so. We're making sure to use the same channel ID by using the `event.channel` property.

> Remember, the channel ID is not the same thing as the human-readable channel name. It's a unique ID generated by Slack and as such you'd have to use the API to get the channel ID if you only knew the human-readable name

## Adding State {#interactive-local-state}

Luckily for our MVP, we've already outlined that we won't be using a database for the initial version of the bot. As such, we're able to keep a simple stateful object and simply mutate it to keep track of what's being scored.

For example, given a mutable `state` variable, we can do actions to read and write as such:

```javascript
const state = {};
state.word1 = 1;
state.word1 = state.word1 + 1;
state.word2 = -1;
console.log(state); // {word1: 2, word2: -1}
```

Following this pattern, let's go through and add a few lines of code to the last example to fulfill the expected behavior:

````javascript
const { tablize } = require('batteries-not-included/utils');

/**
 * @type <Record<string, number>> A record of the word and score. Should start at 0.
 * This should be replaced by a database for persistence. This is just a demo and as
 * such simply mutates this object to be stateful.
 */
const state = {};

/**
 * A function that accepts a string, then returns the action and the word to score.
 */
const getIsPlusOrMinus = str => {
	// Accept em-dash for cases like MacOS turning -- into an emdash
	const plusOrMinusRegex = /\@(\w+?)(\-{2}|\+{2}|\—{1})/;
  // The first item in the array is the full string, then the word to score, then the opperator
	const [_, itemToScore, scoreStr] = plusOrMinusRegex.exec(str) || [];
	switch (scoreStr) {
		case '--':
		case '—':
			return { action: 'minus', word: itemToScore };
		case '++':
			return { action: 'add', word: itemToScore };
		default:
			return { action: '', word: undefined };
	}
};

slackEvents.on('message', async event => {
	console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);

	const { action, word } = getIsPlusOrMinus(event.text);
  // If the `event.text` did not include a score (of plus or minus), it will return `{}`
  // And therefore `action` will be `undefined`
	if (action) {
		const currentState = state[word] || 0;
    // Mutate the state to update the score of the word.
		state[word] = action == 'add' ? currentState + 1 : currentState - 1;
		const actionString = action == 'add' ? 'had a point added' : 'had a point removed';
		const result = await web.chat.postMessage({
			text: `${word} ${actionString}. Score is now at: ${state[word]}`,
			channel: event.channel,
		});

		console.log(`Successfully send message ${result.ts} in conversation ${event.channel}`);
	}

	if (/@pointsrus leaderboard/i.exec(event.text)) {
		// Tablize just takes a 2D array, treats the first item as a header row, then makes an ASCII table
		const tableString = tablize([['Item', 'Count'], ...Object.entries(state)]);

		// Send the table in a code block to use a monospace font and render properly.
		const result = await web.chat.postMessage({
			text: '```\n' + tableString + '```',
			channel: event.channel,
		});

		console.log(`Successfully send message ${result.ts} in conversation ${event.channel}`);
	}
});
````

As you can see, we're able to add in the functionality for the score-keeping relatively easily with little additional code. Slightly cheating, but to pretty-print the score table, we're using a `tablize` package that's part of [the "batteries not included" library we've built](https://github.com/unicorn-utterances/batteries-not-included) in order to provide an ASCII table for our output.

# Adding a Database {#mongodb}

Even though the bot works well so far, it's not ideal to keep a score in memory. If your server crashes or if there's any other form of interruption in the process running, you'll lose all of your data. As such, we'll be replacing our local store with a database. As our data needs are simple and I want to keep this article relatively short, let's use a NoSQL database to avoid having to structure tables. We'll use MongoDB in order to keep our data stored.

> This section will cover the setup of MongoDB Atlas, if you'd like to [skip ahead to the code section where we switch our in-memory store with a MongoDB database, you can click here](#mongodb-code)

To remain consistent in keeping our app setup as trivial as possible, we'll be using MongoDB Atlas. Atlas enables us to have a serverless MongoDB service at our disposal. In order to use Atlas, you'll need to [sign up for an account](https://cloud.mongodb.com/user#/atlas/register/accountProfile).

Once done, you'll need to "Build a new cluster" in order to create a database cluster for your Slack app.

![An image of the "Build a new cluster" button](build_a_new_cluster.png)

From here, you'll select the cloud provider that you'll use to host your database. There's AWS, Google Cloud Platform, and Azure. All three of these options have a Free tier that you can use to host smaller applications and have **plenty** of storage and run time for smaller projects.

![The "create new cluster" screen with a price of $0.54 an hour](./create_new_cluster.png)

> While all three have free tiers, you're limited to one free cluster per account. I have already created one, which is why it shows the price in the screenshot above. Yours should be free if you select one of the "Free tier available" hosting locations and read the instructions.

Once the cluster is created, it may take some time to propagate the changes to the hosting solution itself. Once it is done, however, we're able to create a new user for database access. This will allow you to create a user for your MongoDB code to connect to a make interactions. Go to the "Database Access" tab of Atlas and press "Add New User",

![The "Database Access" screen with a "Add new user" button](./database_access.png)

Once there, you'll add a username and password. You'll also want to enable the permission to read and write to a database, seeing as we'll be editing the scores collection in the database.

![A new user creation screen with "dbuser" and "dbpass" as the username and password. Selected to have "full read and write" permissions.](./new_db_user.png)

> Be sure to remember that password! You'll want to store it in your .ENV file as plain text (so be sure you're on a secured computer! You do not want to store your passwords in such insecure ways for production).

We'll store the MongoDB username and password into our `.ENV` file. The username under `MONGOUSER` and the password under `MONGOPASS`.

Once this is done, we'll want to go back to the homepage of the Atlas cluster. You should then see a button labeled "Connect". Press that to start the instructions for how to connect our Node code to MongoDB.

![The image of the cluster0 with the "connect" button highlighted](./mongodb_atlas_connect.png)

This will bring up the dialog for the cluster. You'll see different connection options for Mongo Shell, Compass, or various drivers. Since we'll be using the NodeJS driver to connect our code, we'll select "Connect Your Application".

![Showing the first dialog of "create cluster"](./db_connect_1.png)

This will bring up a dialog where you can select the _Node.JS_ driver. This will give you the connection string with `<username>` and `<password>` that you'll need to replace with the credentials we created earlier.

![The dialog that shows connection string to add to NodeJS code](./db_connect_2.png)

This string is called the _connection string_ which is [a URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier). This URI will be used to connect your code to the database you just created. Let's store that string [in a template literal, which will allow us to interpolate variables into the string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) for the password:

```javascript
const uri = `mongodb+srv://${mongoUser}:${mongoPass}@cluster0-xxxxx.mongodb.net/test?retryWrites=true&w=majority`; 
```

Now that we understand the URI we need to pass to the Node driver to connect to the database, we'll dive into the code we need to change to enable MongoDB.

## The Code {#mongodb-code}

````javascript
const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/web-api');
const { MongoClient } = require('mongodb');
const { tablize } = require('batteries-not-included/dist/utils/index.js');

const token = process.env.OAUTH_TOKEN;
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
// Grab the MongoDB password and username we stored in our env file
const mongoPass = process.env.MONGOPASS;
const mongoUser = process.env.MONGOUSER;
const port = process.env.PORT || 3000;
const uri = `mongodb+srv://${mongoUser}:${mongoPass}@cluster0-xxxxx.mongodb.net/test?retryWrites=true&w=majority`;

const slackEvents = createEventAdapter(slackSigningSecret);
const web = new WebClient(token);
const dbClient = new MongoClient(uri, { useNewUrlParser: true });

// Connect to Mongo server instance
dbClient.connect(err => {
	// Show any errors that showup in the 
	if (err) console.error(err);
  // Connect to the test database in a cluster. Connect to the scores collection in that database
	const collection = dbClient.db('test').collection('scores');

	const getIsPlusOrMinus = str => {
		const plusOrMinusRegex = /\@(\w+?)(\-{2}|\+{2}|\—{1})/;
		const [_, itemToScore, scoreStr] = plusOrMinusRegex.exec(str) || [];
		switch (scoreStr) {
			case '--':
			case '—':
				return { action: 'minus', word: itemToScore };
			case '++':
				return { action: 'add', word: itemToScore };
			default:
				return { action: '', word: undefined };
		}
	};

	slackEvents.on('message', async event => {
		try {
			console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);

			const { action, word } = getIsPlusOrMinus(event.text);
			if (action) {
				const value = action == 'add' ? 1 : -1;

				// Update the document and also return the document's value for us to use
				const doc = await collection.findOneAndUpdate(
					{ word },
					// Add `value` to "count" property. If `-1`, then remove one from "count"
					{ $inc: { count: value } },
					// `returnOriginal: false` says to return the updated document
					// `upsert` means that if the document doesn't already exist, create a new one
					{ returnOriginal: false, upsert: true }
				);

				const actionString = action == 'add' ? 'had a point added' : 'had a point removed';

				const result = await web.chat.postMessage({
					text: `${doc.value.word} ${actionString}. Score is now at: ${doc.value.count}`,
					channel: event.channel,
				});

				console.log(`Successfully send message ${result.ts} in conversation ${event.channel}`);
			}

			if (/@pointsrus leaderboard/i.exec(event.text)) {
				const topTenCollection = await collection
					// Find ANY document 
					.find({})
					// Sort it from highest to lowest
					.sort({ count: 1 })
					// Limit it to 10 in case there are hundreds of values
					.limit(10)
					// Then, return it as a promise that has an array in it
					.toArray();
				// Mapping the array to display with `tablize`
				const state = topTenCollection.map(doc => {
					return [doc.word, doc.count];
				});
				const tableString = tablize([['Item', 'Count'], ...state]);

				const result = await web.chat.postMessage({
					text: '```\n' + tableString + '```',
					channel: event.channel,
				});

				console.log(`Successfully send message ${result.ts} in conversation ${event.channel}`);
			}
		} catch (e) {
			console.error(e);
		}
	});

	slackEvents.on('error', console.error);

	slackEvents.start(port).then(() => {
		console.log(`server listening on port ${port}`);
	});
});
````

If you do a diff against the previous code, you'll see that we were able to add the database using only 4 or 5 new operations. These operations are to:

- Connect to the Mongo driver
- Create a new connection to the database
- An update and get query
- A find query to list the leaderboard

Because we now have a database running the data show, we can be sure that our data will persist - even if or when our server goes down (either for maintenance or a crash). Now that we have the code updates, let's get to deploying the code we had set up.

# Deployment {#deployment}

Ideally, since our Slack app is a small side project, we'd like to host things in a straightforward manner for cheap/free. One of my favorite hosting solutions for such projects is [Heroku](heroku.com/). Heroku is no stranger to Slack apps, either. They have [an official blog post outlining making their own Slack bot using the web notification feature within Slack](https://blog.heroku.com/how-to-deploy-your-slack-bots-to-heroku). That said, our route is going to be a bit different from theirs because we chose to use the events subscriptions instead.

Let's start our step-by-step guide immediately after [you've created an account with Heroku](https://signup.heroku.com/).

Once you're logged in, you should see a dashboard like the following:

![The dashboard of Heroku with the "New" dropdown showing an option to "Create a new app"](./heroku_create_dropdown.png)

Once you see this page, select "New", then "Create new app".

![The "Create a new app" page with the "points-r-us" name shown as available](./heroku_create_naming.png)

This should let you provide a name for your project. This name should be memorable, since it will be used to generate the subdomain on Heroku's servers. For example, my `points-r-us` app is available at [points-r-us.herokuapp.com/](https://points-r-us.herokuapp.com/). While ultimately it doesn't matter much for a simple Slack bot, if you wanted to use this subdomain for other things later on that you might add on, it helps to have a memorable name.

Once this is done, open the Heroku app you just created by selecting it. You should see a dashboard screen like this:

![The dashboard screen like this with instructions of how to deploy to Heroku](./initial_heroku_instructions.png)

The instructions that will show up While we'll be following these instructions shortly, we'll first want to setup our environment variables, just as we did with our `.env` file locally. You should see a "Settings" tab at the top of your dashboard.

![The settings page with a button labeled "Reveal Config Vars"](./heroku_hidden_config_vars.png)

Upon opening the tab, you should see a button labeled "Reveal Config Vars". Press the button and copy your environment variables from your `.env` file into the fields available.

![All of the .env file variables with the same name saved into Heroku](./heroku_config_vars.png)

Now that we have that, we can go back to our instructions that were on the main dashboard. Let's open up the same folder we have our `package.json` and `index.js` in, and install the Heroku CLI:

```
npm i -g heroku
```

> It's worth noting that Heroku officially suggests using [an alternative installation method for the CLI](https://devcenter.heroku.com/articles/heroku-cli) due to Node.JS incompatibilities, but I've faced no such issues with my (admittedly limited) usage.

Once this is done, we can:

- Sign into our account using `heroku login`

- Initialize a git repo into this folder `git init`

- Add Heroku as a remote place to deploy to. We should be able to see our Git URL from the settings page, so for example I would run:

  ```
  git remote add heroku https://git.heroku.com/points-r-us.git
  ```

Now that we have Heroku set up, we're able to `git push heroku master` to have Heroku deploy our `npm start` script. This means that anything we put in our `package.json`'s `start` `script` property, then commit and push, will then be run on our server. As such, the first thing we need to do is verify that we own that subdomain for Slack to send events to.

While our `package.json` might have looked like this before:

```json
"scripts": {
  "start:dev": "env-cmd node ./index.js",
  "start": "node ./index.js",
},
```

We'll want to update it so that the `start` command uses the signing secret from our server environment variables to verify:

```json
"verify": "slack-verify --secret $SLACK_SIGNING_SECRET --port=$PORT",
"start": "npm run verify",
```

We need to allow Heroku to dictate the port to host our verification command as well, to get past their firewall they automatically route to the app's subdomain; hence the `--port` attribute.

After making this change, we'll run:

- `git commit -m "Enforced verification"`
- `git push heroku master`

And watch as our app gets deployed:

![The app being deployed during the git push](./heroku_initial_deploy.png)

After this, we can go back to the Slack app dashboard and change the Event Subscription URL.

![The event subscription being updated to "points-r-us.herokuapp.com"](./slack_verify_heroku.png)

> Don't forget to hit "Save" once you change the URL 😉

Finally after this change is made, you can modify your `package.json` to run the server with `node` once again:

```json
"scripts": {
  "start": "node ./index.js",
},
```

> Be sure to use `node` and not `env-cmd`, as we want to actually use the values from the environment variable, not from a `.env` file.

Run that last `git commit` and `git push heroku master` and congrats! You should have everything deployed and ready to use!

![A demo of the app by adding a point to "botsRCool" and removing one from "failedDemos"](./showcase.png)

# Conclusion {#conclusion}

Slack provides a feature-rich, very useful chat application. Being able to add in your own functionality to said application only makes things more powerful for either your group or your end users. I know many businesses will use Slack bots as another experience for their business users. Now you've been able to see the power of their Node SDK and how easy it is to setup and deploy your very own Slack app using MongoDB and Heroku!

Any questions or comments we didn't touch on here? Let us know down below or [in our Discord](https://discord.gg/FMcvc6T) where you can ask questions in real time with folks from our community!
