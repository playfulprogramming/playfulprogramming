---
{
	title: "Making a Slack Bot using NodeJS and MongoDB",
	description: 'Have you ever wanted to run native Java and Kotlin code from your mobile game written in Unity? Well you can! This article outlines how to set that up!',
	published: '2020-02-04T05:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['mongodb', 'node', 'slack'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

We'll need to signup for a developer account and create an app to host our applicaiton logic:

https://api.slack.com/apps

![The create app dialog once pressed "create app"](./create-app-dialog.png)

![The initial screen that'll be shown when a new app is created](./initial-screen.png)

We're even able to customize the look of our application in our Slack settings:

![Towards the bottom of the intial page will show how to customize the description and such](./display-info.png)

Luckily for us, Slack provides a SDK to provide functionality to a Slack app:
 
https://github.com/slackapi/node-slack-sdk

In order to quickly set it up, we'll run the following command:

```
npm install @slack/web-api @slack/events-api
```

We'll then be able to use their example API:

```javascript
// Initialize using signing secret from environment variables
const { createEventAdapter } = require('@slack/events-api');
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

This will `console.log` every time a user sends a message. 
Save this to `index.js`. 

In order to have these events called, we'll need to get a public URL to route to. In order to do this, we can use `ngrok` to host a public URL in our local environment:

```
npm i -D ngrok
npx ngrok http 3000
```

> Keep in mind that this should NOT be used to host your Slack application when you're ready to publish.
> This should only be used during development process. In order to see how to deploy, you'll want to checkout [the section on doing so using Heroku](#heroku)

After doing so, you should be given an `ngrok.io` subdomain to map to your local IP address with a message like the following:

```
Forwarding https://9fca9f3e.ngrok.io -> http://localhost:3000
```

![Showing ngrok running in the terminal](./ngrok-running.png)

We're now able to use this URL as a map to the external world to the local environment we're in. So, for example, in order to add in the events subscription to our current code, we'll run the following commmand:

```
./node_modules/.bin/slack-verify --secret <signing_secret>
```

Where the `<signing_secret>` is the same signing secret from the homepage you landed on upon creating a new Slack app

![Showing the command running](./slack-verify.png)

With this command still running, you can press on the "Add features and functionality" tab in the homescreen, then press "Event Subscriptions".

This will bring you to a page with an "On/Off" toggle. Toggle it to "On" and add the `ngrok` domain in the request URL

![Adding the ngrok domain into the "event subscription" area ](./event-subscription-enable.png)


## Deployment {#deployment}

We'll then want to deploy


https://blog.heroku.com/how-to-deploy-your-slack-bots-to-heroku
