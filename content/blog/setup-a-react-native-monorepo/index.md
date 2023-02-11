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

[React Native](https://reactnative.dev/) allows you to write React code that outputs to native applications for various platforms, including:

- Android
- iOS
- Windows
- macOS

It's an undeniably powerful way to share code between web applications and your mobile apps; particularly within small teams that either don't have the knowledge or the capacity to go fully native.

Similarly, [monorepos](https://monorepo.tools/) can be a fantastic way to share code between multiple projects with a similar tech stack.

Combined together and even a small team can maintain multiple React Native applications seamlessly.

<!-- Show a TLDR chart of an example monorepo usage in RN -->

Unfortunately, it can be rather challenging to build out a monorepo that properly supports React Native. While [Expo supports monorepo usage](https://docs.expo.dev/guides/monorepos/), one common complaint when using Expo is that [Expo does not support many popular React Native libraries that require native code](https://docs.expo.dev/introduction/why-not-expo/?redirected#expo-go).

To further exacerbate the issue, React Native comes with many uncommon edgecases that makes monorepos particularly challenging to create. Many of the tutorials I've found outlining how to build a monorepo for this purpose use outdated tools to work around this.

Knowing just how potent the potential impact of a monorepo would be to my projects, I disregarded these headaches and spent a month or two building out a monorepo that solved my problems. I'd like to share how you can do the same in this article.

Let's walk through how to:

- [Set up a React Native app](#setup-app)

- [Have multiple `package.json` files for each app and package](#yarn-berry)
- [Run interdependent tasks in your monorepo easily](#turborepo)
- [Fix issues with React Native's bundler](#metro)
- [Build basic shared React Native components](#building-components)
- [Style shared components](#styled-components)
- [Test your shared application logic](#jest)
- [Enforce consistent project configuration across your monorepo](#config-package)
- [Prepare for further code sharing](#conclusion)

# Setup React Native Project {#setup-app}

> Even if you have an existing React Native project, 

Let's setup a basic React Native project to extend using a monorepo.

> Before you get started with this section, make sure you have [your environment set up](https://reactnative.dev/docs/environment-setup), including XCode/Android Studio.

To setup a basic React Native project from scratch, run the following:

```shell
npx react-native init ChatAppMobile
```

Once this command finishes, you should have a functioning React Native project scaffolded in `ChatAppMobile` folder.

While there's a bunch of files that we could look at, there's a few I want to highlight that we'll be looking at throughout this article:

- `package.json` - Metadata about the project that your package manager controls. This includes dependencies, [dev dependencies](https://unicorn-utterances.com/posts/how-to-use-npm#dev-deps), and scripts that you might want to run on the project.
- `tsconfig.json` - The configuration file for any [TypeScript](typescriptlang.org/) usage in the project.
- `.eslintrc.js` - The linting rules applied by [ESLint](https://eslint.org/) to standardize the code throughout your app.
- `metro.config.js` - The configuration for React Native's default bundler: Metro. We'll touch on what Metro a bit more does later.

We now have a basic demo application that we can extend by adding it to our monorepo.

# Maintain Multiple Package Roots with Yarn Berry {#yarn-berry}

https://twitter.com/larixer/status/1570459837498290178





# Run Distributed Tasks with Turborepo {#turborepo}



# Fixing issues with the Metro Bundler {#metro}

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











## Better Method {#metro-improved} 

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



# Building Basic React Native Components {#building-components}



# Styling Components using Styled Components {#styled-components}









# Add Testing to our Monorepo with Jest {#jest}



## Make Tests More Representative with Testing Library {#testing-library}





# Sharing Configuration Files between Apps {#config-package}



## Enforce Consistent TypeScript Usage with `tsconfig` {#tsconfig}



## Lint Your Apps with ESLint {#eslint}





# Next Stop: The Web {#conclusion}

<!-- Conclusion section, talk about React Native for Web, Storybooks, Vite -->

