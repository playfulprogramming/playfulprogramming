---
{
title: "Introduction to NestJS Services",
published: "2020-01-08T07:43:05Z",
edited: "2021-04-06T11:08:24Z",
tags: ["typescript", "javascript", "node"],
description: "Service   In enterprise applications, we follow the SOLID principle, where S stands for Sing...",
originalLink: "https://medium.com/better-programming/introduction-to-nestjs-services-2a7c9a629da9",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "4010",
order: 1
}
---

## Service

In enterprise applications, we follow the SOLID principle, where S stands for Single Responsibility.

The controllers are responsible for accepting HTTP requests from the client and providing a response. For providing the response, you may need to connect to some external source for data.

If we add the code to connect to the external source inside, we are not following the single responsibility principle.

To avoid this issue, you use services, which will be responsible for providing some data, which can be reused across the application. It can also hold some validation logic or logic to validate users.

## Creating and Using the Service

There are two types of services that can be created in [NestJS](https://docs.nestjs.com/):

- Class-based Provider
- Non-class-based Provider

Note: If you are coming from Angular, there are high chances you already know these concepts.

## Class-based Provider

To create a class-based provider, we can use the CLI command below, the command will create the service inside the product folder.

```shell
nest generate service product
```

In the product folder, you will find two files:

- `product.service.ts` (For logic.)
- `product.service.spec.ts` (For unit testing.)

You may end up using multiple services for a feature or even multiple types of providers.

## Using a class-based Provider

Now open the `product.service.ts` file and add the below code, we will move some code from `ProductController` to `ProductService`.

```javascript
import { Injectable } from '@nestjs/common';
@Injectable()
export class ProductService {
    products = [
        { id: 1, name: 'One Plus 7', price: 48000 },
        { id: 2, name: 'I Phone X', price: 64999 }
    ];
    getProducts() {
        return this.products;
    }
    addProduct(product:any){
        this.products.push(product);
    }
    getProductById(id:number) {
        return this.products.find(p => p.id === id);
    }
}
```

As the service is ready now, open `product.controller.ts` and make the below changes.

```javascript
import { ProductService } from './product.service';
@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}
    @Get()
    GetProducts() {
        return this.productService.getProducts();
    }
    @Post()
    AddProduct(@Req() req: Request, @Res() res: Response) {
        this.productService.addProduct(req.body);
        // return json data with default status code
        return res.json({ id: req.body.id });
        // to update the status code
        //return res.status(205).json({ id: req.body.id})
    }
    @Get(':id')
    GetProductById(@Param() param: any) {
        return this.productService.getProductById(+param.id);
    }
}
```

The way ProductService is used here is known as [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection).

Like Controllers, Services need to be registered as well, the CLI does this for us, you can do it manually by adding it to the providers array of the module.

```javascript
providers: [AppService, ProductService]
```

There is more about class-based services which we will cover in upcoming articles.

## Non-class-based Providers

We can also create a service that is not a class-based service. There are two types:

- Tokens: We can use string value as the token.
- Factory: Useful when we have a service that needs some data from another service.

## Creating tokens

You can create an injection token to use as service, to do that, create a new file `product.token.ts` inside the product folder and add the below code:

```javascript
export interface Product {
    endPoint: string;
}
export const PRODUCT = 'PRODUCT';
export const Product_Token : Product = {
    endPoint: 'http://localhost:3000/product'
}
```

Now open `app.module.ts` and register the token using the providers property.

```javascript
import { PRODUCT, Product_Token } from './product/product.token';
providers: [
{
    provide : PRODUCT,
    useValue: Product_Token
}]
```

Next, open the `product.service.ts` and let’s use this token and add the below code. This is just for demo purposes, in the real-time application we may want to use this value.

```javascript
import { Injectable, Inject } from '@nestjs/common';
import { PRODUCT, Product } from './product.token';
constructor(@Inject(PRODUCT) product: Product) 
{
    console.log(product.endPoint);
}
```

Once you run the application using the value, `endPoint` will be logged on the console.

## Using factory

Factories are another type of provider and are available for a very special use case.

Generally, when we provide a service, they are resolved when the modules are loaded, but there may be instances where we need to create the instance dynamically, this is where we need factories.

For example, getting the database connection, for a client at runtime deciding which database to connect to.

Run the below commands to create two services:

```shell
nest generate service dbprovider
nest generate service client
```

Add the below code in `client.service.ts`.

```javascript
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientService {

    getClientDetails() {
        return {
            client: 'test',
            db: 'databaseconnection'
        }
    }
}
```

Next, open `dbprovider.service.ts` and add the below code.

```javascript
import { Injectable } from '@nestjs/common';

@Injectable()
export class DbproviderService {

    constructor(private connection: string) { }

    getProductsForClient() {
        return this.connection;
    }
}
```

In `dbprovider.service.ts`, here we are using a string property, if you try to run this application, you will get the error as this is not allowed.

We want to create the instance of `DbproviderService` at runtime, so we need to make one more change. Open `app.module.ts` and remove `DbproviderService` from the `providers` property.

NestJS lets us create the factory, create a new file `connection.provider.ts`, and add the below code.

```javascript
import { ClientService } from "./client/client.service";
import { DbproviderService } from "./dbprovider/dbprovider.service";

export const dbConnectionFactory  = {
    provide: 'ClientConnection',
    useFactory : (clientSerice: ClientService) => {
        return new DbproviderService(clientSerice.getClientDetails().db);
    },
    inject: [ClientService]
}
```

Here we are creating a new instance of `DbproviderService` by getting `db` from `ClientService`. You can use multiple services here, you just need to pass them comma-separated in `useFactory` and the same services need to be added in the `inject` property.

Now we are done with the factory, let’s register and use it. Open `app.module.ts` and add `dbConnectionFactory` in the `providers` property.

Next, open `product.service.ts` and add the below code.

```javascript
constructor(@Inject(PRODUCT) product: Product,
    @Inject('ClientConnection') dbProviderService: DbproviderService){
    console.log(product.endPoint);
    console.log(dbProviderService.getProductsForClient())
}
```

# Conclusion

We learned about how to create and use different types of providers in NestJS, we used the dependency injection design pattern to use services, which lets you achieve single responsibility as well.

The services are singleton, but we can also control the scope of Services, which we will see in the next article.
