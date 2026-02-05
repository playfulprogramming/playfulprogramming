---
{
title: "Live Reloading in Golang using Air",
published: "2022-04-07T07:45:18Z",
edited: "2022-07-09T09:57:35Z",
tags: ["go", "tutorial", "beginners", "tooling"],
description: "Live reloading changes to our codebase is one of the core tenants of a great developer experience....",
originalLink: "https://mainawycliffe.dev/blog/live-reloading-golang-using-air/",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

Live reloading changes to our codebase is one of the core tenants of a great developer experience. When we make changes to our codebase, we want to be able to get feedback on the results as soon as possible. Live reloading is the process of watching codebase changes and automatically rebuilding the application with the changes integrated. It can be very frustrating if you have to do this manually: save changes, stop the server, rebuild and then start the server on every change you make.

Having worked with NodeJS based frameworks and frontend frameworks such as Angular and React, most (if not all) come with live reloading built-in. Some frameworks such as Flutter take this a little further with stateful [hot reloading](https://www.youtube.com/watch?v=sgPQklGe2K8\&vl=en), which I won't go into details about.

Having switched to using Golang recently, I realized I needed to solve this problem. Lucky for me, there are a few great options out there to enable this behavior. One of them is the [Air (github.com/cosmtrek/air)](https://github.com/cosmtrek/air) - a live reloading tool for Golang apps.

<iframe src="https://x.com/mwycliffe_dev/status/1510881501344419840"></iframe>

## Installing Air

First, we are going to install `air`. There are a number of ways to install `air`, but the way I did it was using `go install` as I had Golang already installed:

```sh
go install github.com/cosmtrek/air@latest
```

There are a number of other installation options that you can find [here](https://github.com/cosmtrek/air#installation).

## Configuring Air

Next, we need to configure Air for our Golang project. You can do that by running the following command:

```sh
air init
```

This will create a `air.toml` file that will contain the default configurations for Air. Here is an example of what that looks like:

```toml
root = "."
testdata_dir = "testdata"
tmp_dir = "tmp"

[build]
  bin = "./tmp/main"
  cmd = "go build -o ./tmp/main ."
  delay = 1000
  exclude_dir = ["assets", "tmp", "vendor", "testdata"]
  exclude_file = []
  exclude_regex = ["_test.go"]
  exclude_unchanged = false
  follow_symlink = false
  full_bin = ""
  include_dir = []
  include_ext = ["go", "tpl", "tmpl", "html"]
  kill_delay = "0s"
  log = "build-errors.log"
  send_interrupt = false
  stop_on_error = true

[color]
  app = ""
  build = "yellow"
  main = "magenta"
  runner = "green"
  watcher = "cyan"

[log]
  time = false

[misc]
  clean_on_exit = false

[screen]
  clear_on_rebuild = false
```

Next, let me highlight a few notable configurations you might care about and might want to update for your project.

Under `build` in the `air.toml`; you might want to change the `cmd` property. If the entry of your golang application is in a different directory, say `server`, you can change the property to something like this:

```toml
cmd = "go build -o ./tmp/main ./server/main.go"
```

Another set of config properties that you might want to pay attention to are the `include_dir`, `include_ext`, `exclude_dir` and `exclude_file` entries. The `include_dir` and `include_ext` tell Air which dir and extensions to watch for changes when live reloading, while the `exclude_dir` and `exclude_file` tell air which directories, extensions, and files not to listen to changes from.

There is also the `exclude_regex` property that allows you to ignore files matching a certain pattern, i.e. test files as it does by default. These configs allow you to configure Air based on your app structure.

For more information about Air configurations, please refer to the example file [here](https://github.com/cosmtrek/air/blob/master/air_example.toml).

## Running your App

Finally, the only part that is remaining is running our Golang application using Air. You can do this by running the `air` command:

```sh
air
```

After that, make changes to your project and watch air live-reload your Go application.

## Conclusion

In this article, we learned how we can use Air to live-reload our go applications as we make changes to our codebase. We learned how we can initialize, the configuration we might want to change, and how to start our application afterward.

To continue learning more about Air, visit the Github repository [here](https://github.com/cosmtrek/air).
