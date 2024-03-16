---
{
    title: "The Rules of TypeScript Type Inferrencing",
    description: "",
    published: '2025-01-14T21:52:59.284Z',
    tags: ['typescript', 'webdev'],
    license: 'cc-by-4'
}
---

When it comes to elegant TypeScript usage, _inferencing_ is the name of the game. Take two of the following code samples:

```typescript
interface User {
  id: number;
  firstName: string;
  lastName: string;
  // ...
}

// One
function getExplicitUserName(user: User):
	`${Pick<User, "firstName">}${Pick<User, "firstName">}`
{
  return `${user.firstName} ${user.lastName}`;
}

/* vs */

// Two
function getImplicitUserName(user: User) {
	return `${user.firstName} ${user.lastName}`;  
}
```

In the first code sample, we're explicitly using `Pick` to find the type of `firstName` and `lastName` in order to explicitly type `getExplicitUserName`.

In the second code sample, we're implicitly allowing TypeScript to infer the value of `user.firstName` and `user.lastName`.

These two code samples are the same in the eyes of the TypeScript compiler after the implicit values are resolved.

Given this easier readability of `getImplicitUserName`, it's clear why many TypeScript pros suggest and encourage you to allow TypeScript to infer as much information as you can.

Unfortunately, the rules surrounding TypeScript's inferencing can be nuanced and hard to follow, especially in sufficiently complex TypeScript codebases.

Let's explore the how and why behind advanced type inferencing patterns.

# Type Inferencing Basics

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const val = identity(1 as const);
   // ^? 1
```

This also works with classes:

```typescript
class IdentityWithMeta<T> {
  value: T;
  touched: boolean = false;

  constructor(val: T) {
    this.value = val;
  }

  update(val: T) {
    this.touched = true;
  }
}

const classVal = new IdentityWithMeta(1 as const);
classVal.value;
      // ^? 1
```

# Default Type Values

```typescript
function identityWithMeta<T = never>(arg: T): {arg: T, isTouched: boolean} {
  return {arg, isTouched: false};
}

const meta = identityWithMeta(1 as const);
meta.arg;
  // ^ 1
```

Works with classes too:

```typescript
class IdentityWithMetaAndDelete<T = never> {
  value: T | null;
  touched: boolean = false;

  constructor(val: T) {
    this.value = val;
  }

  update(val: T) {
    this.touched = true;
  }

  delete() {
    this.touched = true;
    this.value = null;
  }
}

const classValWithDelete = new IdentityWithMetaAndDelete(1 as const);
classVal.value;
      // ^ 1
```

# Usage with Interfaces

Useful for return types:

```typescript
interface IdentityWithMetaInterfaceRet<T> {
  arg: T;
  isTouched: boolean;
}

function identityWithMetaReturnInterface<T = never>(arg: T): IdentityWithMetaInterfaceRet<T> {
  return {arg, isTouched: false};
}

const metaInterface = identityWithMetaReturnInterface(1 as const);
metaInterface.arg;
           // ^ 1
```

And property types as well:

```typescript
function identityMetaProps<T = never>(arg: {value: T, isTouched: boolean}): T {
  return arg.value;
}

const propReturn = identityMetaProps({value: 1, isTouched: false} as const);
propReturn;
// ^ 1
```

As well as prop interfaces:

```typescript
interface IdentityMetaPropsInterfaceProp<T> {
  value: T;
  isTouched: boolean;
}

function identityMetaPropsInterface<T = never>(arg: IdentityMetaPropsInterfaceProp<T>): T {
  return arg.value;
}

const propInterfaceReturn = identityMetaPropsInterface({value: 1, isTouched: false} as const);
propInterfaceReturn;
// ^ 1
```

# Type Inferencing Rules

## Object Order Matters

```typescript
interface Five<T = unknown, O = unknown> {
  seven: T,
  eight: O
  nine: O
}

class FiveTest<T, O = unknown> {
  constructor(public opts: Five<T, O>) {
  }

  returnOpts() {
    return this.opts;
  }
}

const otherObj = new FiveTest({
    seven: "test",
    eight: "other",
    nine: 1
 // ^ Complains about not being "other", since `eight` comes first
  } as const)

const {seven, eight, nine } = otherObj.returnOpts();
```

## Don't mix generics and explicit values

```typescript
const foo = <T extends string, Defaulted extends string = "default">(
    t: T,
    defaulted: Defaulted
) => ({
    t,
    defaulted
})

const result1 = foo("string", "default") //=>

// This is okay- TS will infer it over the default
const result2 = foo("string", "something else") //=>

// If you provide any args to the generic directly, any with defaults will be forced to that value

const result3 = foo<"foo">("foo", "something else")
```



Which also leads to:

```typescript
interface Test<One, Two = unknown> {
    name: One,
    opts: Two,
    derived: Two extends number ? string : number;
}

class Other<One> {
    constructor(meta: Test<One>) {
    }

    returnSelf() {
        return this;
    }
}

const a = new Other({
    name: "Test",
    opts: 123,
    derived: 123
    // ^ Should throw an error but doesn't, because `Two` is `unknown`, not `number`
})

const val = a.returnSelf();
```





## WTF

No really, why is this happening - I have no idea. It doesn't care about property order _now_?!

```typescript
export interface FieldOptions<
  ValidatorType ,
> {
  validator?: ValidatorType
  onChange?: ValidatorType extends object
    ? ValidatorType
    : () => void
}

export class FieldApi<ValidatorType> {
  constructor(
    public options: FieldOptions<ValidatorType>,
  ) {}
}

const hello = new FieldApi({
  // Shouldn't onChange be the one erroring and basing it off of validator?
  validator: {abc: 123},
           // ^ Type '{ readonly abc: 123; }' is not assignable to type '() => void'.
  onChange: () => {}
} as const)

hello.options
```

