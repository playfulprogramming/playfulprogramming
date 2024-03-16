---
{
  title: "Docs, Where Can We Do Better?",
  description: "My personal approach to writing docs, mainly aimed at frameworks and the like.",
  published: "2021-11-13T05:12:03.284Z",
  tags: ["documentation"],
  license: "cc-by-nc-sa-4",
  originalLink: "https://likesdinosaurs.com/posts/first-post",
}
---

I've been programming for about 10 years now and by far the worst thing to navigate has been documentation. There's plenty of good books, tutorials, blog posts, etc. out there, but it seems like almost everyone forgets to make the docs good too.

# So why should I care about docs?

Picture this, you're browsing reddit when someone posts about the hot new library that they think is wonderful and everyone needs to check it out. They link to a blog post about it and so far everything seems great, the blog is showing all the wonderful and amazing things you can do with this hot new lib. So you think to yourself "I really need to check this out." You click the GitHub link in the article and start to read the README. You see that there isn't much to it, just a couple small showcases and install instructions, so you click the docs link hoping to find more.

What you come across is a list of modules, each with a list of objects in them. You aren't quite sure where to start, so you click around, hoping to find a quick start guide, but you come up empty-handed.

You've now spent about 30 minutes on this, and all you have so far is the name of a project and a few cool example pictures. Where do you go from here? You could spend the next hour or two looking at source code for some examples (probably uncommented/poorly commented) and asking around online until you find someone who understands it, or you could hunker down and start reading through type definitions until you understand the project inside and out.

To me, this leaves a sour taste in my mouth. There's now been a lot of time used trying to even know where to start when I could have been already working on my first project. To put this in perspective, if 100 devs did this exact same thing, and spent 2 hours each trying to even get started with this library, that's now 200 hours that could have been spent making software just trying to get their bearings.

---

# So what _should_ docs be like?

Well, there's many possible answers to this, and my method is in no way the only option, nor is it necessarily the best option for every project. This method is more focused around web development and related libraries since that's what I use every day.

My method has four parts: Explain, Define, Exemplify, Integrate. Lets dive into each of these parts and take a look at what they are.

---

## 1. Explain

Start each page with a small explanation of what it is. Is this an object that represents a specific thing? Is this a utils class with functions for handling dates? No need to be specific here, just enough so that the person navigating the docs knows if they're in the right place or not.

Lets try an example with an imaginary project, we'll say that this is an API wrapper for [Discord's API](https://discord.com/developers/docs/intro) written in TypeScript and right now we're writing the docs page for the Guild object.

```txt
A Guild represents a server and stores all the Channels, Roles, and Members of that server within it.
```

---

## 2. Define

This is the raw type definition for this object and its properties and methods. Not much to talk about here, the only thing to keep in mind is to have these be readable and easily navigable. Make the names of the properties and methods stand out so that when a user is scrolling through they can scan for the one they're looking for.

For example:

```
getMember(id: string): Member | null
```

Returns the Member object for the user with the given id, or null if they aren't in the Guild.

---

## 3. Exemplify

The first thing you'll want to do is give one or more abstract examples, this will be here solely to show how to use the API in a vacuum. These are quick examples that someone can look at if all they want to know is how to use the API.

Applying this to our example, we get this:

**Get a member from the guild**

```ts
const member = this.client
	.getGuild("110373943822540800")
	.getMember("152566937442975744");
```

---

## 4. Integrate

This may not be possible or necessary if your library is simply a utility library, but if you're a framework or the like, this part is very important. Here you use an example project to show how this API would integrate into a real world project. Generally it's best to use one project across the entirity of the docs, but sometimes that may not be possible. If you can keep one project across the docs, this will vastly help readers to create a mental model of your library.

In our example here, we could show using it in a command context:

Here we use the guild in our user info command

```ts
  //...
  execute(context, args) {
    const member = context.guild.getMember(args[0]);
    return context.say({
      embed: {
        title: member.user.tag(),
        body: member.roles.map(r => r.toMention()).join(", "),
      }
    })
  }
  //...
```

---

# So how do I put these pages together?

This method works best when you have two views for your docs. One that shows the full pages, organized by topic rather than by package. The other shows just the type definitions and examples, all organized by package for easily finding them when you've already learned the library and just need a quick reference.

# Conclusion

Docs today aren't terrible, but there's definitely a lot to improve on. My method certainly isn't the best, and certainly needs refining. There's also definitely a lot of good examples out there already.

- [Nest.js has some wonderful docs](https://docs.nestjs.com/)
- [React is great as well](https://reactjs.org/docs/context.html).

I only have these two examples for now, but message me on Discord `Rodentman87#8787` with some other good docs so that I can add them to the list. The better the docs, the better software we can build.
