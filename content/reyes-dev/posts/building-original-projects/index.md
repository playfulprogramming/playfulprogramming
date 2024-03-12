---
{
  title: "How to Build Original Projects",
  description: "People often say that you should build your own projects to grow as a developer, without explaining how. Let's learn how to actually plan and build your own custom projects.",
  published: '2023-11-09',
  tags: ["opinion"],
  license: 'cc-by-4'
}
---

There's a lot of different ways to practice programming. You can solve coding exercises, go through courses, or read books. Maybe you've done some or all of these, but don't feel enthusiastic about your results. You're not growing or having much fun, yet you feel obligated to keep consuming material in order to obtain skills.

I'm going to suggest another way to grow as a software developer that you might want to experiment with: building original projects. The broadest definition of an original project can be boiled down to:
- It is a new creation of your mind; there is no guide or tutorial that can teach you directly how to build it
- It solves a real world problem you or others have

To clarify, an original project is not necessarily a completely new product that nobody has ever thought of, or invented before (although it can be!).  I also don't mean that you are *not allowed* to reference external materials while building one for it to be *genuinely original*.

Rather, the essence of the original project is autonomy and personal vision. You are laying all the groundwork: the ideas, plan, research, and features. Then, you will execute on your plan of action by translating the broad ideas into code. By the end, you will have in your hands new software for your use case. 

You will be trading in the prepackaged, tutorial-project approach for a slightly scarier, but ultimately more rewarding approach, driven mainly by your creativity and problem-solving skills.

# Why should you build original projects?
Motivations for building an original project can range from learning purposes, to making that dream app you wish existed, to writing plugins/tools for software you already use, or even just pure entertainment. You likely have your own motivations, and hopefully I can convince you to take the plunge.

Building an original project is an exciting act of creation that will draw out all of your latent abilities, giving you a fresh view into your strengths and weaknesses as an engineer. You will level up, build something useful and have fun along the way. 

If that's too abstract, consider these more practical reasons:
- It brings you immediately to the end-goal of programming, your dream projects, instead of waiting until you are "skilled enough" to tackle them.
- Your problem-solving skills will get a major upgrade, since you have no easy way forward but to come up with novel solutions.
- The end product brings immediate, tangible value to yours or others lives.
- It is highly motivating to work on something you actually care about.
- They stand out as portfolio pieces.

> In my case, I built my [dream app](https://github.com/reyes-dev/dreampack) (pun intended) from scratch following the process outlined in this article. Most of what is written here is insight garnered from the direct experience of building that project!

# What if you don't feel "ready" yet?

You might feel that you're not ready to build your own projects yet, that you're still missing the right knowledge or experience to begin. That's a common feeling, but you might be more ready than you believe. 

For example, you don't need to know *everything* about programming to start. Regardless of how much you learn prior to building your project, you're still going to have to look up stuff like language syntax, error messages and weird behaviors.

Paradoxically, building your first few original projects is what will make you truly "ready", since you will become comfortable facing strange problems with unknown solutions; that in itself is readiness. You will get into the habit of looking stuff up as you go, and gain immediate, hands-on experience with real world scenarios in the process.

All this being said, if you feel overwhelmed or anxious, that's okay. The rest of this article will walk you through an approach that will hopefully alleviate some of these feelings of confusion.

# Start with the problem you want to solve
Chances are, there is some area of your life that software can improve; something unique to your interests that is meaningful to you. Reflect on problems other people have that could be solved with software. Try getting into the habit of asking yourself in every situation if something could be built to address it. 

Some keys to generating project ideas:

- Be attentive to the world around you.
- Look at what other people are already building.
- Consider keeping a journal of project ideas.

Once you have something that excites you, hold on to that idea.

Imagine having a program that solves this problem. How it feels to use the core feature(s), the colors and layout, the seamless way it accomplishes a task previously tedious or impossible. Sit with your thoughts and ponder the unbridled potential of your idea for a moment. Creativity is deeply encouraged, and you should not limit yourself with thoughts of what you are or are not capable of. Anything goes!
# Make a plan to solve your problem
Now that you have the destination, you need a route to get there. A plan is your road map to success that will guide you through confusion and keep you on the right track to your original goals. If you try to proceed without a written plan, you might get lost in the details and lose track of the bigger picture. You can keep your plan in a physical or digital format, whichever you prefer.
## Brainstorm
I recommend starting with a brainstorming session where you jot all of your ideas and thoughts down somewhere. Take this as an opportunity to think through your approach and what exactly you want your program to accomplish. You can also decide what programming languages, frameworks or libraries you might want to use here.

For example, here is a fake brainstorming session for a hypothetical website:

> *I want to create an indie game blog site that let's people create accounts and write reviews of their favorite indie games, share their hours played/achievements from their Steam account at the top of the review, and upload video files to insert into the blogpost for an audio-textual experience that clearly describes the game. At the end of the blogpost, links with image preview thumbnails to Twitch streams of the game being reviewed are provided for the reader in case they want to see the game in action. These could be current livestreams of the game or past livestreams of the writer.*

## Step-by-step plan
Next, I recommend taking that unorganized jumble of ideas you've produced and unpacking them into a neater, but still rough sketch of your project that outlines that core features at a high-level. If you've generated tons of ideas, it's also time to start separating core features from optionals. For our indie game blog, the core functionality boils down to:

- Authorization: You need a way for users to sign up, log in and log out.
- Blogposts: You need a way for writers to create and save new blogposts, embed videos and pictures.
- Displaying data: Users visiting the site should be able to see recently posted articles upon landing on your site.
- API access: You need to grab data from Steam and Twitch, and display it on the page.
- User interface: How should the layout of the website look visually? You might need some mockups. 

Each of these can be further broken down into subtasks, until you end up with something like:
- Implementing Authorization

  1. Find a suitable authorization library.

     > - Do some research on various auth libraries in my technology if competitors exist
     > - Weigh their pros/cons and pick the best one for my usecase

  2. Read through the documentation and understand how it works.

  3. Add it to your project, set it up following the instructions.

     > - Add links to login/register pages
     > - Setup forms/views if necessary
     > - Test login is working properly and new users are registered

- Implementing Blogposts

  1. First create simple text-only posts that can be posted by authorized users and publicly viewed by anyone. 

     > - Write tests for new posts flow
     >
     > - Setup views and build form for creating new posts
     > - Display new posts on the home page

  2. Look into how to allow authors to upload/insert video files to their blog post.

  3. Find a way to link Steam account data to author account, and display relevant information such as the amount of hours the author has played this game.

  4. With Twitch API access in hand, display past streams of the game at the bottom of any given blogpost.

...And so on until you've covered the high-level features.

Admittedly, this is a gross oversimplification. Depending on the size and scope of your project, there may be *many other factors* at play: What technologies should you use? Will it be desktop, mobile or cross-platform? How many hours will you work on it per day/week? 

While you should address the glaring issues that come to mind as much as possible, at the start of a fresh project, predicting *every step* you'll need to reach the goal line is virtually impossible.  

What we're doing here is preparing a general approach to how we want to build our project using plain language, and setting up actionable tasks that are small enough to be achievable. Be flexible and willing to adjust your plan as needed.

## Gather resources
Spend some time gathering a few resources that you can reference during development. You can find and vet different libraries here, as well as bookmark the best sources of information like docs, books or courses. Consider also making a list of communities that you can ask for help in a moment of need.

When you reach a point where you're not sure how to proceed, your first instinct may be to run to Google, Stack Overflow or ChatGPT. It's fine to use these when the need arises, but we want to take a proactive approach that keeps us in charge during a crisis. By preparing relevant resources to cover the gaps in our knowledge upfront, you'll be better suited to overcome the many inevitable obstacles you'll face.

## Wrapping up the planning phase
With the broad vision in place, a set of sub-tasks, and a bunch of great resources, you're ready to take action. Keep in mind that your plan will change! It is not meant to be a burden that gets in the way of building, but rather a flexible view into the bigger picture of what you're trying to achieve, something to keep you grounded on the path to completion.

Finally, I recommend [keeping a living document](/posts/documentation-driven-development) to record your progress if the project is of sufficient size or complexity. Use it to keep track of your gaps in technical knowledge, how you achieved results, or possible improvements to the architecture of your codebase. Record your insights and make plans to address issues that crop up.

# Start building the project
If you're like me, the first step can be anxiety provoking. This can be as simple as making a new directory, or running a scaffolding command, building out the homepage, or writing your first function. In the planning phase, you should have planned out your core features, prepared actionable tasks, and gathered your preferred tools. All that's left is to actually write some code!

When you're ready, write out the first lines of code to tackle any feature or page. Reference your resources, docs or Google for syntax, and build until you hit your first serious challenge, which the next section can help you with.   

# Troubleshooting
Eventually, you are going to encounter hard problems that don't have obvious solutions at first. These issues will range in difficulty from easy to cryptic, so you'll want to have a few handy protocols to overcome them without too much frustration. Always remember that the chances are greatly in your favor that there is *some way* to solve your problem.

But then, how? Let's take a step back first and understand what this section is all about. When writing code, you eventually reach a point of confusion where you don't know what to do anymore. This can be for a variety of reasons (like being tired or sleep-deprived), but generally the root cause is that you lack some kind of fundamental understanding:
- You're unsure what you specifically want to accomplish.
- There is a gap between what you want to accomplish and your knowledge of how to do that.

The following techniques address these root causes, and can be used individually or mixed together. Each of these could warrant a blogpost of their own, so I'll only be touching upon them briefly, but know that more can be learned about them online.
## Walk through the problem

It's always helpful to begin with broadening your understanding of the issue at hand. Once you've laid out what you're trying to solve, and ways to potentially solve it, you can move forward with more confidence.

### Write it down
Write your problem on paper as clearly and specifically as possible. Explain what is happening, possible reasons it might be happening, and what should be happening instead. For example:
- My page is crashing on load, and I don't know why. I want it to stop crashing. I think it could be related to X,  Y or Z.
- I need to optimize this page load, so that it's twice as fast.
- I want new posts to be displayed without a refresh.
### Consider your options and act on one

Once your problem is clearly written down, what comes next is some attempt at solving it by racking your brain and taking stock of your options: 

> *Maybe I could use a for loop here. There's a section in the docs that addresses this, I could go reread it. Maybe one of my dependencies is at fault. Is this a config problem? I could Google this to see how other people have solved it.*

Okay, it's starting to seem like I am saying that you should solve your problem by solving your problem. The problem here is that your specific situation is going to be wildly unique, and the best approach can only be determined by you in that instant. You'll have to draw on all that you know and improvise for what you don't.

Write down all the things you CAN do, even if your only practical next step is "look up the problem". Pick one path forward and walk down it.

Let's say my problem is that I want new posts to be presented to my timeline without a full-page refresh, but I'm clueless about how to do this. After some Googling, I see that WebSockets is a way to accomplish this. I read through a guide, and gain a basic understanding. Before coding an implementation, I write out pseudocode:

1. First open a web socket connection on the client
2. When the form for a new post gets submitted, send the post through the websocket
3. Listen for when the post is received by the server
4. When a post is received, run a function that appends the new post to an element

Next, we follow through with real code at the most atomic level.

### Divide and conquer

 A sufficiently complex problem will benefit from breaking it down to the smallest subproblems, eventually hitting bedrock and reaching actionable tasks. Using WebSockets sounds daunting at first, but with our approach we just need to tackle one tiny task at a time. The first task can be completed with one line of code:

```javascript
// Open a web socket connection
let socket = new WebSocket(url);
```

We took a single unknown, broadened our knowledge base and applied a potential solution. Rinse and repeat.

> When to use:  You're lost or confused, in need of clarity and a path to action.

## Tackling Error Messages
Error messages will be your constant companion in building projects, and at times can seem obtuse and confusing. However, behind their intimidating exterior lies a wealth of useful information. Let's see if we can take advantage of error messages to solve our problems.

In order to work with error messages, we'll need to do two things:

1. Locate the two parts of an error message that describe what the error is, and what line of your code the error originated on.
2. Research and resolve the error.

For the following example, I'll be using JavaScript errors, which have an `type`, `message` and `stack trace`. This is a very common anatomy for error messages, but your preferred language might have a different style of errors. This means learning how to read error messages in one language will transfer somewhat to other languages, but it is still highly recommended  to read the documentation on error messages for your chosen tools!

### Anatomy of error messages

In JavaScript's case, when runtime errors occur, an [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) object is thrown holding the relevant information. Let's take a look at this block of JavaScript code:

```javascript
// declaring two numbers
const a = 5;
const b = 2;
// a function that adds two numbers together and returns the result
function add(a, b) {
  return c;
}
// a function that 
function print() {
  const sum = add(a, b);
  console.log(sum);
}
// calling the print function
print();
```

Attempting to run it will result in this error message:

```
Uncaught ReferenceError: c is not defined
	at add (script.js:5:3)
	at print (script.js:9:15)
	at script.js:13:1
```

What went wrong? If we take the message apart piece by piece, we'll understand.

The first line, `Uncaught ReferenceError` refers to the `type`, in this case it is a [ReferenceError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError).

The rest of the line, `c is not defined` refers to the `message`. This is the meaning of the error, and simply means that `c` does not exist as a variable in the current scope.

The last three lines are the `stack trace`, a list of function calls that lead to the point where the error was thrown. In order to read this, we'll start at the last line:

 ```
 at script.js:13:1
 ```

This is saying that we began in the file `script.js`, at line 13, column 1. If we go to that line in our code, we see the print function is called like so:

```javascript
print();
```

From there we can move up the stack trace and read the next line:

```
at print (script.js:9:15)
```

If we look at line 9, column 15 in the same `script.js` file, we'll notice another function call, this time to `add`:

```javascript
const sum = add(a, b);
```

Now we can follow the stack trace up further:

```
at add (script.js:5:3)
at add (script.js:5:3)
```

Which tells us that we should look on line 5:

```javascript
function add(a, b) {
  return c; // This looks like the culprit
}
```

Bingo! It seems like this line, `return c;` is the issue, and true to the error's message, it is trying to reference a `c` variable that has not been defined in the scope of this function. What we wanted to do was store the addition of `a` and `b` in a `c` variable and return it, like so:

```javascript
function add(a, b) {
  const c = a + b;
  return c;
}
```

This solves the error and now if we run the script, `7` is logged to the console.

### Researching error messages

After you've looked into the message and stack trace, you might still have questions. In this case, it's okay to copy-and-paste the message into Google or StackOverflow. Someone else may have run into the same error and posted about it, or a very similar error that can still lead to insight. You might also investigate the docs or forums for your technology. 

I'd still recommend parsing your message manually first, as doing so can give you useful information like the type of the error, which you can also look up and read about.

> When to use: If your problem stems from a bug that produces an error message, always!

## Try Debugging
The basic premise of debuggers are that you can observe the behavior of your code as it's executing. By setting one or several `breakpoints`, your debugger will allow you to slowly step forward line-by-line starting from one of the breakpoints set. The benefit of this is that you can examine the state of your variables in the current scope as you move through the execution of your code.   

How you debug will depend on your development environment and language. If you use Chrome, one way to practice is to use the built-in debugger, [as outlined in this official guide to debugging JavaScript in Chrome](https://developer.chrome.com/docs/devtools/javascript/). There is also a [powerful way to debug NodeJS applications using Chrome](/posts/debugging-nodejs-programs-using-chrome) if that interests you.

Your IDE will likely have a built-in debugger: learn it! For a quicker fix, you can also try print debugging using your language's print method, for example `console.log` in JavaScript.

> When to use: You feel that greater understanding of your code's state at different points in its execution will help solve the problem, or after reading an error message.

## SLOWLY re-read primary sources
Sometimes what you lack is a strong enough conceptual basis to properly handle the problem. If you're having trouble applying something that you skimmed/skipped the docs for, try to go back and reread thoroughly. 

Even if you did read it slowly the first time, by the time you've grappled with some code, your perspective has changed a bit, so refreshing your understanding may be more beneficial than you think. All docs are different, but you'll want to peek around at a few different key areas:

- The table of contents. This might seem obvious, but really take a look at it. You might find a relevant article that you missed before. There may also be different sections, like a FAQ, examples, API reference, or tutorials.
- Getting Started/Basics. True to the name, you can usually begin here. If you just wanted to jump ahead to what is relevant to you, don't forget that you can always acquire a more fundamental understand reading through the introductory articles. 
- The API reference. Here you will find details regarding specific features, methods, objects or properties provided by your technology. If you hit a wall with the core guides, never be afraid to take a look at the information provided here.
- The FAQs. Oftentimes, common problems will be addressed in good docs in the FAQs section. Though not all docs will have a FAQ, if they do, check it.
- Showcase/Examples. Consists of coded implementations of the technology, this is usually where I go if I've read the main content and glanced at the API.

> When to use: You feel that you're missing something, or can't understand how to use a technology for desired effect, it's likely your knowledge is has shaky foundations.

## Seek the help of tech communities
If you've entered some communities, introduce yourself and try leveraging their help in a respectful manner for new perspectives into your issue. Find the relevant channel or subforum of your community, and then [ask good questions](/posts/how-to-ask-good-questions), providing relevant context, errors, and code samples. Sometimes the mere act of explaining your problem to others will grant new insight on how to solve it.

Please be polite towards others when asking for help. Programming-related problems can be frustrating and at times emotional, but if people are offering to help you out of kindness, be mindful of your reaction to their advice.

> When to use: You've tried to solve your problem other ways to no avail, or else when you've sunk lots of time into a problem and still see no path towards a working solution.

## Experiment
Experimenting with your code will yield fresh perspectives on the problems you face. Try setting up an environment where you can freely alter your implementation. 

If you're using git, you can create a new branch with `git checkout -b branch-name` and make changes to your code with no consequences. Create several differing branches to try different ways to implement the same feature, and pick the best possible route. 

Comment out code, or try a different library. Seek new dev tools or algorithms. Look at other people's code. Sometimes you just need to play and tinker until you've broken new ground.

> When to use: You want to generate new approaches to solving a problem.

## Build out a miniature project 
One tactic I find helpful, especially when adopting new technologies or methods, is to spin up a smaller, simple environment to experiment in with zero pressure. You can use one of the many online development environments or scaffold a quick local repo. 

Either way, the idea here is to get your hands dirty with a new technology or code solution in a safe, contained environment. Play around and quickly gain a better understanding by adjusting factors and constraints. The benefit of this approach is that you can quickly hit a lightbulb moment of clarity on how to do something without it getting tangled in the rest of your main projects mess. When the time comes to integrate it into your project, you will already have hands on experience.

> When to use: You want to test out some code and understand it without interference from the rest of your program.

## Revert to a previous stage/commit
Sometimes you have moved forward in a direction that bottlenecks you greatly, makes everything else harder, or just doesn't work the right way. Usually, it's a gut feeling that you're doing something very wrong. In this case, you can return conditions prior to your current implementation with your version control system, and begin anew. I would consider this as a last resort; often you can reach the destination with a bit more pushing.

> When to use: You understand the problem at hand, and you suspect your chosen implementation was incorrect, thus yielding bad results, and want to start over. 

## Take a break
My favorite method for solving all problems in programming (or life): sleep on it! After spending an ample amount of brainpower on a task, a solid break can work like magic to help you solve a problem. Resting enables the diffuse mode of thinking, allowing the brain to absorb studied knowledge and recoup energy. When you try again later, you may be surprised to find that you see the problem in a completely new light.

> When to use: You feel exhausted, your thoughts are a mess, and you're starting to lose the ability to read code.

# Pitfalls and Woes
If your project drags on for long enough, you may eventually run into some pitfalls that slow your progress and simulate the feeling of getting stuck in mud.
## Feature creep
If you are very enthusiastic about the thing you're building, you might be dreaming up all the things it will be able to do. You might also get obsessive over refactoring and perfecting your code. This is actually a good sign, as it shows that you are both an inventor and an artisan of your craft. 

However, it's important to draw the line between essential functionality and desired functionality, or in simpler terms, needs and wants. Just be honest with yourself about what is really important. If your goal is rapid growth, a fancier navbar may not be mission critical.

## Boredom
It's day 1, you're pumped up, you can see the dollar signs (or GitHub stars), and you initialize the repo. Skip forward to day 180, how do you feel? Maybe you're still excited to work on the project, but you've grown used to it, hacked out the main features, and you're starting to get interested in other projects. 

How do you keep momentum when you get tired of your pet project? 

One approach is to establish a minimal habit, where you set aside a certain *small* amount of time a day or week to continue building and perfecting your personal project, while spending the bulk of your time elsewhere. 

Another approach is to reignite the fire with a new brainstorming session, reconnecting with what got you excited about it in the first place. Consider all the benefits you or your users could derive from adding that new feature, or optimizing performance, rewriting in a new language, or redesigning the UI.
## Stuck on unsolvable problem
If you've tried everything in the troubleshooting section and still see no results, don't fret! You may have to work around it: Go with a hacky solution, study more, ask more people, experiment further or shelve it for now. Usually, sheer persistence is enough. It's critical not to beat yourself up, as everyone is bested occasionally by really hard problems. 

# Wrapping up your Projects

If you've made it this far, congratulations! Finishing a project or reaching a major milestone can be a triumphant experience. Hopefully you've clearly defined the stopping (or slowing) point, and overcome your major problems and pitfalls in order to arrive here. 

Even if your project remains incomplete, it's very likely that you learned a lot in the process, identified your strengths and weaknesses, and arrived at the other end a better engineer. You may also be committed to maintaining your project, or  just want to keep improving it into the indefinite future. It's all up to you!

# Conclusion
As a final note, don't worry about how long each step of the process takes. Planning, for example, shouldn't take *X amount of hours/days*. It's always up to you when to move on with things. Do what works best for your workflow. 

Since projects come in all shapes and sizes, your unique challenges may require new approaches. Don't be afraid to try things out that aren't covered here! I hope that by using the general framework provided here, you can approach your next project with more confidence.
