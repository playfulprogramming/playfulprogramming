---
{
    title: "Quick Guide to Building a PWA with Next.js",
    description: "Learn how to turn your Next.js app into a Progressive Web App (PWA).",
    published: '2023-11-13T10:00:00.000Z',
    tags: ['nextjs', 'react', 'webdev', 'pwa'],
    license: 'cc-by-nc-sa-4',
}
---

Progressive Web Apps (PWAs) provide a native-like experience on the web, including features like offline support, push notifications, and the ability to install the app on the home screen. In this comprehensive guide, we will walk through the process of converting a Next.js app into a PWA using the [`@ducanh2912/next-pwa`](https://ducanh-next-pwa.vercel.app/docs/next-pwa/getting-started) package.

By the end of this tutorial, you'll have a fully functioning PWA that you can deploy and install on any device.

## Setting Up the Next.js Project

First, create a new Next.js project using:

```bash
npx create-next-app@latest
```
Navigate into the project directory, and install needed packages to enable service worker support:

```bash
npm i @ducanh2912/next-pwa && npm i -D webpack
# or
yarn add @ducanh2912/next-pwa && yarn add -D webpack
# or
pnpm add @ducanh2912/next-pwa && pnpm add -D webpack
```
This installs `@ducanh2912/next-pwa`, a package that integrates service worker functionality, and webpack for building the app.

## Adding the PWA Configuration

To enable the PWA features, update or create the `next.config.js` file in the root of your project with the following configuration:

```js
const withPWA = require('@ducanh2912/next-pwa').default;

module.exports = withPWA({
  dest: 'public', // The folder where service worker and other static assets will be placed
  cacheOnFrontEndNav: true, // Enable caching for front-end navigation
  aggressiveFrontEndNavCaching: true, // Aggressive caching for smoother navigation
  reloadOnOnline: true, // Force reload when going back online
  swcMinify: true, // Enable SWC minification for better performance
  workboxOptions: {
    disableDevLogs: true, // Optional: Reduce Workbox logging for cleaner production builds
  },
});
```
This configuration integrates the PWA plugin into your Next.js app, places the service worker in the public folder, and customizes caching behavior.

## Creating a Web App Manifest

The Web App Manifest provides metadata for your PWA. Create a `manifest.json` file in the public folder with the following content:

```json
{
  "name": "My Awesome PWA App",
  "short_name": "PWA App",
  "icons": [
    {
      "src": "/icons/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/android-chrome-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#FFFFFF",
  "background_color": "#FFFFFF",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait"
}
```

### Key Fields Explained

- **name**: The full name of your app, displayed when the app is installed.
- **short_name**: A shorter version of the app name that is shown on the home screen.
- **icons**: An array of image objects for different device resolutions. Make sure to include multiple sizes (e.g., 192x192, 384x384, 512x512) for optimal display.
- **theme_color**: Sets the color of the address bar and UI elements on Android devices.
- **start_url**: The URL that the app opens when launched. Typically, this is set to the root (`/`).
- **display**: Defines how the app appears when launched. The `standalone` value removes the browser UI, providing a more native-like experience.
- **orientation**: Specifies the preferred screen orientation (e.g., `portrait` or `landscape`).

Ensure that the icons referenced in the manifest are available in the `public/icons/` directory.

## Adding Metadata to the `<head />`

In Next.js, you can manage metadata for the PWA. Add the following to your app/layout.tsx file to ensure that the app loads with the necessary metadata:

```tsx
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
   manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};
```
This ensures that the PWA has access to the necessary metadata when the app is loaded, and provides a consistent experience on different devices.

## Update the .gitignore file

To avoid tracking unnecessary files, update your .gitignore file to exclude service worker and Workbox-related files:

```bash
# all other ignore list
sw.*
workbox-*
swe-worker-*
```
This keeps your repository clean by excluding generated files and assets that are not necessary for version control.

## Testing Your PWA

Try installing your app on a device by clicking the “Add to Home Screen” option in mobile browsers like Chrome or Safari.

## Conclusion

With these steps, you've successfully transformed your Next.js app into a Progressive Web App. You can now take full advantage of the capabilities of PWAs, including offline support, push notifications, and the ability to install the app on your device's home screen.