---
{
  title: "Fun with Types",
  description: "Making hilarious things with no emitted code.",
  published: "2023-01-05T20:35:30Z",
  edited: "2023-06-25T00:35:10Z",
  tags: ["typescript"],
  license: "cc-by-nc-sa-4",
  originalLink: "https://www.likesdinosaurs.com/posts/fun-with-types",
}
---

I've had a _lot_ of fun over the years writing TypeScript, and I've delved deep into the ~~cursed~~ amazing land of generics. This post is going to be a mix of interesting tidbits, semi-useful things, and some absolutely absurd things that you can do with TypeScript. Nothing here is going to seem immediately practical, but pieces of them can be used in real projects. Everything here is in no particular order, so feel free to jump around.

## Autocomplete is just a suggestion

Here's an interesting one I came accross when browsing through some of the issues on the TypeScript repo.

```ts
function foo(input: "foo" | "bar" | (string & {})) {
	// ...
}
```

This function will take any string as input, but when the consumer of this function is typing in their input, they'll get autocomplete suggestions for the string literals `"foo"` and `"bar"`. Unfortunately, the completion does seem to suggest that those are the only options, so it's not exactly something you may want to use in a real project, but interesting nonetheless.

## Mustache extraction

If you've ever worked with Mustache templates, you'll recognize the syntax for them. They're a nice, simple way to create small templates.

```
Hello, {{name}}!
```

Now let's say, for example, that you're a dinosaur. Now, as a dinosaur, you've decided that it's a great idea to include a small template thing in your framework. Well, of course Mustache is a great way of doing that. Cool, templates! But you don't stop there, because, well, you're a dinosaur (one that writes TypeScript types for entertainment). So now you've decided that you want to make the variables being passed into the template type-safe. So how do you do that? I'm glad you asked!

```ts
type ExtractFromDelimiters<
	S extends string,
	L extends string,
	R extends string
> = string extends S
	? string[]
	: S extends ""
	? []
	: S extends `${infer _Head}${L}${infer U}${R}${infer Tail}`
	? [U, ...ExtractFromDelimiters<Tail, L, R>]
	: [];
```

Woah, that's... a lot. Let's take a look at how I arrived at this type.

So the first thing I did was created a simple type that just pulls one variable out of the template.

```ts
type ExtractFromDelimiters<
	S extends string,
	L extends string,
	R extends string
> = S extends `${infer _Head}${L}${infer U}${R}${infer Tail}` ? U : never;
```

This type uses a [template literal type](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) in combination with type inference to break the string into 5 parts:

1. The part before the left delimiter (Head)
2. The left delimiter (L)
3. The variable (U)
4. The right delimiter (R)
5. The rest of the string (Tail)

So, for example, if we had the string `"Hello, {{name}}!"`, the type would break it into:

1. `Hello, `
2. `{{`
3. `name`
4. `}}`
5. `!`

Next, we need to make the type recursive so that it loops over the entire string and returns all of the variables as an array.

```ts
type ExtractFromDelimiters<
	S extends string,
	L extends string,
	R extends string
> = S extends ""
	? []
	: S extends `${infer _Head}${L}${infer U}${R}${infer Tail}`
	? [U, ...ExtractFromDelimiters<Tail, L, R>]
	: [];
```

Here, we first check if the string is empty, this is the base case for the recursion. If it's not empty, we use the second `extends` check to see if the string has any more variables in it. If it does, we return an array containing the variable and the result of the recursion on the rest of the string (with a spread operator so that the final array is flat). If it doesn't, we return an empty array.

Now, we just need to make sure that the type doesn't break if the string is not a string literal. We can do this by adding a check for `string` in the first `extends` check.

```ts
type ExtractFromDelimiters<
	S extends string,
	L extends string,
	R extends string
> = string extends S
	? string[]
	: S extends ""
	? []
	: S extends `${infer _Head}${L}${infer U}${R}${infer Tail}`
	? [U, ...ExtractFromDelimiters<Tail, L, R>]
	: [];
```

Try it out in the [TypeScript playground](https://www.typescriptlang.org/play?#code/C4TwDgpgBAogHsATgQwMbAGKIPYFsAiEANgJa4nASIDOAPAFACQAylBAhAHYAm1U1SEpwDmAGiYAZNhx58BiIWKYAlaZVn9BI+gD4oAXiit263lABE5pgH4oAbQC6TAFxG1XMwAMAJAG8hAGZUUAD6ABIQyNwAvn4Ssf6cQYhQAKoJygmBwQAqyCRE0Z429qmiUAB0VfBIaJg4BMRkFFR0eQXlEuXKOk6Mro4A3PT0oJBQOQCMBrAIKOhYeISk5JQ0tOaUAlC+vsjR0ZoKIju+AEYH5uXmu1cWlzrDAPRPjFAAetaj4NA5AEwzGrzepLJqrVobO43XxQh7PV4faxAA)!

Now, we need to map this array of variable names to an object with the variable names as keys, and whatever type you want to use as the value (in this case, `string` would be a good choice, but you can add others if you want the templates to accept other types). How do we go about doing that? Well, let's take a look in the next section.

## Mapping tuples to objects

Now, I know this one is a less common use-case, but I have also used this in a real project. Oddly enough, the same project from the last section, but I used this in another part of the project before I added the templating. So lets say you have an array of some input given by the consumer, now this is an array of objects containing metadata about some arguments for a command. Oh, I don't know, maybe arguments for a slash command in a Discord bot? Yeah, that sounds about right.

```ts
const options = [
	{
		type: "STRING",
		name: "name",
		description: "The name of the set you want to look for",
		required: true,
	},
] as const;
```

Hmmm, what's that at the end there? It's my old pal `as const`! `as const` has allowed me to do so many very hilarious things with TypeScript, I don't know what I would do without it. So, what does it do here? Well, it's a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions), which means that the type of the array is now a tuple. This is important, because it means that we get access to the _actual_ values of the options in the array, not just the types. This allows us to do some very cool things.

So now we want to create a type for an object that contains the options passed by the user of said command. This object will map the name of the option to the value the user passed. Let's run through this step by step.

Step 1: Create a type that maps the name of the option to some random type.

```ts
type OptionsObject<T extends Array<OptionInterface>> = {
	[Key in T[number]["name"]]: string;
};
```

Here, we use a generic type to accept the tuple of options. Then, we use a mapped type to loop over all the values in `T[number]["name"]`. This does two things: first it turns the tuple into a union of all the objects inside of it, then it maps that union to just the values of `name` in each object. For now, we'll just map them all to strings.

Step 2: Create a type that maps an individual option to its expected type.

```ts
type OptionTypeMap = {
	STRING: string;
	NUMBER: number;
	BOOLEAN: boolean;
};

type OptionType<T extends OptionInterface> = OptionTypeMap[T["type"]];
```

This one is fairly straightforward. We create a type that simply maps the names of the types to the TypeScript type. Then, we use that with a little helper type to extract the type of the option.

Step 3: Plug that in

```ts
type OptionsObject<T extends Array<OptionInterface>> = {
	[Key in T[number]["name"]]: OptionType<Extract<T[number], { name: Key }>>;
};
```

Wow, that's a lot of angle brackets. Here we use a neat little built in type called [Extract](https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union). Extract is a generic type that takes a union and returns only the types that match the second type passed. We use it here to extract the type of the option whose name matches the current key (neat!).

Step 4: Whoops, we forgot about the `required` property

```ts
type OptionsObject<T extends Array<OptionInterface>> = {
	[Key in T[number]["name"]]: Extract<
		T[number],
		{ name: Key }
	>["required"] extends true
		? OptionType<Extract<T[number], { name: Key }>>
		: OptionType<Extract<T[number], { name: Key }>> | null;
};
```

This uses a ternary to check if the option is required, and if it isn't, then it adds `| null` to the type. (We use null here because of how the library I was using handles optional arguments, but you can use undefined if that fits your use-case better).

If you want to dive a little deeper into the actual types this turned into in my library, you can check out the [specific file these are in](https://github.com/Rodentman87/slashasaurus/blob/main/src/utilityTypes.ts) or just [try out the library yourself](https://www.npmjs.com/package/slashasaurus) to see how it feels as a consumer. It's a little messy, so it may be hard to follow, you have been warned. For extra credit, take a look at how the handlers types are made for the [SlashCommand class](https://github.com/Rodentman87/slashasaurus/blob/main/src/SlashCommandBase.ts).

## Logic Gates

Now, this one has absolutely no practical use, but it's fun to mess with. You can recreate boolean logic with generic types (some of you can alreay see where this is going, and yes, it is going there). Let's start with the simplest one, `NOT`.

```ts
type BinaryDigit = 0 | 1;

type Not<A extends BinaryDigit> = A extends 1 ? 0 : 1;
```

Easy, right? just a ternary to flip the bit. Now, let's do `OR`.

```ts
type Or<A extends BinaryDigit, B extends BinaryDigit> = A extends 1
	? 1
	: B extends 1
	? 1
	: 0;
```

Pretty similar to NOT, just using ternaries to form the logic table. Now that you have the idea, try doing `AND` and `XOR` on your own.

Now, with just these types we can start to form more complex logic circuits. For example, a 1-bit adder.

```ts
type CarryBit<
	A extends BinaryInput,
	B extends BinaryInput,
	Cin extends BinaryInput
> = NOR<AND<OR<A, B>, Cin>, AND<A, B>>;
type ADD1BIT<
	A extends BinaryInput,
	B extends BinaryInput,
	Cin extends BinaryInput
> = [
	OR<AND<OR<OR<A, B>, Cin>, CarryBit<A, B, Cin>>, AND<AND<A, B>, Cin>>,
	NOT<CarryBit<A, B, Cin>>
];
```

This type is a bit of a mess, and there's probably a more efficient way to do this, but I also wrote this type at like 4 am. It's a 1-bit full adder, which takes in two bits and a carry in, and returns the sum and carry out.

You can continue this on to create more and more complex logic circuits, but I think you get the idea. I ended up making an 8-bit adder, and an implementation of a [74181 ALU](https://en.wikipedia.org/wiki/74181). Both of which I'll post on my GitHub at some point in the future.

Fair warning, do _not_ use these kinds of types in real, production code. The 74181 ALU takes my computer about 30 seconds to resolve the type for a single operation. It's not worth it.

## Conclusion

That's all for now, I may make a sequel to this article with some more fun things, but for now this is it. Here's some cool things that other people have made with types:

- [Implementations of various algorithms](https://github.com/ronami/meta-typing)
- [A simplified implemenation of the TypeScript type system](https://github.com/ronami/HypeScript) (yes, really)
- [Literally just straight up SQL](https://github.com/codemix/ts-sql)

Someone else compiled more cool things [here](https://www.learningtypescript.com/articles/extreme-explorations-of-typescripts-type-system).
