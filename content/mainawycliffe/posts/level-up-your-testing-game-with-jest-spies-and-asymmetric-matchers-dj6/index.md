---
{
title: "Level Up Your Testing Game with Jest Spies and Asymmetric Matchers",
published: "2025-05-05T15:27:19Z",
edited: "2025-05-05T15:28:12Z",
tags: ["javascript", "typescript", "testing", "webdev"],
description: "Over my long career as a software engineer, unit testing involving third-party APIS, such as database...",
originalLink: "https://newsletter.unstacked.dev/p/level-up-your-testing-game-with-jest",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Over my long career as a software engineer, unit testing involving third-party APIS, such as database calls, etc., has always proven challenging. And let’s be honest, it’s pretty rare to write an application where all functions are pure, i.e., self-contained, and don’t interact with third-party APIS—a topic I would really like to explore at some point in the future. For more on this and other topics, stay subscribed.

Let’s take the following simple function that gets items from the database - Dynamodb. Using the AWS SDK (v3), this function would look something like this:

```typescript
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export async function getToDo(id: string) {
  const res = await docClient.send(
    new GetCommand({
      TableName: 'Todos',
      Key: {
        id: id,
      },
    }),
  );
  // Avoid assertions, whenever possible
  return res.Item as ExchangeRateDBObject;
}
```

The above function will use the AWS SDK to call the Dynamodb API and retrieve a to-do item with a given ID from the database. As long as you don’t have permission issues, it works.

On the other hand, writing unit tests for it might be tricky, as the test would require access to an actual AWS Account or a local version of Dynamodb, each with its own set of challenges.

There are several ways to handle this, which I won’t go into in this article, but one of my favourites is mocking the Dynamodb SDK (Or any other SDK). The problem I generally find with mocks is that developers do not check whether the mocked function was called correctly.

![](./697b6ff6-a01e-46e8-83d0-021367cc462f_260x470.gif)

### Jest Spies

To give you an example, when we mock out our Document Client above, we not only need to respond with the correct return signature—for instance, in our case, we only care about the Item property—but we also need to ensure that we passed in the correct information to the client.

In our case, the table name and the key must be correct; otherwise, if incorrect, our function would not work in the real world.

This is where Jest Spies come in. **The Jest spy method allows us to monitor the behaviour of other functions without changing the underlying code for the purpose of testing**. With spies, we can observe a few things, such as the times it was called and the parameters or inputs it was called with.

So, for instance, to test the above function, we would need to spy on `docClient` send method, returning the necessary response for our function to use, as shown below:

```typescript
it('Should pass the correct Key to the DB', async () => {
  const spyOnDB = jest.spyOn(docClient, 'send').mockReturnValue({
    Item: mockToDo,
  } as any);

  await getToDo('123');
});
```

Now, if we run the above test, it will succeed using the mock test, as shown below.

But if you recall correctly, we have mocked (using the `jest.spyOn` method) out our SDK call, but we aren’t doing anything to verify that we are calling our SDK correctly, which was one of my gripes with mocks in the first place.

We can now use a number of methods from the Jest matchers, such as `toHaveBeenCalled` and `toHaveBeenCalledWith` to ensure that our SDK/ function we are spying on was called a number of times, once in our case and was with the correct inputs/parameters.

```typescript
expect(spyOnDB).toHaveBeenCalled();
```

The above matcher checks that our SDK was called; it doesn’t check whether it was called once or twice. If we wanted to be specific, Jest provides a different matcher that you can use to ensure the number of calls - `toHaveBeenCalledTimes` method.

```typescript
expect(spyOnDB).toHaveBeenCalledTimes(1);
```

If our SDK is called more than once or not called at all, the test will fail. Neat, right?

![](./f3adce78-0134-452d-8a76-237956b8d2d7_633x394.jpeg)

Next, we can check whether the SDK passed the correct parameters. For that, we will use the `toHaveBeenCalledWith` method to check whether the correct inputs were passed to our AWS SDK.

```typescript
expect(spyOnDB).toHaveBeenCalledWith({
    TableName: 'Todos',
    Key: {
      id: '123',
    },
});
```

Unfortunately, while we care about the above input, the GetCommand class transforms our input and appends some metadata, which we don’t care about for our test, but is still important. Due to that, the above test will fail.

As seen above, our SDK input contains much more information than what we are checking, with the information we need nested somewhere in there. This is where Jest comes to the rescue with another feature—asymmetric Matchers.

### Asymmetric Matchers in Jest

Asymmetric Matchers are magical in Jest, **as they allow us flexibility when matching and asserting results in Jest**, such as partial matching, as we want.

For instance, let’s say we have a random ID generator that’s prefixed, e.g., `user_UUID_STRING`. We could mock out the ID generator function to return a predetermined string—deterministic behaviour is important for testing. Another option is to use asymmetric matchers to check whether the returned ID contains our prefix, as shown below:

```typescript
expect(res).toEqual({
    ...USER_DETAILS,
    // Ensure the id is a string and starts with "user_"
    id: expect.stringContaining("user_"),
    // Or ensure the date is in the correct format
    updatedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
});
```

As you can see, we are ensuring that the ID starts with the user\_ prefix and the updatedAt date is of the correct matchers.

Circling back to our previous example, we now know that we need to ensure that the object passed to our SDK spy contains the following object, as we don’t care about the metadata and other details that the GetCommand appends.

```typescript
{
    input: {
      TableName: 'Todos',
      Key: {
        id: '123',
      },
    },
}
```

Jest provides an asymmetric matcher for just this situation - `expect.objectContaining`. And this will check the results to see whether it contains the object we pass in, instead of strictly checking it, as shown below:

```typescript
expect(spyOnDB).toHaveBeenCalledWith(
    expect.objectContaining({
      input: expect.objectContaining({
        TableName: 'Todos',
        Key: {
          id: '123',
        },
      }),
    }),
);
```

In layman’s terms, we are doing a partial check, and as long as the fields that we specify exist within the results, our test will parse, as shown below:

On top of that, Jest provides a good number of asymmetric matchers that you can use to make your life a little bit easier.

Just keep in mind that you need to ensure you are testing the most critical aspect of your code, and don’t use this as a shortcut by overusing matchers such as `expect.anything` or `expect.any`, which can literally match any string.

You can learn more about Asymmetric Matchers [here](https://jestjs.io/docs/expect#asymmetric-matchers).

## Conclusion

In conclusion, unit testing when dealing with third-party APIS can be challenging, especially when it comes to ensuring that mocks accurately reflect the interactions with the real SDKS.

By leveraging both Jest Spies and Asymmetric Matchers, developers can create more robust, reliable and more effective tests that not only verify the functionality of their own functions but also confirm that the SDKS are being called correctly with the right parameters.

This enhances the reliability of your tests and helps maintain the integrity of your application's behaviour. Remember, while mocking provides a useful abstraction layer, focusing on meaningful assertions that capture the critical aspects of your application when using asymmetric matchers is essential, making sure that critical elements are what they should be while ignoring everything else.

By doing so, you'll be well-equipped to navigate the complexities of unit testing in a world full of dependencies. Happy testing!
