---
{
    title: "Continuous Integration with Travis CI for Android",
    description: 'An in-depth tutorial explaining how to set up Travis CI to deploy signed builds to Google Play. Among other things',
    published: '2019-08-22T05:12:03.284Z',
    authors: ['fennifith'],
    tags: ['android', 'ci'],
    attached: [],
    license: 'publicdomain-zero-1'
}
---

Last week, I started setting up continuous integrations for some of my projects. The basic idea of a continuous integration is that you have a server to build your project on a regular basis, verify that it works correctly, and deploy it to wherever your project is published. In this case, my project will be deployed to the releases of its GitHub repository and an alpha channel on the Google Play Store. In order to do this, I decided to use [Travis CI](https://travis-ci.com/), as it seems to be the most used and documented solution (though there are others as well). Throughout this blog, I will add small snippets of the files I am editing, but (save for the initial `.travis.yml`) never an entire file. If you get lost or would like to see a working example of this, you can find a sample project [here](/redirects/?t=github&d=TravisAndroidExample).

A small preface, make sure that you create your account on [travis-ci.com](https://travis-ci.com/), not [travis-ci.org](https://travis-ci.org/). Travis previously had their free plans on their .org site and only took paying customers on .com, but they have since begun [migrating all of their users](https://docs.travis-ci.com/user/open-source-on-travis-ci-com/) to travis-ci.com. However, for some reason they have decided _not to say anything about it_ when you create a new account, so it would be very easy to set up all of your projects on their .org site, then (X months later) realize that you have to move to .com. This isn't a huge issue, but it could be a little annoying if you have _almost 100 repositories_ like I do which you would have to change (though I have only just started using Travis, so it doesn't actually affect me). Just something to note.

## Step 1: Start your first build

There are a few basic things to do in order to build your project. Assuming that you have already [set up your account](https://docs.travis-ci.com/user/tutorial/) and authenticated it with your GitHub, you will next want to create a file named `.travis.yml` in your project's root directory. One thing to keep in mind here is that the YAML format in this file is heavily dependent on whitespace; tab characters are invalid, indents must be made only in spaces, and a sub-section or parameter **must** be indented or it will not be treated as such. To start, let's write a basic file that should properly build most up-to-date Android projects.

```yml
language: android
android:
  components:
    - tools
    - platform-tools
    - build-tools-28.0.3
    - android-28
    - extra-google-google_play_services
    - extra-google-m2repository
    - extra-android-m2repository
jdk:
  - oraclejdk8
before_install:
  - chmod +x gradlew
```

You will want to update the `android` and `build-tools` versions to match the respective values in your project's `build.gradle` file, and `extra-google-google_play_services` can be omitted (it will speed up build times) if you are not using it. The same goes for the `jdk`. Note the `before_install` section; statements placed there are executed before your project is built or installed (side-note: you will want to make sure `gradlew` and `gradle/wrapper` are in your version control; Travis uses them to build your project).

Now, when you commit this file to your repository (the branch should not make a difference), Travis should build your project and notify you of the result.

## Step 2. Signing APKs

So Travis _can_ successfully build your APK, but that itself is not very useful. It can do something with debug APKs, sure, but deploying them won't be very useful as they won't be under the same signature, and users won't be able to update from the existing application. So... we need a way to sign the application using an existing keystore that Travis has access to.

> LET'S UPLOAD OUR KEYSTORE TO GIT!

Not a bad idea. This will easily give Travis the ability to sign our APK. Isn't there some reason that you shouldn't share your keystore online, though, maybe something about "malicious developers and companies can use it to update your application without your knowledge"? Weeeelll why don't we use Travis's built-in encryption service? This will give you an encrypted file (like `key.jks.enc`) that you can safely add to git, and add a command to the `before_install` section in your `.travis.yml` to decrypt it.

> But... can't someone just look in your `.travis.yml`, get the command, and use it to decrypt your file?

No, they can't. This is because the values passed to the command are two [environment variables](https://docs.travis-ci.com/user/environment-variables/#defining-variables-in-repository-settings) which are stored only on Travis. As long as you _don't_ check the "show value in log" box when you create an environment variable, they will never be output anywhere in your build logs, and nobody will be able to see them or know what they are.

If you are worried about security (or if you aren't worried enough), I highly recommend that you read [Travis's documentation](https://docs.travis-ci.com/user/best-practices-security/#Steps-Travis-CI-takes-to-secure-your-data) on best practices regarding secure data. 

### Part A. Encrypting files

You can go about this two ways: a difficult way, or a difficult way. You can either install [Travis's CLI tool](https://docs.travis-ci.com/user/encrypting-files/) for the sole purpose of logging in, encrypting your file, and setting its environment variables, or you can just do it yourself. I will provide instructions for both. Do what you like.

Note that if you want to automatically deploy your builds to Google Play, you may want to come back here and go through the exact same process later on, so you might want to skip this for now. If you don't, or want to do it twice anyway... carry on...

#### Using Travis's CLI

First, install it. Assuming you have Ruby set up, you'll want to run `gem install travis`. Since not everyone has Ruby set up, [here are their installation instructions](https://www.ruby-lang.org/en/documentation/installation/). A bit of a pain for something that you can just write yourself in my opinion, but hey, anything to avoid writing more code.

After that, you'll want to log in. Run `travis login` and it will walk you through it. Note: (related to the preface at the start) no matter what site you are using when you use the Travis CLI, you should append either `--org` or `--com` to **every command** to specify which site it should use.

Now, find your keystore. Place it in your root directory. The CLI detects git repos to determine what project you want to modify, so this is necessary. Do not add it to git. That is bad and not good. Don't do that.

Assuming you have named your keystore `key.jks`, you will want to run `travis encrypt-file key.jks --add`. This will encrypt the file, add the command to your `.travis.yml`, and upload the environment variables all at once. You can then add `key.jks.enc` to git, commit and push, and it will be available to your next build.

Side-note: if your keystore is a `.keystore` file, it shouldn't make a difference - just replace `key.jks` with `key.keystore` (or whatever it is named) whenever it appears.

#### Doing It Yourself

Pick a key and a password. They shouldn't be excessively long, but not tiny either. Do not use special characters. In this example, I will use "php" as the key and "aaaaa" as the password.

Add them to Travis CI as environment variables. You can do this by going to your project page in Travis, clicking on "More Options > Settings", then scrolling down to "Environment Variables". I will name mine "enc_keystore_key" and "enc_keystore_pass", respectively.

Now, time to encrypt the file. Run this command in the terminal:

```bash
openssl aes-256-cbc -K "php" -iv "aaaaa" -in key.jks -out key.jks.enc
```

Now, you will want to add a line to decrypt the file in `before_install` of your `.travis.yml`. You should not pass your key/password here, as this file will be pushed to git, and that would be bad. Instead, we will reference the environment variables.

```yml
before_install:
  - ...
  - openssl aes-256-cbc -K $enc_keystore_key -iv $enc_keystore_pass -in key.jks.enc -out key.jks -d
```

That's it! Push your changes to `.travis.yml` as well as `key.jks.enc`, and Jekyll should build your project.

### Part B. Dummy files

This isn't entirely necessary, but you can use some fake "dummy" files to add to version control alongside the "real" encrypted ones. When Travis decrypts your encrypted files, they will be overwritten, but otherwise they serve as quite a nice substitute to prevent anyone from getting their hands on the real files (and to prevent you from uploading the real ones by accident). You can find a few (`key.jks`, `service.json`, and `secrets.tar`) in the sample project [here](/redirects/?t=github&d=TravisAndroidExample).

### Part C. Signing the APK

Now we want to actually use the key to sign our APKs. This requires a few changes to our app's build.gradle. Specifically, we need to specify a `signingConfig` that ONLY exists on Travis - we don't want our local builds (or the builds of other contributors) to be affected by this. Luckily, not only can we read environment variables from our `build.gradle` file using `System.getenv`, Travis automatically creates a nice "CI" variable to tell us that the build is happening in a Continuous Integration, so why don't we use that.

Full credit, this solution was taken from [this wonderful article](https://android.jlelse.eu/using-travisci-to-securely-build-and-deploy-a-signed-version-of-your-android-app-94afdf5cf5b4) that describes almost the same thing that I have been explaining since the start of this article.

I'll create three environment variables that will be used here: the keystore password as "keystore_password", the keystore alias as "keystore_alias", and the alias's password as "keystore_alias_password". Note that special characters cannot be used in these either.

```gradle
android {
    ...
    signingConfigs {
        release
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }

    def isRunningOnTravis = System.getenv("CI") == "true"
    if (isRunningOnTravis) {
        signingConfigs.release.storeFile = file("../key.jks")
        signingConfigs.release.storePassword = System.getenv("keystore_password")
        signingConfigs.release.keyAlias = System.getenv("keystore_alias")
        signingConfigs.release.keyPassword = System.getenv("keystore_alias_password")
    }
}
```

Of course, Travis isn't currently building a release variant (I think it defaults to `./gradlew build`), so this `signingConfig` won't be applied. We need to change that. Add the following to your `.travis.yml`...

```yml
script:
  - ./gradlew assembleRelease
```

Now it will create a proper release using these signing configs. Push everything to git and it should build a properly signed APK. Yay.

## Step 3. Deploying to github releases

This part is fairly simple, as Travis provides its own deployment functionality for this purpose. According to [their documentation](https://docs.travis-ci.com/user/deployment/releases/), for the bare minimum functionality all that you will need is to add the following to your `.travis.yml`...

```yml
deploy:
  - provider: releases
    api_key: "GITHUB OAUTH TOKEN"
    file: app/build/outputs/apk/release/*
    file_glob: true
    skip_cleanup: true
    on:
        tags: true
```

Now, you _could_ follow this exactly and place your GitHub token directly in your `.travis.yml`, but that's just asking for trouble. Luckily, you can use MORE ENVIRONMENT VARIABLES! Enter your API key with the name ex. "GITHUB_TOKEN", and write `api_key: "$GITHUB_TOKEN"` instead.

This should now create a release with a built (and signed) APK each time there is a new tag. Fair enough; all you have to do for it to deploy is create a new tag.

### Part A. Creating tags

What if you're lazy like me, though? What if you want to create a new release on each push to the master branch? (I have two branches in most of my projects, `develop` and `master`, for this purpose - only the commits currently in production are in the `master` branch)

A simple modification to the `on` section of the previous snippet does the trick.

```yml
deploy:
    ...
    on:
        branch: master
```

Well, it almost does the trick. The thing is, since we haven't created a tag, Travis doesn't know what version number we want to use. It just creates a new release using the commit hash as a title. That isn't very good. I wonder if we could somehow get the version number from our build.gradle file and use that instead...

### Part B. Version numbers

Let's write a gradle task to print our version number! Place the following in your app's `build.gradle`.

```gradle
task printVersionName {
    doLast {
        println android.defaultConfig.versionName
    }
}
```

Now when you run `./gradlew :app:printVersionName`, your version name should be printed in the console. Now all we have to do is use this in our deployment.

Just as there is a `before_install` section of our `.travis.yml`, there is also a `before_deploy`. As such, we can add the following:

```yml
before_deploy:
  - export APP_VERSION=$(./gradlew :app:printVersionName)
```

This creates an environment variable ("APP_VERSION") containing our app's version name, which we can then reference from the actual deployment as follows...

```yml
deploy:
  - provider: releases
    api_key: "$GITHUB_TOKEN"
    file: app/build/outputs/apk/release/*
    file_glob: true
    skip_cleanup: true
    overwrite: true
    name: "$APP_VERSION"
    tag_name: "$APP_VERSION"
    on:
        branch: master
```

Yay! Now we have fully automated releases on each push to master. Because of the `overwrite` parameter, it will overwrite existing releases if the version number has not been changed (a new release will be created if it has), so they will always be up to date.

## Step 4. Deploying to the Play Store

Travis doesn't have a deployment for the Play Store, so we will have to use a third party tool. I found [Triple-T/gradle-play-publisher](https://github.com/Triple-T/gradle-play-publisher/), which should work, except there isn't an option to deploy an existing APK without building the project. Not only would a deployment that requires building a project _twice_ be super wasteful and take... well, twice as long, [I ran into problems signing the APK](https://jfenn.me/redirects/?t=twitter&d=status/1061620100409761792) when I tried it, so... let's not. Instead, we'll modify the `script` to run the `./gradlew publish` command when a build is triggered from the master branch.

### Part A. Setup

Setup is fairly simple; just follow the directions in the plugin's readme. However, what should we do with the JSON file? PLEASE DO NOT ADD IT TO GIT. ANYONE WITH THIS FILE HAS ACCESS TO YOUR PLAY CONSOLE. WE'RE ENCRYPTING IT.

You can either encrypt it as a separate file, or you can put them both in a tar (`tar -cvf secrets.tar key.jks service.json`), encrypt that, and run `tar -xvf secrets.tar` once it has been decrypted. I am not sure if either will affect how secure they are. I have opted for the tar method as it gives me less things to keep track of.

### Part B. Publishing

Now we can modify the `script` section of our `.travis.yml` to run the `./gradlew publish` command when a build is triggered from the master branch. This can be done using the "TRAVIS_BRANCH" environment variable which Travis handily creates for us. In other words...

```yml
script:
  - if [ "$TRAVIS_BRANCH" = "master" ]; then ./gradlew publish; else ./gradlew build; fi
```

This should build a signed APK and upload it to the Play Store whenever a push is made to the `master` branch, then deploy the same APK to GitHub if it was built successfully. Important to note that using this method, the build will also fail if it has failed to upload the APK to the Play Store - so it _might_ not be an issue with your project if it results in a failure unexpectedly.

### Part C. Changelogs

Now, gradle-play-publisher requires you to specify a changelog at `app/src/main/play/release-notes/en-US/default.txt` for it to publish an APK. What if we want to use the same changelog for GitHub releases? We'll add another line to the `before_deploy` section and GitHub deployment to do so.

```yml
before_deploy:
    ...
  - export APP_CHANGELOG=$(cat app/src/main/play/release-notes/en-US/default.txt)
deploy:
  - provider: releases
    ...
    body: "$APP_CHANGELOG"
```

## Finish

Hopefully this blog has gone over the basics of using Travis to deploy to GitHub and the Play Store. In later blogs, I hope to also cover how to implement UI and Unit tests, though I have yet to actually use them myself so I cannot yet write an article about them.

If you would like to see a working example of all of this, you can find it in a sample project [here](https://jfenn.me/redirects/?t=github&d=TravisAndroidExample).
