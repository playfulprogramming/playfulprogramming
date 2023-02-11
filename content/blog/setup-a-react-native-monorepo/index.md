---
{
	title: "How to Setup a React Native Monorepo",
	description: "",
	published: '2023-05-05T13:45:00.284Z',
	authors: ['crutchcorn'],
	tags: ['react', 'react native'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---



While [Expo supports monorepo usage](https://docs.expo.dev/guides/monorepos/), one common complaint when using Expo is that [Expo does not support many popular React Native libraries that require native code](https://docs.expo.dev/introduction/why-not-expo/?redirected#expo-go).





# Setup React Native Project

> If you have an existing React Native project, you can safely skip this step.



- Make sure you have [your environment set up](https://reactnative.dev/docs/environment-setup), including XCode/Android Studio

  

```shell
npx react-native init ChatAppMobile
```



Here's the files that are worth looking at:

- `package.json`
- `tsconfig.json`
- `metro.config.js`





# Initial Scaffolding with Yarn Berry and Turborepo

- Turborepo
- Yarn Berry



# Fixing issues with Metro

```
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/**
 * @param {string} __dirname 
 */
module.exports = (__dirname) => {
const packagesWorkspace = path.resolve(path.join(__dirname, "../../packages"));

const watchFolders = [packagesWorkspace];

const nodeModulesPaths = [path.resolve(path.join(__dirname, "./node_modules"))];

return {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: true,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'react') {
        return {
          filePath: path.resolve(path.join(__dirname, "./node_modules/react/index.js")),
          type: 'sourceFile',
        };
      }
      if (moduleName === 'react-native') {
        return {
          filePath: path.resolve(path.join(__dirname, "./node_modules/react-native/index.js")),
          type: 'sourceFile',
        };
      }
      // Optionally, chain to the standard Metro resolver.
      return context.resolveRequest(context, moduleName, platform);
    },
    nodeModulesPaths,
  },
  watchFolders,
};
}
```











## Better Method

```
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/**
 * @param {string} __dirname
 */
module.exports = (__dirname) => {
  const packagesWorkspace = path.resolve(
    path.join(__dirname, "../../packages")
  );

  const watchFolders = [packagesWorkspace];

  const nodeModulesPaths = [
    path.resolve(path.join(__dirname, "./node_modules")),
  ];

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: true,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      resolveRequest: (context, moduleName, platform) => {
        if (
          moduleName.startsWith("react") ||
          moduleName.startsWith("@react-navigation") ||
          moduleName.startsWith("@react-native") ||
          moduleName.startsWith("@react-native-community") ||
          moduleName.startsWith("@tanstack") ||
          moduleName.startsWith("styled-components") ||
          moduleName.startsWith("@redux") ||
          moduleName.startsWith("redux")
        ) {
          const pathToResolve = path.resolve(
            __dirname,
            "node_modules",
            moduleName
          );
          return context.resolveRequest(context, pathToResolve, platform);
        }
        // Optionally, chain to the standard Metro resolver.
        return context.resolveRequest(context, moduleName, platform);
      },
      nodeModulesPaths,
    },
    watchFolders,
  };
};
```









# Add Testing to our Monorepo

- Jest
- Testing Library
