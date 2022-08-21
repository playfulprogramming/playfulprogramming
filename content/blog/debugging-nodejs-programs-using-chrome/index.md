---
{
	title: "Debugging NodeJS Applications Using Chrome",
	description: 'Learn how to interactively debug your NodeJS applications using a GUI-based debugger built into Chrome.',
	published: '2020-01-21T05:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['node', 'chrome'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

Debugging is one of the most difficult aspects of development. Regardless of skill level, experience, or general knowledge, every developer finds themselves in an instance where they need to drop down and start walking through the process. Many, especially those who are in complex environments or just starting on their developmental path, may utilize `console.log`s to help debug JavaScript applications. However, there is a tool for developers using Node.JS that makes debugging significantly easier in many instances.

The tool I'm referring to is [the Node Debugger utility](https://nodejs.org/api/debugger.html). While this utility is powerful and helpful all on its own, _it can be made even more powerful by utilizing the power of the Chrome debugger_ to attach to a Node debuggable process in order to _provide you a GUI for a debugging mode_ in your Node.JS applications.

Let's look at how we can do so and how to use the Chrome debugger for such purposes.

# Example Application {#example-code}

Let's assume we're building an [Express server](https://expressjs.com/) in NodeJS. We want to `GET` an external endpoint and process that data, but we're having issues with the output data. Since it's not clear where the issue resides, we decide to turn to the debugger.

Let's use the following code as our example Express app:

```javascript
// app.js
const express = require("express");
const app = express();
const request = require("request");

app.get('/', (req, res) => {
  request("http://www.mocky.io/v2/5e1a9abe3100004e004f316b", (error, response, body) => {
    const responseList = JSON.parse(body); 
    const partialList = responseList.slice(0, 20);
    const employeeAges = partialList.map(employee => {
      return employee.employeeAge;
    });
    console.log(employeeAges);
  });
});

app.listen(3000);
```

You'll notice that we're using the dummy endpoint <http://www.mocky.io/v2/5e1a9abe3100004e004f316b>. This endpoint returns an array of values with a shape much like this:

```json
[
    {
        "id": "1",
        "employee_name": "Adam",
        "employee_salary": "12322",
        "employee_age": "23",
        "profile_image": ""
    }
]
```

Once you run the `app.js` file in Node, however, you'll see the `console.log`s of:

```javascript
[ undefined ]
```

Instead of the ages of the employees as we might expect. We'll need to dive deeper to figure out what's going on, let's move forward with setting up and using the debugger.

> You may have already spotted the error in this small code sample, but I'd still suggest you read on. Having the skillsets to run a debugger can help immeasurably when dealing with large-scale codebases with many moving parts or even when dealing with an unfamiliar or poorly documented API.

# Starting the Debugger {#starting-the-debugger}

Whereas a typical Express application might have `package.json` file that looks something like this:

```json
{
  "name": "example-express-debug-code",
  "version": "1.0.0",
  "main": "app.js",
  "dependencies": {
    "express": "^4.17.1",
    "request": "^2.88.0"
  },
  "scripts": {
    "start": "node ./app.js"
  }
}
```

We'll be adding one more `scripts` item for debug mode:

```json
{
  "name": "example-express-debug-code",
  "version": "1.0.0",
  "main": "app.js",
  "dependencies": {
    "express": "^4.17.1",
    "request": "^2.88.0"
  },
  "scripts": {
    "start": "node ./app.js",
    "debug": "node --inspect ./app.js"
  }
}
```

Once you add in this flag, you can simply run `npm run debug` to start the debuggable session.

> A quick sidenote:
> Some folks like to use [the `nodemon` tool](https://nodemon.io/) in order to get their application to reload upon making changes to their source file.
> That doesn't mean you can't join in the debugger fun! Just replace `node` with `nodemon` for the following `package.json`:
>
> ```json
> {
>   "name": "example-express-debug-code",
>   "version": "1.0.0",
>   "main": "app.js",
>   "dependencies": {
>     "express": "^4.17.1",
>     "request": "^2.88.0"
>   },
>   "devDependencies": {
>     "nodemon": "^2.0.2"
>   },
>   "scripts": {
>     "start": "nodemon ./app.js",
>     "debug": "nodemon --inspect ./app.js"
>   }
> }
> ```

Once you start your debuggable session, you should be left with a message similar to the following:

```
Debugger listening on ws://127.0.0.1:9229/ffffffff-ffff-ffff-ffff-ffffffffffff
For help, see: https://nodejs.org/en/docs/inspector
```

At this point, _it will hang and not process the code or run it_. That's okay though, as we'll be running the inspector to get the code to run again in the next step.

# The Debugger {#the-debugger}

In order to access the debugger, you'll need to open up Chrome and go to the URL `chrome://inspect`. You should see a list of selectable debug devices, including the node instance you just started.

![A list of inspectable devices from Chrome](./chrome_inspect.png)

Then you'll want to select `inspect` on the node instance.

Doing so will bring up a screen of your entrypoint file with the source code in a window with line numbers.

![The aforementioned code screen](./initial_debugger.png)

These line numbers are important for a simple reason: They allow you to add breakpoints. In order to explain breakpoints, allow me to make an analogy about debug mode to race-car driving.

Think about running your code like driving an experimental race-car. This car has the ability to drive around the track, you can watch it run using binoculars, but that doesn't give you great insight as to whether there's anything wrong with the car. If you want to take a closer inspection of a race-car, you need to have it pull out to the pit-stop in order to examine the technical aspects of the car before sending it off to drive again.

It's similar to a debug mode of your program. You can evaluate data using `console.log`, but _to gain greater insight, you may want to pause your application_, inspect the small details in the code during a specific state,  and to do so you must pause your code. This is where breakpoints come into play: they allow you to place "pause" points into your code so that when you reach the part of code that a breakpoint is present on, your code will pause and you'll be given much better insight to what your code is doing.

To set a breakpoint from within the debugging screen, you'll want to select a code line number off to the left side of the screen. This will create a blue arrow on the line number.

> If you accidentally select a line you didn't mean to, that's okay. Pressing this line again will disable the breakpoint you just created

![The blue arrow being added to line 7 of the app.js file](./breakpoint_add.png)

A race-car needs to drive around the track until the point where the pit-stop is in order to be inspected; _your code needs to run through a breakpoint in order to pause and give you the expected debugging experience_. This means that, with only the above breakpoint enabled, the code will not enter into debug mode until you access  `localhost:3000` in your browser to run the `app.get('/')`  route.

> Some applications may be a bit [quick-on-the-draw](https://en.wiktionary.org/wiki/quick_on_the_draw) in regards to finding an acceptable place to put a breakpoint. If you're having difficulties beating your code running, feel free to replace the `--inspect` flag with `--inspect-brk` which will automatically add in a breakpoint to the first line of code in your running file.
>
> This way, you should have the margins to add in a breakpoint where you'd like one beforehand.

# Using The Debugging Tools {#using-debug-tools}

Once your code runs through a breakpoint, this window should immediately raise to focus (even if it's in the background).

![A breakpoint paused on line 7 at the JSON parsing line](./breakpoint_paused.png)

> If you don't see the `Console` tab at the bottom of the screen, as is shown here, you can bring it up by pressing the `Esc` key. This will allow you to interact with your code in various ways that are outlined below.

Once you do so, you're in full control of your code and its state. You can:

- _Inspect the values of variables_ (either by highlighting the variable you're interested in, looking under the "scope" tab on the right sidebar, or using the `Console` tab to run inspection commands à la [`console.table`](https://developer.mozilla.org/en-US/docs/Web/API/Console/table) or [`console.log`](https://developer.mozilla.org/en-US/docs/Web/API/Console/log)):

  ![A screenshot of all three of the mentioned methods to inspect a variable's value](./inspect_variable_value.png)
- _Change the value of a variable:_
  ![A screenshot of using the Console tab in order to change the value of a variable as you would any other JavaScript variable](./change_variable_value.png)
- _Run arbitrary JavaScript commands_, similar to how a code playground might allow you to:
  ![A screenshot of indexing the body using "body.slice(0, 100)"](./arbitrary_js.png)

## Running Through Lines {#running-through-lines}

But that's not all! Once you make changes (or inspect the values), you're also able to control the flow of your application. For example, you may have noticed the following buttons in the debug window:

![A red circle highlighting the "play" and "skip" buttons in the debugger](./breakpoint_paused_buttons.png)

Both of these buttons allow you to control where your debugger moves next. _The button to the left_ is more of a "play/pause" button. Pressing this _will unpause your code and keep running it_ (with your variable changes intact) _until it hits the next breakpoint_. If this happens to be two lines down, then it will run the line in-between without pausing and then pause once it reached that next breakpoint.

So, if we want to see what happens after the `body` JSON variable is parsed into a variable, we could press the "next" button to the right to get to that line of code and pause once again.

![A screenshot of the JSON being parsed into a few variables with some console logs to prove it did really parse and run the line above it](./next_line.png)

Knowing this, let's move through the next few lines manually by pressing each item. The ran values of the variables as they're assigned should show up to the right of the code itself in a little yellow box; This should help you understand what each line of code is running and returning without `console.log`ging or otherwise manually.

![A screenshot showing ran lines until line 12 of the "console.log". It shows that "employeeAges" is "\[undefined\]"](./next_few_lines.png)

But oh no! You can see, `employeeAges` on line `9` is the one that results in the unintended `[undefined]`. It seems to be occurring during the `map` phase, so let's add in a breakpoint to line `10` and reload the `localhost:3000` page (to re-run the function in question).

Once you hit the first breakpoint on line `7`, you can press "play" once again to keep running until it hits the breakpoint on line `10`.

![Two breakpoints on line 7 and 10, currently paused on line 10](./press_run_twice.png)

This will allow us to see the value of `employee` to see what's going wrong in our application to cause an `undefined` value.

![A show of the "employee" object that has a property "employee\_age"](./inspect_employee.png)

Oh! As we can see, the name of the field we're trying to query is `employee_age`, not the mistakenly typo'd `employeeAge` property name we're currently using in our code. Let's stop our server, make the required changes, and then restart the application.

We will have to run through the breakpoints we've set by pressing the "play" button twice once our code is paused, but once we get through them we should see something like the following:

![Showing that the console log works out the way expected once the map is changed](./working_ran_debugger_code.png)

There we go! We're able to get the expected "23"! That said, it was annoying to have to press "play" twice. Maybe there's something else we can do in similar scenarios like this?

## Disabling Breakpoints {#disabling-breakpoints}

As mentioned previously in an aside, you can disable breakpoints as simply as pressing the created breakpoint once again (pressing the line number will cause the blue arrow to disappear). However, you're also able to temporarily disable all breakpoints if you want to allow code to run normally for a time. To do this, you'll want to look in the same toolbar as the "play" and "skip" button. Pressing this button will toggle breakpoints from enabling or not. If breakpoints are disabled, you'll see that the blue color in the arrows next to the line number will become a lighter shade.

![Showcasing the lighter shade with a red arrow over the mentioned button](./disabled_breakpoints.png)

Whereas code used to pause when reaching breakpoints, it will now ignore your custom set breakpoints and keep running as normal.

## Step Into {#debugger-step-into}

In many instances (such as the `map` we use in the following code), you may find yourself wanting to step _into_ a callback function (or an otherwise present function) rather than step over it. For example, [when pressing the "next" button in the previous section](#running-through-lines), it skipped over the `map` instead of running the line in it (line 10). This is because the arrow function that's created and passed to `map` is considered its own level of code. To dive deeper into the layers of code and therefore **into** that line of code, instead of the "next line" button to advance, you'll need to press the "step into" button.

![A showcase of a breakpoint on line 9 currently paused and a circle around the step into button](./step_inside.png)

Let's say you're on line `9` and want to move into the `map` function. You can press the "step into" to move into line `10`.

![The after effects of pressing the "step into" button after the screenshot above](./step_inside_part_2.png)

Once inside the `map` function, there's even a button _to get you outside of that function and back to the parent caller's next line_. This might if you're inside of a lengthy `map` function, have debugged the line you wanted to inspect, and want to move past the `map` to the next line (the `console.log`). Doing so is as simple as "stepping in" a function, you simply press the "step outside" button to move to the next line

![The "step outside" button being highlighted with a circle with the line 12 console log being paused](./step_outside.png)

> While the example uses a callback in `map`, both of these "step into" and "step out of" also work on functions that are called. For example, assume the code was written as the following:
>
> ```javascript
> const getEmployeeAges = partialList => {
>   const ageArray = [];
>   for (employee of partialList) {
>     ageArray.push(employee.employee_age);
>   }
>   return ageArray;
> };
>
> app.get('/', (req, res) => {
>   request('http://www.mocky.io/v2/5e1a9abe3100004e004f316b', (error, response, body) => {
>     const responseList = JSON.parse(body);
>     const partialList = responseList.slice(0, 20);
>     const employeeAges = getEmployeeAges(partialList);
>     console.log(employeeAges);
>   });
> });
> ```
>
> You would still be able to "step into" `getEmployeeAges` and, once inside, "step outside" again in the same manor of the `map` function, as shown prior.

# Saving Files {#editing-files-in-chrome}

One more feature I'd like to touch on with the debugger before closing things out is the ability to edit the source files directly from the debugger. Using this feature, it can make the Chrome debugger a form of lite IDE, which may improve your workflow. So, let's revert our code to [the place it was at before we applied the fix we needed](#example-code) and go from there.

![The screenshot of the debugger with the original code](./initial_debugger.png)

Once this window is open, you're able to tab into or use your cursor to select within the text container that holds your code. Once inside, it should work just like a `textarea`, which _allows you to change code as you might expect from any other code editor_. Changing line `10` to `return employee.employee_age` instead of `return employee.employeeAge` will show an asterisk (`*`) to let you know your changes have not yet been applied. _Running your code in this state will not reflect the changes made to the code content on the screen_, which may have unintended effects.

![Showing the asterisk once changes made but not saved](./edited_but_not_saved.png)

In order to make your changes persist, you'll need to press `Ctrl + S` or `Command + S` in order to save the file (much like a Word document). Doing so will bring up a yellow triangle instead of an asterisk indicating _your changes are not saved to the source file but your changes will now take effect_. Re-running the `localhost:3000` route will now correct the behavior you want, but if you open `app.js` in a program like Visual Studio Code, it will show the older broken code.

![A screenshot showing the yellow triangle once this occurs](./temporarily_saved.png)

Not only does VS Code not recognize your changes, but once you close your debugging window, you won't know what you'd changed in order to get your code to work. While this may help in short debugging sessions, this won't do for a longer session of code changes. To do that, you'll want your changes to save to the local file system.

## Persisting Changes {#chrome-as-ide-persist-changes}

In order to save the changes from inside the Chrome to the file system, you need to permit Chrome access to read and write your files. To do this, you'll want to press the "Add folder to workspace" button off to the left of the code screen.

![A red rectangle around "Add folder to workspace" button](./add_folder_to_workspace.png)

Selecting the folder your `app.js` is present in will bring up the dialog to give Chrome permission to view the files and folders within. You'll need to press "Allow" in order to save your saves to your file system.

![A screenshot showing the "Allow"/"Deny" dialog](./allow_fs_usage.png)

Once done, you should now see a list of the files and folders in the parent folder. It should automatically have highlights over the `app.js` file and remove the yellow triangle in favor of another asterisk.

![A screenshot as described in the previous paragraph](./fs_permitted_not_saved.png)

As I'm sure you've guessed, the asterisk indicates that you'll need to save the file again. Once done (using the key combo), the asterisk should disappear.

It's not just JavaScript files you're able to edit, though! You can click or use your keyboard to navigate the file tree of the parent folder. Doing so will allow you to edit and save changes to _any_ file in the filesystem. This would include the `package.json` file in the folder.

![A screenshot of the package json file being edited](./package_json.png)

# Conclusion

While we've covered a lot of functionality present within the Chrome debugger, there's still more to cover about it! If you'd like to read more about it, you may want to take a look at [the extensive blog series by the Chrome team](https://developers.google.com/web/tools/chrome-devtools/javascript) that offers a much deeper dive into all of the debugging tools present within Chrome. Luckily, the skills that you gain while debugging Node.JS applications carries over to debugging front-end JavaScript, so hopefully this article has helped introduce you to the myriad of tools that Chrome has to offer.

Leave a comment down below if you have a question or comment, or feel free to join [our Discord](https://discord.gg/FMcvc6T) to have a direct line to us about the article (or just general tech questions).
