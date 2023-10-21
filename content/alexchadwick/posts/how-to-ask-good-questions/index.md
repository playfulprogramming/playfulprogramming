---
{
	title: "How to ask better questions",
	description: "We all ask questions from time to time, so here are some of my favourite tips when it comes to how to improve the quality of your questions.",
	published: '2022-07-20T20:10:03.000Z',
	tags: ['opinion'],
	license: 'cc-by-nc-sa-4'
}
---


## Introduction

In this day and age, the programming ecosystem has become so rich and complex that asking questions is inevitable for any developer, regardless of what stage of their career they find themselves in.

However, it is not always easy to ask a question, and often you'll see StackOverflow questions being downvoted or taken down because of a sense of confusion around the question itself.

Asking the best possible questions is essential to getting help quickly, as whoever is reading your question will have immediate access to most of the information they need to come up with an answer that could potentially answer your doubts.

So in this article, I wanted to cover the basics on how to improve your questions, in order to get good answers.

Note: Most of these concepts could also apply to opening issues on OSS projects, or to give feedback to different pieces of software

## Define the exact problem you're facing

Now whilst this sounds simple, there are many people who struggle to define their problem. If you're not able to identify the problem you've got, how do you expect other people to be able to identify it for you?

The most basic way to define your problem is to explain what the expected behaviour is, and what the actual behaviour is. For example:

> *I've written a function `sum` that is meant to return the sum of 2 numbers. When I do `sum(1, 1);` I'm expecting it to return 2, however it's returning 1.*

Now whoever is reading my question knows what I'm trying to achieve and what is currently happening.

I see a lot of questions where people describe their expected behaviour but omit their current behaviour, or the other way around.

Also, feel free to share screenshots if whatever you're working on has graphics, however, **always try to avoid using screenshots for code, output, or errors that may display on the command line**. Most people prefer that you copy and paste them instead, as it ensures it remains accessible for people with disabilities and translatable for people that speak different languages. Only use images when you need to if possible.

## Share your problematic code

If you can pinpoint the problematic code, then it's important that you share it. If it's too large to share directly, introduce a link to a pastebin or github repository and explain what you're linking to so people know where to find your code. Remember not to link your entire repository as people don't have the time to be searching through your code to find the problem.

In my previous example I would do the following:

> *This is where `sum` is defined and how I'm calling `sum`:*
> 
> ```javascript
> function sum(a, b) {
>     return a * b;
> }
> 
> 
> const result = sum(1, 1); // result == 1?
> ```

It also helps to introduce some comments if you don't have them already. These can add notes, explain a complex piece of code, or describe a function that is defined elsewhere.

## Share what you have tried

Just to save everyone some time, and also get a better understanding of the entire problem, share what you have already tried. If you haven't tried anything yet, try googling for similar problems, and at least attempt to brainstorm a solution. Do your best to try something before asking someone else.

Sharing what you've tried helps people to rule out anything you've already tried and they can concentrate on thinking of another solution that might work. Following my basic example:

> *I've also tried to pass in 2 and 2 and that seemed to work, but then if I passed in 3 and 2 I would get 6.*
> 
> 
> 
> *Finally I've tried to do sum like the following but that also didn't work:*
> 
> ```javascript
> function sum(a, b) {
>     return b * a;
> }
> ```



## Other tips for asking questions

Those are the main tips that are applicable to any programming question, regardless of  where / when you're asking the question. But there are other tips that may apply to more specific situations that I want to talk about in this section:

* ###### Choose the right time and the right person
  Are you asking someone at work or in your household? Firstly make sure that it's a good time for them. If they're busy working away then you might want to try to find a different time to ask your question.

* ###### Do some research
  Are there any terms you're unsure of that are relevant to your question? Look around first and make sure *you* know the entire problem before expecting other people to.

* ###### If something's not clear then ask about it
  It's easy to feel bad when someone explains something to you and you still don't fully understand and need to ask again. There is no shame in asking someone to be clearer as long as you're being respectful about it. They're already helping you which means they're probably happy to give away some of their time to help you out!

* ###### Be understanding of other people's time
  Most clearly defined questions can be solved in 15 minutes or less. If you find that a problem is taking longer than that, or you notice the person helping you is taking longer to reply, it's okay to ask for continued help for another time! You could simply ask them when is a more convenient time for you two to have another go at it? Something like:
  
  > *"This is taking more time than it thought it would, is it OK if I asked you if we could give it another go maybe when you've got a bit more time?"*
  
  Most times people will be happy to!

* ###### Finally, asking "bad" questions from time to time is fine
  Don't feel bad if you've asked a question that you're worried is low quality. It's easy to forget that sometimes Google exists and you ask a coworker something that could've been answered faster by the internet! Similarly, don't lash out when someone asks you a bad question. Instead, kindly teach them how to ask better questions for future reference!

## Conclusion

Asking questions is easy, and asking *good questions* can also be easy if you follow the general rules described in this article. But most importantly of all, remember that people answering your questions are often giving up their time for you, so don't forget to be polite, grateful and happy that they're giving you a helping hand.

Similarly, if you're answering a question, make sure to always be polite as well! It only takes a couple people to answer a question rudely or patronisingly to put someone off asking questions and clearing their doubts. We were all beginners once, and many of us still are!

Thanks for the time you've dedicated to reading this article, I really appreciate it. Have a good one!


