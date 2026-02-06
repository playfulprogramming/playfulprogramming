---
{
title: "C# to Typescript Cheatsheet",
published: "2025-03-16T16:42:22Z",
tags: ["csharp", "typescript"],
description: "As a consultant, sometimes, I have to switch from a project to another. My main (and favorite)...",
originalLink: "https://dev.to/this-is-learning/c-to-typescript-cheatsheet-gp6",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

As a consultant, sometimes, I have to switch from a project to another.
My main (and favorite) programming language is C# since forever but I am also a big fan of TypeScript.
It's very similar to C# but I use less often then C#, so, this is why I have created a cheat sheet in my Notion to make easier the transition between them.

I splitted my commonplace book for this topic by two:

- [Common Syntax](#common-syntax)
- [Advanced Topics](#advanced-topics)

## Common Syntax {#common-syntax}

**1️⃣ Basic Data Types**

| **C#**   | **TypeScript**            |
| -------- | ------------------------- |
| int      | number                    |
| double   | number                    |
| float    | number                    |
| decimal  | number                    |
| bool     | boolean                   |
| char     | string (single character) |
| string   | string                    |
| var      | let or const              |
| object   | any                       |
| dynamic  | any                       |
| DateTime | Date                      |
| Guid     | string                    |

**2️⃣ Variables & Constants**

**C#**

```
int x = 10;
const double PI = 3.1415;
var name = "John";
```

**TypeScript**

```
let x: number = 10;
const PI: number = 3.1415;
let name: string = "John";
```

**3️⃣ Arrays & Collections**

**C#**

```
int[] numbers = { 1, 2, 3 };
List<string> names = new List<string> { "Alice", "Bob" };
```

**TypeScript**

```
let numbers: number[] = [1, 2, 3];
let names: string[] = ["Alice", "Bob"];
```

**4️⃣ Enums**

**C#**

```
enum Status {
    Success,
    Failure,
    Pending
}
```

**TypeScript**

```
enum Status {
    Success,
    Failure,
    Pending
}
```

**5️⃣ Objects & Interfaces**

**C#**

```
class Person {
    public string Name { get; set; }
    public int Age { get; set; }
}
```

**TypeScript**

```
interface Person {
    name: string;
    age: number;
}
```

**6️⃣ Classes & Inheritance**

**C#**

```
class Animal {
    public string Name { get; set; }

    public Animal(string name) {
        Name = name;
    }

    public void Speak() {
        Console.WriteLine("Animal speaks");
    }
}

class Dog : Animal {
    public Dog(string name) : base(name) { }

    public void Bark() {
        Console.WriteLine("Woof!");
    }
}
```

**TypeScript**

```
class Animal {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    speak(): void {
        console.log("Animal speaks");
    }
}

class Dog extends Animal {
    constructor(name: string) {
        super(name);
    }

    bark(): void {
        console.log("Woof!");
    }
}
```

**7️⃣ Properties & Getters/Setters**

**C#**

```
class User {
    private string _name;

    public string Name {
        get { return _name; }
        set { _name = value; }
    }
}
```

**TypeScript**

```
class User {
    private _name: string;

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }
}
```

**8️⃣ Methods & Functions**

**C#**

```
public int Add(int a, int b) {
    return a + b;
}
```

**TypeScript**

```
function add(a: number, b: number): number {
    return a + b;
}
```

**9️⃣ Null & Undefined Handling**

**C#**

```
string? name = null;
if (name != null) {
    Console.WriteLine(name);
}
```

**TypeScript**

```
let name: string | null = null;
if (name !== null) {
    console.log(name);
}
```

**🔟 Loops & Conditionals**

**C#**

```
for (int i = 0; i < 5; i++) {
    Console.WriteLine(i);
}

if (x > 10) {
    Console.WriteLine("Greater than 10");
}
```

**TypeScript**

```
for (let i = 0; i < 5; i++) {
    console.log(i);
}

if (x > 10) {
    console.log("Greater than 10");
}
```

**1️⃣1️⃣ Async/Await & Promises**

**C#**

```
async Task<int> GetDataAsync() {
    await Task.Delay(1000);
    return 42;
}

var result = await GetDataAsync();
Console.WriteLine(result);
```

**TypeScript**

```
async function getDataAsync(): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 42;
}

getDataAsync().then(result => console.log(result));
```

**1️⃣2️⃣ Try-Catch Exception Handling**

**C#**

```
try {
    throw new Exception("Something went wrong");
} catch (Exception ex) {
    Console.WriteLine(ex.Message);
}
```

**TypeScript**

```
try {
    throw new Error("Something went wrong");
} catch (error) {
    console.log(error.message);
}
```

**1️⃣3️⃣ LINQ vs TypeScript Array Methods**

**C#**

```
var numbers = new List<int> { 1, 2, 3, 4, 5 };
var evenNumbers = numbers.Where(n => n % 2 == 0).ToList();
```

**TypeScript**

```
const numbers: number[] = [1, 2, 3, 4, 5];
const evenNumbers = numbers.filter(n => n % 2 === 0);
```

**1️⃣4️⃣ Dependency Injection**

**C#**

```
public interface ILogger {
    void Log(string message);
}

public class ConsoleLogger : ILogger {
    public void Log(string message) {
        Console.WriteLine(message);
    }
}

public class Service {
    private readonly ILogger _logger;

    public Service(ILogger logger) {
        _logger = logger;
    }

    public void Run() {
        _logger.Log("Service running");
    }
}
```

**TypeScript**

```
interface ILogger {
    log(message: string): void;
}

class ConsoleLogger implements ILogger {
    log(message: string): void {
        console.log(message);
    }
}

class Service {
    private logger: ILogger;

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    run(): void {
        this.logger.log("Service running");
    }
}
```

## Advanced Topics {#advanced-topics}

**1️⃣ Generics**

**C#**

```
public class Box<T> {
    public T Value { get; set; }

    public Box(T value) {
        Value = value;
    }
}
```

**TypeScript**

```
class Box<T> {
    value: T;

    constructor(value: T) {
        this.value = value;
    }
}
```

**2️⃣ Reflection (Metadata)**

Reflection is common in C#, but TypeScript requires decorators to achieve similar behavior.

**C#**

```
using System;
using System.Reflection;

class Example {
    public string Name { get; set; }
}

var example = new Example { Name = "Test" };
Type type = example.GetType();
foreach (PropertyInfo prop in type.GetProperties()) {
    Console.WriteLine($"{prop.Name}: {prop.GetValue(example)}");
}
```

**TypeScript (Using Decorators)**

```
function Reflect(target: any, key: string) {
    console.log(`Property Name: ${key}`);
}

class Example {
    @Reflect
    name: string = "Test";
}
```

**3️⃣ Dependency Injection with Interfaces & Inversion of Control (IoC)**

**C# (Using .NET’s built-in DI)**

```
public interface ILogger {
    void Log(string message);
}

public class ConsoleLogger : ILogger {
    public void Log(string message) {
        Console.WriteLine(message);
    }
}

public class Service {
    private readonly ILogger _logger;

    public Service(ILogger logger) {
        _logger = logger;
    }

    public void Run() {
        _logger.Log("Service is running");
    }
}
```

**TypeScript (Manual DI)**

```
interface ILogger {
    log(message: string): void;
}

class ConsoleLogger implements ILogger {
    log(message: string): void {
        console.log(message);
    }
}

class Service {
    private logger: ILogger;

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    run(): void {
        this.logger.log("Service is running");
    }
}
```

**4️⃣ Events & Delegates**

**C#**

```
public class Publisher {
    public event Action<string> OnMessage;

    public void SendMessage(string message) {
        OnMessage?.Invoke(message);
    }
}

public class Subscriber {
    public void Subscribe(Publisher publisher) {
        publisher.OnMessage += HandleMessage;
    }

    private void HandleMessage(string message) {
        Console.WriteLine($"Received: {message}");
    }
}

var pub = new Publisher();
var sub = new Subscriber();
sub.Subscribe(pub);
pub.SendMessage("Hello!");
```

**TypeScript (Event Emitter)**

```
class Publisher {
    private listeners: ((message: string) => void)[] = [];

    addListener(listener: (message: string) => void) {
        this.listeners.push(listener);
    }

    sendMessage(message: string) {
        this.listeners.forEach(listener => listener(message));
    }
}

class Subscriber {
    subscribe(publisher: Publisher) {
        publisher.addListener(this.handleMessage);
    }

    private handleMessage(message: string) {
        console.log(`Received: ${message}`);
    }
}

const pub = new Publisher();
const sub = new Subscriber();
sub.subscribe(pub);
pub.sendMessage("Hello!");
```

**5️⃣ Abstract Classes & Interfaces**

**C#**

```
public abstract class Animal {
    public abstract void Speak();
}

public class Dog : Animal {
    public override void Speak() {
        Console.WriteLine("Woof!");
    }
}
```

**TypeScript**

```
abstract class Animal {
    abstract speak(): void;
}

class Dog extends Animal {
    speak(): void {
        console.log("Woof!");
    }
}
```

**6️⃣ Threading & Async Processing**

**C# (Using Task)**

```
using System;
using System.Threading.Tasks;

async Task DoWorkAsync() {
    await Task.Delay(1000);
    Console.WriteLine("Task Complete!");
}

await DoWorkAsync();
```

**TypeScript (Using Promise)**

```
async function doWorkAsync(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Task Complete!");
}

doWorkAsync();
```

**7️⃣ Decorators (C# Attributes vs TypeScript Decorators)**

**C#**

```
using System;

[AttributeUsage(AttributeTargets.Class)]
public class CustomAttribute : Attribute {
    public string Name { get; }

    public CustomAttribute(string name) {
        Name = name;
    }
}

[Custom("ExampleClass")]
public class Example { }
```

**TypeScript**

```
function Custom(name: string) {
    return function (constructor: Function) {
        console.log(`Applying decorator to ${constructor.name} with name: ${name}`);
    };
}

@Custom("ExampleClass")
class Example { }
```

**8️⃣ Pattern Matching & Type Guards**

**C# (Using is Operator)**

```
object obj = "Hello";

if (obj is string str) {
    Console.WriteLine(str.ToUpper());
}
```

**TypeScript (Using Type Guards)**

```
let obj: any = "Hello";

if (typeof obj === "string") {
    console.log(obj.toUpperCase());
}
```

**9️⃣ Working with JSON & Serialization**

**C#**

```
using System.Text.Json;

var person = new { Name = "John", Age = 30 };
string json = JsonSerializer.Serialize(person);
Console.WriteLine(json);
```

**TypeScript**

```
const person = { name: "John", age: 30 };
const json = JSON.stringify(person);
console.log(json);
```

**🔟 Fluent API Pattern**

**C#**

```
public class Car {
    public string Color { get; private set; }
    public int Speed { get; private set; }

    public Car SetColor(string color) {
        Color = color;
        return this;
    }

    public Car SetSpeed(int speed) {
        Speed = speed;
        return this;
    }
}

var myCar = new Car().SetColor("Red").SetSpeed(100);
```

**TypeScript**

```
class Car {
    private color: string;
    private speed: number;

    setColor(color: string): this {
        this.color = color;
        return this;
    }

    setSpeed(speed: number): this {
        this.speed = speed;
        return this;
    }
}

const myCar = new Car().setColor("Red").setSpeed(100);
```

---

Thanks for reading this post, I hope you found it interesting!

Feel free to follow me to get notified when new articles are out 🙂

<!-- ::user id="kasuken" -->
