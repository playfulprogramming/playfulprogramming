# TypeScript Intermediates



## Type Generics

Type generics are a way to handle abstract types in your function. They almost act as a variable for types in that they contain information about the way your types will function.



### The Problem #{generic-usecase-setup}

For example, if you wanted to return the same type as the prop, you would have a hard time doing that without type generics. Take the following:

```typescript
function returnProp(returnProp: string): string {
	return returnProp;
}

returnProp('Test'); // ✅ This is fine
returnProp(4); // ❌ This would fail as `4` is not a string
```

#### Unions #{generic-usecase-setup-union-solution}

Now, if we wanted to accept numbers, we could add that as a union:

```typescript
function returnProp(returnProp: string | number): string | number {
	return returnProp;
}

returnProp('Test'); // ✅ This is fine
const shouldBeNumber = returnProp(4); // ✅ This won't show errors now
```

But you'll find that this doesn't give the example you might want:

```typescript
// ❌ This will yeild an error
// > Operator '+' cannot be applied to types '4' and 'string | number'.
const newNumber = shouldBeNumber + 4;
```

The reason the opperation `shouldBeNumber + 4` yeilds this is because it doesn't know which to give you given your input, given that you've explicitly typed your output

> If you'd left your return type blank, TypeScript would be able to infer what the return type should be just fine
>
> That said, we're trying to build on concepts so we're trying to provide some examples of where this might be used and what it does

#### Function Overloading #{generic-usecase-setup-overloading-solution}

Now, you COULD utilize function overloading to provide the proper typings

```typescript
function returnProp(returnProp: number): number;
function returnProp(returnProp: string): string;
// While this seems duplicative, TS requires it
// Otherwise, it will complain:
// This overload signature is not compatible with its implementation signature.
function returnProp(returnProp: string | number): string | number {
	return a;
}
```

Additionally to having some abnoxious duplicated type information, this method also has it's limitations.

For example, if we wanted to pass in an object of some kind (we'll use `{}` for a placeholder), it would disallow us:

```typescript
returnProp({}) // Argument of type '{}' is not assignable to parameter of type 'string'.
```

This may seem obvious from the typings, but _we ideally want `returnProp` to accept ANY type because **we aren't using any opperations that require knowing the typing**._ (no addition or subtraction to require a number, no string concatenation that might restrict an object from being passed)

#### Any #{generic-usecase-setup-any-solution}

Now, we could obviously use `any`, but then we lose type strictness:

```typescript
function returnSelf(returnProp: any): any {
    return returnProp;
}

const returnedObject = returnSelf({objProperty: 12});

returnedObject.test(); // This will not return an error but should
returnedObject.objProperty; // This will also (correctly) not throw an error, but TS will not know it's a number
```

### The Solution #{generics-intro}

The solution is... Well, you've seen the title I'm sure. Type generics allow us to store loose type data in a _type variable_. A type variable is a unique kind of variable that's not exposed to JavaScript but is rather handled by TypeScript to provide expected typing data. For example, the above example could be coded as:

```typescript
function returnSelf<T>(returnProp: T): T {
    return returnProp;
}
```

In this example, we're defining a type variable `T`, then telling TS that both the property and the return type should be the same type.

So, you can use the function like this:

```typescript
const numberVar = returnSelf(2); // T in this instance is `2`, so it's similar to writing `const numberVal: 2 = 2;`

// Likewise, this object is now returned as if it was just placed on the const
const returnedObject = returnSelf({objProperty: 12});

// So this will fail, as expected
returnedObject.test();
// And this will exist and TS will know it as a number
returnedObject.objProperty;
```

> Author's note
>
> The type variable does not need to be called `T`. In fact, while it seems to be commonplace for the community to use single-letter type variable names (often due to the length and complexity of the typings), there are many reasons why more explicit type names should be used.
>
> Remember, type variables are like other variables in that you need to maintain them and understand what they're doing in your code

### Okay, but Why? #{logger-example}

Why might we want to do this? Returning an item as itself in a [identity function](https://en.wikipedia.org/wiki/Identity_function) (the formal name of the type of function `returnSelf` is) is cool, but not very useful in it's current state. That said, there ARE many many uses for generics in real-world codebases.

For example, let's say that we had the following JavaScript code that we wanted to use as a logger:

```javascript
const util = require('util'),
   	  fs   = require('fs');

// Have the `writeFile` return a promise instead of having to use a callback
const writeFileAsync = util.promisify(fs.writeFile)

/**
 * Async functions allows us to use `await` on promises in the function body, try/catch them, and
 * will return their own promise wrapped around the `return` value
 */
async function logTheValue(item) {
	const jsonString = JSON.stringify(item, null, 2);

	let err = undefined;

	try {
		// Attempt to write a new log file. If this fails, save the error to the `err` variable
		await writeFileAsync(`/logs/${Date.now()}`, jsonString);
	} catch (e) {
		err = e;
	}

	return {
		loggedValue: jsonString,
		original: item,
		// If there was no error, return `undefined` here
		err: err
	}
}
```

If we wanted to type this function, we'd want to make sure to use a generic for the `loggedValue` was using the same generic type as `item`. We could do so inline:

```typescript
async function logTheValue<ItemT>(item: ItemT): {loggedValue: string, original: ItemT, err: Error | undefined} {
	// ... Function body here
}
```

But we could utilize another of generics: The ability to pass the type value of the generic manually, and make an interface with a generic and do so there:

```typescript
interface LogTheValueReturnType<originalT> {
  loggedValue: string;
  original: originalT;
  err: Error | undefined;
}

async function logTheValue<ItemT>(item: ItemT): LogTheValueReturnType<ItemT> {
	// ... Function body here
}
```

We could do so with the function call as well:

```typescript
logTheValue<number>(3);
```

### Non-Function Generics #{non-function-generics}

That's right - functions aren't the only ones with generics. You can use generics in interfaces as you'd seen, but you can also use them in classes (which can be particularly helpful for data structures like this):

```typescript
// DataType might want to be a base64 encoded string, a buffer, or an IntArray
class ImageType<DataType> {
	data: DataType;
  height: number;
  width: number;

  constructor(data: DataType, height: number, width: number) {
		this.data = data;
		this.height = height;
		this.width = width
	};
}

function handleImageBuffer(img: ImageType<Buffer>) {}
```

You could also use them within `type` definitions:

```typescript
interface ImageType<DataType> {
	data: DataType;
  height: number;
  width: number;	
}

interface ImageConvertMethods<DataType> {
  // This is the typing of a method. It will take a prop of the generic type and return the generic type
  toPNG(data: DataType) => DataType;
  toJPG(data: DataType) => DataType
}


type ImageTypeWithConvertMethods<DataType> = ImageType<DataType> & ImageConvertMethods<DataType>
```

### Okay, but why-_er_? #{polymorphic-functions}

Well, type generics enable us to do things like type **polymorphic functions**. _Polymorphic functions are functions that can accept a myriad of different types and handle them differently._

> Polymorphic functions are not unique to TypeScript, I just wanted to include them here as they provide some real-world insight to usages of generics and when they might be able to be used

For example, let's take a look at the code for the `toPNG` :

```javascript
function toPNG(data) {
	if (Buffer.isBuffer(data)) {
		return convertBufferToPNG(data);
	} else if (Array.isArray(data)) {
		const imgBuffer = Buffer.from(data);
		const pngBuffer = convertBufferToPNG(imgBuffer);		
		return Buffer.from(pngBuffer);
	// base64 encoded string
	} else if (typeof data === 'string') {
		const imgBuffer = getBufferFromBaseStr(data);
		const pngBuffer = convertBufferToPNG(imgBuffer);
		return bufferToBase64(pngBuffer);	
	} else {
		throw 'toPNG only accepts arrays, buffers, or strings'
	}
}
```

Even though this function accepts various data types, it handles them differently under-the-hood! 









### Restricting The Types #{extends-keyword}





```typescript
// 
// Don't worry about why right away, just 

function returnSelf(a: any): any {
    return a;
}

returnSelf(2);

returnSelf('t');

const a = returnSelf('test').split(' ');

// The problem here is that with `any`, we're losing type info. We no longer know what the return value of `returnSelf` is
// How do we solve this? Type generics!

function returnSelfGeneric<T>(a: T): T {
    return a;
}

returnSelfGeneric([123, 234]).map(() => {});
// Is the same thing as:
returnSelfGeneric<number[]>([123, 234]).map(() => { });
// The only reason we don't need the `<>` in the first example is because TS does a pretty good job at understanding what type you meant based on the args you're passing


// Ta-da! We're done. What we're saying here is that `a` should be any type. This type will be refered to as `T` from here on out. We can now use that same type
// elsewhere in the function definiton

// This is where you end up with things like `Promise<string>` comes into play. The defintion would look something like:
//Promise<T>((resolve: () => T, reject: () => any) => {then, catch});... You get the point, this is loose syntax and not valid

// What about multiple generics?
// Yup!
// We can restrict the TYPE of generic we want. This allows us to say that T can be any type so long as it extends on this object
function testGeneric<T extends {prop: number}, R>(arg1: T, arg2: R): T | R {
    // Remember that comparisons can run on Dates and other stuff too
    // What about something like this? We want a function that compares a prop but can have anything else? And `prop` should be a number? Seems complex, right?
    if (arg1.prop > 2) {
        return arg1;
    } else {
        return arg2;
    }
}

// This is fine
testGeneric({ prop: 2, hello: 'hi' }, 23)

// This is not
testGeneric({ hello: 'hi' }, 23)


// You can even use type generics in other types

// & means that the type must have both. If T === {hello: string}, then AddType MUST have at least {prop: number, hello: string}
type AddType<T> = T & {prop: number}; // What does `&` do again?

// and finally with classes:
class GenericClass<T> {
    prop: T;
    constructor(arg1: T) {
        this.prop = arg1;
    }
    method(): T {
        return this.prop;
    }
}
```

