---
{
title: "A Deep Dive Into the NestJS Injection Scope",
published: "2020-01-10T19:49:47Z",
edited: "2021-04-06T11:07:02Z",
tags: ["javascript", "typescript", "webdev", "node"],
description: "In my previous piece, we discussed NestJS services. In this piece, we’ll look at the injection scope....",
originalLink: "https://medium.com/better-programming/a-deep-dive-into-nestjs-injection-scope-d45e87fd918d",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "4010",
order: 1
}
---

In my previous piece, we discussed NestJS services. In this piece, we’ll look at the injection scope.

# Provider Scope

There are three modes to define the scope. We can either define the scope properties on the service level or module level. It can be used with a class-based and nonclass-based service and with controllers. The three modes are:

* DEFAULT
* REQUEST
* TRANSIENT

The syntax for defining the scope is as below:

## For service

```javascript
@Injectable({
    scope: Scope.TRANSIENT
})
```

## For module

```javascript
providers : [{
    provide : PRODUCT,
    useValue: Product_Token,
    scope : Scope.REQUEST
}]
```

## For controllers

```javascript
@Controller({ path: 'product', scope: Scope.REQUEST })
```

Now that we're aware of how to use the scope property, let's see each one of them in detail.


## The Default Scope

You don’t need to define the scope to `DEFAULT`. When you don’t define the property, it’s set to `DEFAULT`, and the instances will be singleton (which means once the connection is established, the same instance will be used for all requests).

For most cases, like database connection and logger services, the singleton is the best option to use.

In the below example, showing a `LoggerService` in singleton, any controller/service using `LoggerService` will get the same instance.


![DEFAULT Scope](https://thepracticaldev.s3.amazonaws.com/i/f548mt6xpzxbwid7p3li.jpeg)


## The Request Scope

In a `REQUEST` scope, the same instance will be shared for the same request.

You can see in the below diagram that `LoggerService` is shared for each request. The `GetProduct` action and `ProductService` will share the same instance, and if we try to access an `AddProduct` action, another instance will be created.

A real-time use case is if we want to share the `Request` object between the controller and the service for each request.

![REQUEST Scope](https://thepracticaldev.s3.amazonaws.com/i/gt37tz3bzgoehjj3ubuy.JPG)

## The Transient Scope

In a `TRANSIENT` scope, a new instance will be created for every controller or service where we’re using it. The below diagram shows the same scenario where the scope is changed to `TRANSIENT`. Here a new instance of `LoggerService` is created for every action and service.

![TRANSIENT Scope](https://thepracticaldev.s3.amazonaws.com/i/bbb2xr9nq311g3vclgfa.JPG)

## Code

Create a new `LoggerService` using the below command:

```shell
nest generate service Logger
```

```javascript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({
    scope: Scope.REQUEST
})
export class LoggerService {
    constructor() {
        console.log('new instance of request')
    }
}
```

Next, inject the service into the `ProductController` and the `ProductService`.

```javascript
import { LoggerService } from '../logger/logger.service';

@Controller('product')
export class ProductController {

    constructor(private productService: ProductService,
        private loggerService: LoggerService) { }
}
```

```javascript
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class ProductService {

    constructor(@Inject(PRODUCT) product: Product,
        private loggerService: LoggerService) {
    }
}
```

Next, run the application. Change the scope, and see how the scope gets changed in action.


## Conclusion

Though it’s OK to have a singleton instance, using `REQUEST` and `TRANSIENT` scopes can impact the [performance](https://docs.nestjs.com/fundamentals/injection-scopes#performance), as per docs.
But there may be scenarios where we need to change the scope — but until you’re sure, just use the DEFAULT scope.

But there may be scenarios where we need to change the scope — but until you’re sure, just use the `DEFAULT` scope.
