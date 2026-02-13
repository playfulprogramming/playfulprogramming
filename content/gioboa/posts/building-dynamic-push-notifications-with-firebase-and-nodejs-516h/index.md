---
{
title: "Building Dynamic Push Notifications with Firebase and Node.js",
published: "2025-03-07T16:09:08Z",
edited: "2025-03-07T16:17:29Z",
tags: ["node", "firebase", "javascript", "angular"],
description: "In the previous article we saw how Firebase Cloud Messaging (FCM) is a versatile solution for...",
originalLink: "https://https://dev.to/playfulprogramming/building-dynamic-push-notifications-with-firebase-and-nodejs-516h",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

In the [previous article](https://https://dev.to/playfulprogramming/push-notifications-in-angular-19-with-firebase-cloud-messaging-3o3a) we saw how Firebase Cloud Messaging (FCM) is a versatile solution for delivering push notifications to various platforms.

While basic notifications are useful, custom notifications allow you to tailor the user experience with specific data and actions.

Let's see how sending custom notifications using Node.js and integrating them with your [Angular](https://angular.dev/) application.

## Prerequisites

Completed the basic FCM setup as described in the [previous article](https://https://dev.to/playfulprogramming/push-notifications-in-angular-19-with-firebase-cloud-messaging-3o3a).
You should have:

- A Firebase project.
- The `@angular/fire` package installed in your Angular project.
- Firebase initialized in your `app.config.ts`.
- A service worker (`firebase-messaging-sw.js`) configured.
- Node.js and npm installed.

## Setting up Firebase Admin SDK in Node.js

Set up the Firebase Admin SDK in your Node.js project.

Create a new Node.js project (or use an existing one) and install the `firebase-admin` package:

```bash
npm install firebase-admin
```

Download your service account key JSON file from the Firebase Console:

- Go to your Firebase project.
- Click on the "Settings" icon (gear icon) next to "Project Overview".
- Select "Service accounts".
- Click "Generate new private key".

## Node.js Code for Sending Custom Notifications

Here is a working JavaScript code that will help you to send custom notification.

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('your-generate-private-key-file');

admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
});

const message = {
 notification: {
  title: 'custom title',
  body: 'custom message',
 },
 webpush: {
  // Custom link for web push
  fcmOptions: { link: 'http://localhost:4200/' },
 },
 topic: 'default',
};

admin
 .messaging()
 .send(message)
 .then((response) => {
  // Response is a message ID string.
  console.log('Successfully sent message:', response);
 })
 .catch((error) => {
  console.log('Error sending message:', error);
 });

```

## Key points

- **notification**: The `notification` block is for *display* notifications that the browser or OS will present.
- **title**: The notification title.
- **body**: The notification body text.
- **webpush**: Customize web push behavior.
- **fcmOptions**:  This is where you specify custom options specific to web push.
- **link**: This is crucial for custom behavior. It specifies a URL to open when the user clicks on the notification. Here, it's set to `http://localhost:4200/`, but you can change it to any URL in your application, enabling deep linking.
- **topic**: The notification will send to all the users subscribed to the topic.

You can create your own logic to associate client token id with a specific topic. This will allow you to send notification to multiple devices at once. You could also split clients based on location and do many other things.

Here is an example of code:

```javascript
admin.messaging().subscribeToTopic(['client-id-token'],'default')
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
```

## Modifying the Angular Service Worker

The service worker code of the [previous article](https://https://dev.to/playfulprogramming/push-notifications-in-angular-19-with-firebase-cloud-messaging-3o3a) is almost correct, but here is a refined version that handles the custom data and notification clicks.

```javascript
importScripts(
 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js'
);
importScripts(
 'https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js'
);

const firebaseConfig = {
 apiKey: '----',
 authDomain: '----',
 projectId: '----',
 storageBucket: '----',
 messagingSenderId: '----',
 appId: '----',
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
 console.log(
  '[firebase-messaging-sw.js] Received background message ',
  payload
 );

 const link = payload.data?.fcmOptions?.link ?? payload.data?.link; // Prioritize fcmOptions link

 const notificationTitle = payload.notification.title;
 const notificationOptions = {
  body: payload.notification.body,
  data: { url: link },
 };
 self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
 console.log('On notification click: ', event.notification.tag);
 event.notification.close();

 // This checks if the client is already open and if it is, it focuses on the tab.
 // tab with the URL passed in the notification payload
 event.waitUntil(
  clients
   // https://developer.mozilla.org/en-US/docs/Web/API/Clients/matchAll
   .matchAll({ type: 'window', includeUncontrolled: true })
   .then(function (clientList) {
    const url = event.notification.data.url;

    if (!url) return;

    // will focus on the existing tab i.e. https://example.com/about
    for (const client of clientList) {
     console.log(client.url);
     if (client.url === url && 'focus' in client) {
      return client.focus();
     }
    }

    if (clients.openWindow) {
     console.log('OPENWINDOW ON CLIENT');
     return clients.openWindow(url);
    }
   })
 );
});
```

### messaging.onBackgroundMessage

Handles notifications received when the app is in the background.

- `const link = payload.fcmOptions.link ?? payload.data?.link;`: Extract link from `fcmOptions.link` if available, otheriwse fallback to `data.link`
- `notificationOptions.data`: The  `data`  property is used to pass custom data (in our case the URL) to the event listener.
- `notificationOptions.body: payload.notification.body`: The value on notificationOptions.body was wrong in the last iteration.

### self.addEventListener("notificationclick")

This event listener handles what happens when the user *clicks* on the notification.
`event.notification.data.url`: Retrieves the URL we embedded in the notification's `data` property.
The rest of the code ensures that if a tab with the specified URL is already open, it's brought to the front; otherwise, a new tab is opened.  This is a key element of providing a seamless user experience.

### includeUncontrolled: true

This makes sure that even if the user has navigated directly to your page (without the service worker controlling it), the click event will still be handled.

## Testing Custom Notifications

- Run your Angular application
- Run your Node.js script
- Send a test notification
- Click the notification and verify that it opens the correct URL in your browser

## Conclusion

Custom notifications empower you to create more engaging and relevant experiences for your users.
By leveraging the flexibility of FCM and the power of Node.js, you can tailor your push notifications to meet the specific needs of your application and users.

---

Happy coding! 🎉
Need help? Ask away in the comments!
