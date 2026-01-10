---
{
title: "Angular Dependency Injection Simplified for .Net and Java Developers",
published: "2019-12-06T19:29:17Z",
edited: "2021-04-06T11:06:03Z",
tags: ["angular", "javascript", "java", "typescript"],
description: "Recently one of the .Net developer asked me the question \"why we use class rather than interfaces whi...",
originalLink: "https://dev.to/this-is-angular/dependency-injection-simplified-for-net-and-java-developers-4j1l",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Recently one of the .Net developer asked me the question "why we use class rather than interfaces while using Dependency Injection" the question was valid because as a .Net developer that was what we learned, Do not use or create a class instance directly. 

# Introduction

To be frank for me it's been more than a year I wrote .Net code, but I have written it for more than 8 years, I will copy the example from Microsoft documentation here, the below example shows how to create an instance, which is true for .Net as well as Angular.

```ts
public class IndexModel : PageModel
{
    MyDependency _dependency = new MyDependency();

    public async Task OnGetAsync()
    {
        await _dependency.WriteMessage(
            "IndexModel.OnGetAsync created this message.");
    }
}
```

## Dependency Injection In .Net

The correct way to do this in .Net is

* Define an interface 
```ts
public interface IMyDependency
{
    Task WriteMessage(string message);
}
```

* Use the interface to create a new service
```ts
public class MyDependency : IMyDependency
{
    private readonly ILogger<MyDependency> _logger;

    public MyDependency(ILogger<MyDependency> logger)
    {
        _logger = logger;
    }

    public Task WriteMessage(string message)
    {
        _logger.LogInformation(
            "MyDependency.WriteMessage called. Message: {MESSAGE}", 
            message);

        return Task.FromResult(0);
    }
}
```

* Register the interface and service
```ts
services.AddScoped<IMyDependency, MyDependency>();
```

* Using the DI in another class
```ts
public class IndexModel : PageModel
{
    private readonly IMyDependency _myDependency;
    
    public IndexModel(IMyDependency myDependency) {
        _myDependency = myDependency;
    }

    public async Task OnGetAsync()
    {
        await _myDependency.WriteMessage(
            "IndexModel.OnGetAsync created this message.");
    }
}
```

The advantage of using the above approach is we can easily replace MyDependency with another class in the future and wherever we inject IMyDependency in we get the instance of that new Service, thus avoiding any direct dependency between the service and controller.

## Dependency Injection In Angular

Angular has it's on DI framework, so there is no complication of registering an interface and related service as we saw in .Net implementation

We will be looking at Class providers for this article, to create a new service we can run 

```bash
ng g service <service-name>
```

* The service code looks like below

```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(public http: HttpClient) { }

  login(user: any) {
    console.log('login service called.');
  }
}
```

I have left the login method blank just for visibility purpose, the service may have some HTTP calls as well.

* Using it in component

```ts
import { Component }   from '@angular/core';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  template: `<button (click)="login()">Login<button>`
})
export class LoginComponent {
 
  constructor(loginService: LoginService ) {
   
  }
    
  login() {
      this.loginService.login('test');
  }
  
}
```

The above component has loginService injected, but wait we are using the class name here rather than an interface as we do in .Net, if we are directly using the class how is it Dependency Injection, as we are using class here and why we are not using interface as it does exist in Typescript. Let's explore why and how next.

# Why we cannot use Interface

The first question which comes to developers mind, who comes from .Net background is if interfaces exist why not to use interface rather than the class to achieve Dependency Injection. Let's see it programmatically why it is not possible.

* Install typescript using 
```bash
npm i typescript -g
```

* Create a Folder `InterfaceDemo` where we will create few files

* Open the folder with VS Code and run below command to create tsconfig.json
```bash
tsc -init
```

* Open the `tsconfig.json` file and change `target` to `ES2015`.

* Create a new file name ILogin.ts and copy the below code.
```ts
interface ILogin {
    login(user:any): any;
}
```

* From terminal run below command.
```bash
tsc
```

* Now you will get ILogin.js file open the file and see the code it's 
```js
"use strict";
```

What just happened, do we mean whatever code we write inside interfaces does not exist once we get `.js` files?
Yes, this is what happens, typescript is used mostly for type safety they do not exist once our code is compiled to JavaScript. Now we know, why we cannot use Interfaces for DI here.


# How it is Dependency Injection if We are dependent on Class Instance

Now let's explore how we are not directly dependent on LoginService even though it is injected into the component.

* If you see the code we are not creating an instance of LoginService, we are injecting it, in the same way as we do with interface in .Net, Angular knows how to resolve the dependency, we don't need to create the instance even though injected service is dependent on another service like `HttpClient` in the mentioned example.

Ok agreed that we are not creating the instance, but what if I want to replace LoginService with another service let's call it as NewLoginService, we have to change the code again isn't it?
The answer is No, we don't need to let's see how we can achieve this.

* Create NewLoginService using CLI
```ts
ng g service NewLogin
```

* Add the below code into your service.

```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class NewLoginService extends LoginService {
  constructor(public http: HttpClient) { super(http); }

  login(user: any) {
     console.log('new login service called.');
  }
}
```

* Before you make next change run the app with LoginComponent and click on the Login button and see the console we should see `login service called` 

* Now move to `app.module.ts` and you will notice providers property replace it with the below code.

```ts
providers: [{ provide : LoginService , useClass : NewLoginService }]
```

* Run the application and check the console again, and click on the Login button and see the console we should see `new login service called`.


This is how we can change the old service with a new service without changing even a single line of code, and this is how we can control which service should be available to the application.

Another advantage we get here if older service has 10 methods and we only want to replace 5 methods, add implementation for only 5 new methods in new service. For methods which do not exist in new service will be referred from old service, amazing isn't it?

# Conclusion

The biggest mistake the developers who move to Angular make is they really get comfortable using typescript and feel home, though most of the concepts from C# is available, I always suggest developers read about Javascript as well it is really important, play with typescript try to see the output `js` files whenever you get time. There is really a good post form @layzee 
> https://dev.to/layzee/sorry-c-and-java-developers-this-is-not-how-typescript-works-401
