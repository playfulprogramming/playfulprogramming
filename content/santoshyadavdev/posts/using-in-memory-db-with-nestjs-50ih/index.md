---
{
title: "Using in-memory-db With NestJS",
published: "2020-01-14T18:20:24Z",
edited: "2021-04-06T11:07:46Z",
tags: ["typescript", "javascript", "webdev", "node"],
description: "Let’s see why we should and how we can use in-memory-db, you can access the source code on GitHub....",
originalLink: "https://medium.com/better-programming/using-in-memory-db-with-nestjs-803a91a8eb11",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "20daysofNestJS",
order: 5
}
---

Let’s see why we should and how we can use in-memory-db, you can access the source code on [GitHub](https://github.com/santoshyadav198613/nest-in-memory-demo).

# Why

Below are two scenarios where you may need in-memory-db.

- POC (Proof of Concept): When you need to create a quick POC for an upcoming project and you want to create an API with NestJS, for integration with a UI.
- Mock: You need to write the test cases and you want to mock the DB operations. This is the perfect use case for using in-memory-db.

# How

Follow the below steps to create an API with in-memory-db.

- Run the below command to create a NestJS project.

```shell
nest new in-memory-demo
```

- We will create a `ProductController` with CRUD operations, so we will add a module and controller for the same.

```shell
nest generate module product
nest generate controller product
```

- Next, we need an entity. Create a new folder `entities` inside the `product` folder.

- Create a new file `product.entity.ts` and add the below code.

```javascript
import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export interface ProductEntity extends InMemoryDBEntity {
    name: string;
    price: number;
    seller: string;
    discount: number;
}
```

- In the above code, `InMemoryDBEntity` adds an `id` property to any interface that extends this interface.

- Next, we need to add some code to the controller and the module. There are two ways in which you can perform CRUD operations, by providing your own implementation or using the built-in `InMemoryDBEntityAsyncController` or `InMemoryDBEntityController`.

We will see both approaches, let’s see how to implement our own.

- Open `app.controller.ts` and add the below code, this file already exists.

```javascript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { ProductEntity } from './product/entities/product.entity';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private productService: InMemoryDBService<ProductEntity>) {}
  
  @Post()
  AddProduct(@Body() product: ProductEntity): ProductEntity {
    return this.productService.create(product);
  }

}
```

You can see in the above code that we have added the below code to provide the `Post` method.

```javascript
@Post()
AddProduct(@Body() product: ProductEntity): ProductEntity 
{
    return this.productService.create(product);
}
```

- The `ProductService` is instantiated from `InMemoryDBService`. It comes with many built-in methods to perform CRUD operations, without writing a single line of code. The service contains two types of methods, `sync` and `async` which return an `observable`.

- In the above code, the below-highlighted code is needed to create an instance of service which takes the entity `ProductEntity` and provides all methods.

```javascript
constructor(private readonly appService: AppService,
private productService: InMemoryDBService<ProductEntity>) {}
```

The methods that we are going to implement are:

- `getAll()`: Retrieve all records.
- `create()`: Insert new records. Use `createMany` to insert multiple records.
- `update()`: Update the record for the provided `id` in the request body.
- `delete()`: Delete the record for the provided `id`.
- `query()`: Query the data from the records added.

Below is the complete code:

```javascript
import { Controller, Get, Post, Body, Put, Delete, Param } from '@nestjs/common';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { ProductEntity } from './product/entities/product.entity';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private productService: InMemoryDBService<ProductEntity>) {
  }

  @Get()
  getProducts() {
    return this.productService.getAll();
  }

  @Post()
  AddProduct(@Body() product: ProductEntity) {
    return this.productService.create(product);
  }

  @Put()
  EditProduct(@Body() product: ProductEntity) {
    return this.productService.update(product);
  }

  @Delete(':id')
  DeleteProduct(@Param('id') id: number) {
    return this.productService.delete(+id)
  }

  @Get(':id')
  GetProductById(@Param('id') id: number) {
    return this.productService.query(data => data.id === +id)
  }

}
```

Now, in most cases, you just want to provide CRUD operations and if we keep adding the same code, it will cause code duplication and the package keeps that in mind.

It has `InMemoryDBEntityAsyncController` or `InMemoryDBEntityController` to achieve the same.

- To implement CRUD operations using the above interface, you can just add the below lines of code.

```javascript
import { Controller } from '@nestjs/common';
import { InMemoryDBService, InMemoryDBEntityAsyncController } from '@nestjs-addons/in-memory-db';
import { ProductEntity } from './entities/product.entity';

@Controller('product')
export class ProductController extends InMemoryDBEntityAsyncController<ProductEntity> {
    constructor(private productService: InMemoryDBService<ProductEntity>) {
        super(productService);
    }

}
```

The `InMemoryDBEntityAsyncController` provides the implementation for the below methods by default.

- `create`
- `update`
- `updateMany`
- `delete`
- `deleteMany`
- `get`
- `getMany`

# For Feature Modules

In case you have a different feature module, you need to use the `forFeature` method to register `InMemoryDBModule`. The below code gives an example of how to use it for `ProductModule`.

```javascript
import { Module } from '@nestjs/common';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { ProductController } from './product.controller';

@Module({
    imports: [InMemoryDBModule.forFeature('product')],
    controllers: [ProductController]
})
export class ProductModule {

}
```

You can also use the feature-specific instances of InMemoryDBService. You need to use the below code in the constructor.

```javascript
constructor(@InjectInMemoryDBService('product') private productService: InMemoryDBService<ProductEntity>)
```

## Seeding Test Data

For testing, you may need to create some dummy data and we don’t expect you to create all records manually, this is where you can use seed method to create dummy data.

- Create a new Module, Controller, and Entity by using the below command.

```shell
nest generate module employee
nest generate controller employee
```

- Next, add a new `entities` folder in the employee folder and add a new file `employee.ts` and add the below code.

```javascript
import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export interface EmployeeEntity extends InMemoryDBEntity {
    name: string;
    email: string;
    department: string;
    age: number;
}
```

- Next, register the `InMemoryDBModule` for employee Module, add the below code in `employee.module.ts`

```javascript
import { Module } from '@nestjs/common';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { EmployeeController } from './employee.controller';

@Module({
  imports: [InMemoryDBModule.forFeature('employee')],
  controllers: [EmployeeController]
})
export class EmployeeModule {

}
```

- Final Step is to use `seed` method to create 10 dummy records.

```javascript
import { Controller, Get, Param } from '@nestjs/common';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { EmployeeEntity } from './entities/employee';

@Controller('employee')
export class EmployeeController {
    constructor(private employeeService: InMemoryDBService<EmployeeEntity>) {

    }

    @Get('seed')
    GetEmployee() {
        const recordFactory = (idx: number): Partial<EmployeeEntity> => ({
            id: idx, email: `test${idx}@test.com`, age: 10, department: 'Marketing', name: `Test${idx}`
        });

        this.employeeService.seed(recordFactory, 10);
        return this.employeeService.getAll();
    }

    @Get(':id')
    GetEmployeeByID(@Param('id') id: number) {
        return this.employeeService.get(+id);
    }

}
```

Next, trigger the seed method by accessing the http://localhost:3000/employee/seed which will create 10 records.

You can update the count, in the below method to create more records.

```javascript
this.employeeService.seed(recordFactory, 10);
```

You can use `postman` to test out the APIs. In the next article, we will see how we can add swagger capabilities to create a test page for testing.

You can refer to the code for this demo at:

> https://github.com/santoshyadav198613/nest-in-memory-demo

# Conclusion

`in-memory-db` is widely used in other frameworks like .Net, Java, and Angular to create POCs or create a mock back end.

This package brings the same capability to the NestJS ecosystem and you can easily plugin the same with existing NestJS projects to create POCs.

Thanks to [Wes Grimes](https://dev.to/wesgrimes) and the team for creating this package.
