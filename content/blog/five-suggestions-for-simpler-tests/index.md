---
{
  title: "Write Simpler Tests - 5 Suggestions for Better Tests",
  description: "Writing tests is a big skill for any engineer, but we often over-complicate them. Let's simplify our tests for better testing overall!",
  published: '2020-05-26T05:12:03.284Z',
  authors: ['crutchcorn', 'skatcat31'],
  tags: ['testing', 'jest'],
  attached: [],
  license: 'cc-by-nc-sa-4'
}
---

Writing tests is a part of programming and the skills that allow for good test writing are deviant from the typical programming skillset. This isn't to say that programming and writing tests are entirely separated from one another, but that writing tests requires a different mindset when approaching them. One of the primary differences between most programming and writing tests is that it tends to benefit your application by writing simpler tests.

We’ve collected five methods for simplifying your tests while making them easier to write, understand, and debug.

You may notice that our code samples use various libraries from [the Testing Library suite of libraries](https://testing-library.com/). This is because we feel that these testing methodologies mesh well with the user-centric testing that the library encourages.

> Keep in mind that Jest (and furthermore, Testing Library) is not exclusive to
> any specific framework or toolset. This article is meant just as general advice for testing.
>
> That said if you're looking to include Jest and Testing Library into your Angular app,
> but don't know where to start, [we wrote a guide on how to do just that](/posts/writing-better-angular-tests/)

# Don't Include Application Logic in Tests {#dont-include-logic}

I'd like to make a confession: I love metaprogramming. Whether it's typings, complex libraries, babel plugins, it's all joyous for me to write.

The problem that I face is that I find it's often not joyous for others to read (or debug, for that matter). This is especially pronounced in my testing: when I don't keep things simple my tests tend to suffer.

To demonstrate this point, let's use an example component: A table component. This component should have the following functionality:

- Optional pagination
- When pagination is disabled, list all items
- Display a row of various sets of data

We could use a `for` loop to make sure that each row contains each set of data. This would keep our logic somewhat centralized and able to be quickly customized:

```javascript
import { screen, getByText } from '@testing-library/dom';
import moment from 'moment';

const rows = [{
	// ... A collection of objects that contains a name, phone number, and date of birth
}]

  rows.forEach((row, index) => {
      const domRow = screen.getByTestId(`row-${index}`);
      expect(getByText(domRow,row.name)).toBeInTheDocument();
      expect(getByText(domRow, moment(row.dob).format(formatDate))).toBeInTheDocument();
      expect(getByText(domRow, row.phone)).toBeInTheDocument();
    });
```

While this code is relatively easy to read through, it's not immediately clear what content we're looking to see on-screen.

For example, how many items am I expecting to be rendered?

I would much rather see the following code instead:

```javascript
const person1 = row[0];
const person2 = row[1];
const person3 = row[2];

expect(screen.getByText(person1.name)).toBeInTheDocument();
expect(screen.getByText(moment(person1.dob).format(formatDate))).toBeInTheDocument();
expect(screen.getByText(person1.phone)).toBeInTheDocument();

expect(screen.getByText(person2.name)).toBeInTheDocument();
expect(screen.getByText(moment(person2.dob).format(formatDate))).toBeInTheDocument();
expect(screen.getByText(person2.phone)).toBeInTheDocument();

expect(screen.getByText(person3.name)).toBeInTheDocument();
expect(screen.getByText(moment(person3.dob).format(formatDate))).toBeInTheDocument();
expect(screen.getByText(person3.phone)).toBeInTheDocument();
```

This code is much more repetitive, and it's not the perfect code example (we'll continue to make it more and more readable and simple as we go through the article), but it reflects some of the simplicity we're looking for. It more immediately tells us what screen is being requested to be read, how many times we're looking for people's text, and so much more.

When bringing up this point to a coworker, they reminded me of the expression "Write code for your audience." In this case, your audience is Junior developers on your team working on debugging why a test is failing, QA engineers who might not be familiar with your programming language, and yourself when in the middle of deploying something integral to production when your tests unexpectedly fail. Each of these scenarios directly benefits from simpler, easier to parse, less utility-driven tests.

Furthermore, there's another advantage to writing code simpler: Error messages. When using `for` loops, when an error is thrown, it's not known what piece of data is not rendering. You only know that _something_ isn't being rendered, but not what data, in particular, is missing. If I dropped the third row in its entirety, the error message in the `for` loop will not indicate what row was throwing the error. However, removing them from the for loop, it will immediately be clear which row, in particular, is throwing the error.

# Hardcode Your Testing Data {#hardcode-data}

While we started our example previously by removing for loops, this can be difficult to do without doing this step first. Hard-coding data is one of the most important things you can do to simplify your tests and reduce potential errors in your tests.

Let's take the following code that was used to generate data:

```javascript
const faker = require('faker');

const generatePerson = () => ({
  name: faker.name.findName(),
  dob: faker.date.past(),
  phone: faker.phone.phoneNumber(),
});

// Generate an array of 20 random people
const data = Array.from({length: 20}, () => generatePerson());
```

While this enables us to quickly change how many people's random data is generated, it makes our tests much harder to read. Let's take a look at two parts of code, and see which one is easier to read:

```javascript
const person1 = row[0];

expect(screen.getByText(person1.name)).toBeInTheDocument();
expect(screen.getByText(moment(person1.dob).format(formatDate))).toBeInTheDocument();
expect(screen.getByText(person1.phone)).toBeInTheDocument();
```

Now, is the above code easier to read, or would you prefer reading this?

```javascript
expect(screen.getByText('Jadyn Larson')).toBeInTheDocument();
expect(screen.getByText('2020/01/14')).toBeInTheDocument();
expect(screen.getByText('964.170.7677')).toBeInTheDocument();
```

The second test has some other advantages that might not seem immediately clear. For one, not only is it readable and more debuggable exactly _what_ isn't showing on the screen, but when you remove your code one step further away from implementation, it might highlight bugs with said implementation. For example, you notice that we were using `moment` in the first code sample. Since we're hardcoding data in the second code sample, if there's a bug in how we display our dates, then it'll be picked up whereas it might not be found when using `moment`.

This leads to another rationale for hardcoding data and simplifying tests in general: Debugging code sucks, debugging testing code doubly so. When you hardcode data, the worst a bug can get is a mistyped string. When not using hardcoded data, there could be any number of bugs in the implementation of the runtime randomization.

So, the question remains, how do you generate large quantities of random data without manually writing them in?

Well, you're able to do them programmatically just as you did before. You just want to do so once on your local development machine and commit it as its own file. For example, if you save the following file to a JS file:

```javascript
 const faker = require('faker')
 const fs = require('fs')

 const generatePerson = () => ({
  name: faker.name.findName(),
  dob: faker.date.past(),
  phone: faker.phone.phoneNumber(),
});

const data = Array.from({length: 20}, () => generatePerson());

const rows = JSON.stringify(genRows(20), null, 2)

fs.writeFileSync('mock_data.js', `module.exports = ${rows}`);
```

You can then run `const mockData = require('./mock_data.js')` inside of your test file. Now, you should be able to hardcode your data, knowing what the first, second, and third index are.

# Keep Tests Focused {#seperate-tests}

While working on tests, it can be easy to group together actions into a single test. For example, let's say we want to test our table component for the following behaviors:

Shows all of the column data on users
Make sure a user on page 2 does not show when looking at page one

We could easily combine these two actions into a single `it` test:

```javascript
it('should render content properly', () => {
	// Expect page 1 person to be on screen
	expect(screen.getByText('Jadyn Larson')).toBeInTheDocument();
	expect(screen.getByText('2020/01/14')).toBeInTheDocument();
	expect(screen.getByText('964.170.7677')).toBeInTheDocument();

	// Expect page 2 person not to be on screen
	expect(screen.getByText(Joe Hardell)).not.toBeInTheDocument();
	expect(screen.getByText('2010/03/10')).not.toBeInTheDocument();
	expect(screen.getByText('783.879.9253')).not.toBeInTheDocument();
})
```

However, when you look at your failing tests, the message that's displayed is vague and harder to debug. Furthermore, it clutters your tests and makes your intentions less clear.

I would alternatively suggest separating them out and displaying them as two separate tests:

```javascript
it('should render all columns of data', () => {
	expect(screen.getByText('Jadyn Larson')).toBeInTheDocument();
	expect(screen.getByText('2020/01/14')).toBeInTheDocument();
	expect(screen.getByText('964.170.7677')).toBeInTheDocument();
})

it('should not render people from page 2 when page 1 is focused', () => {
	expect(screen.getByText(Joe Hardell)).not.toBeInTheDocument();
	expect(screen.getByText('2010/03/10')).not.toBeInTheDocument();
	expect(screen.getByText('783.879.9253')).not.toBeInTheDocument();
})
```

While this may cause slower tests as a result of duplicating the `render` function's actions, it's worth mentioning that most of these tests should run in milliseconds, making the extended time minimally impact you.

Even further, I would argue that the extended time is worth the offset of having clearer, more scope restricted tests. These tests will assist with debugging and maintainability of your tests.

# Don't Duplicate What You're Testing  {#dont-duplicate}

There's yet another advantage of keeping your tests separated by `it` blocks that I haven't mentioned yet: It frees you to reduce the amount of logic you include in the next test. Let's take the code example from before:

```javascript
it('should render all columns of data', () => {
	expect(screen.getByText('Jadyn Larson')).toBeInTheDocument();
	expect(screen.getByText('2020/01/14')).toBeInTheDocument();
	expect(screen.getByText('964.170.7677')).toBeInTheDocument();
})

it('should not render people from page 2 when page 1 is focused', () => {
	expect(screen.getByText(Joe Hardell)).not.toBeInTheDocument();
	expect(screen.getByText('2010/03/10')).not.toBeInTheDocument();
	expect(screen.getByText('783.879.9253')).not.toBeInTheDocument();
})
```

While this test seems reasonable at first, I would prose that the tests contain duplicated testing logic: We already know that the table should render all of the contents on-screen, why do we need to double-check that _all_ of the items in the table are hidden?

This might be a bad example. Maybe you want to demonstrate that all of your columns are un-rendering properly. Fair enough! Let's take a look at another example.

Let's say that I want to make sure that when my table has pagination disabled that we want to see every single person in the table. We could write our tests one of two ways:

```javascript
it('should render all columns of data', () => {
	expect(screen.getByText('Jadyn Larson')).toBeInTheDocument();
	expect(screen.getByText('2020/01/14')).toBeInTheDocument();
	expect(screen.getByText('964.170.7677')).toBeInTheDocument();
})

it('should render all of the users', () => {
	expect(screen.getByText('Jadyn Larson')).toBeInTheDocument();
	expect(screen.getByText('2020/01/14')).toBeInTheDocument();
	expect(screen.getByText('964.170.7677')).toBeInTheDocument();

	expect(screen.getByText(Joe Hardell)).toBeInTheDocument();
	expect(screen.getByText('2010/03/10')).toBeInTheDocument();
	expect(screen.getByText('783.879.9253')).toBeInTheDocument();
})
```

Or, we could write our test like this:

```javascript
it('should render all columns of data', () => {
	expect(screen.getByText('Jadyn Larson')).toBeInTheDocument();
	expect(screen.getByText('2020/01/14')).toBeInTheDocument();
	expect(screen.getByText('964.170.7677')).toBeInTheDocument();
})

it('should render all of the users', () => {
	// Expect the first person to render
	expect(screen.getByText('Jadyn Larson')).toBeInTheDocument();

	// Expect the last person to render
	expect(screen.getByText(Joe Hardell)).toBeInTheDocument();
})
```

In this example, I would prefer the second test. It's closer to how I would manually check if all of the data was rendered, and it reduces the size of my tests. We already know that the columns are all being rendered, why not trust your first test and separate what logic you're testing for the next test? This makes debugging easier as well. If your phone number column isn't rendering, it will only fail one test, not two. This makes it easier to pinpoint what's gone wrong and how to fix it.

Ultimately, when writing tests, a good rule to follow is "They should read like simple instructions that can be run, tested, and understood by a person with no technical knowledge"

# Don’t Include Network Logic in Your Render Tests  {#seperate-network-logic}

Let's say in a component we want to include some logic to implement some social features. We’ll follow all the best practices and have a wonderful looking app with GraphQL using ApolloGraphQL as our integration layer so we don’t need to import a bunch of APIs and can hide them behind our server. Now we’re writing out tests and we have a _ton_ of mocked network data services and mock providers. Why do we need all of this for our render?

```javascript
// ConnectedComponent.spec.tsx
it("renders", async () => {
  const { findByText, getByText } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Component />
    </MockedProvider>
  );

  expect(getByText("Loading component...")).toBeInTheDocument();
  waitForElement(() => expect(getByText(“Element”)).toBeInTheDocument());
  expect(getByText("FirstName")).toBeInTheDocument();
});
```

We have a `MockedProvider`, `mocks`, extra logic for loading states, and then finally what our tests really care about with how things get rendered to the screen. We’ve taken our wonderful, strong tests and made them fragile and dependent on this specific implementation. How do we make it so that if we swap out our data layer we can make sure our tests and components will still work just fine with minimal updates?

Thankfully the answer to that is pretty easy. Taking a cursory glance at our component we see a data layer and some logic for the data layer.

```javascript
// ConnectedComponent.tsx
export default () => {
  const { data } = userQueryHook();
  const { user } = data?.user; 
  
  return !user
    ? <span>Loading component…</span>
    : <><span>Element</span><span>{user.first}</span></>
```

Here the component will mount into the DOM and then go and fetch some user data to store in the state. This isn’t necessarily a bad thing. It does mean that the tests would need a way to test the component and the network layer logic.

We don’t want our tests doing that as now our component and the test is directly tied into how the exact component was implemented and is closer to an integration test instead of a unit test in regards to what we render. Instead, we need to remove that logic so that the component can just render. We can do this in several ways, but the easiest and fastest method with a simple component like this one is to extract the data fetch to a layer higher and simply receive the data as a prop.

```javascript
// ConnectedComponentRender.tsx
export default ({ user }:{ user: UserType }) => {
  return !user
    ? <span>Loading component…</span>
    : <><span>Element</span><span>{user.first}</span></>
}
```

```javascript
// ConnectedComponent.tsx
export default () => {
  const { data } = userQueryHook();
  const { user } = data?.user; 

  return <ConnectedComponentRender user={ user } />
}
```

Now the tests for the rendered component look much simpler

```javascript
// ConnectedComponent.spec.tsx
it("renders without data", async () => {
  const { findByText, getByText } = render(<ConnectedComponentRender />);

  expect(getByText("Loading component...")).toBeInTheDocument();
});

it("renders with data", async () => {
  const { findByText, getByText } = render(<ConnectedComponentRender user={ first: ‘FirstName’ } />);

  expect(getByText(“Element”)).toBeInTheDocument();
  expect(getByText("FirstName")).toBeInTheDocument();
});
```

The tests get drastically simplified and we can write tests with mocks for our specific network layer logic separately in the integration tests.

When using large amounts of network data that you'd like to mock, be sure to [hardcode that data using mock files](#hardcode-data).

# Conclusion {#conclusion}

Using these methods, tests can be simplified, often made faster, and typically shorten the length of a testing file. While this may sound straightforward on a surface level, writing tests is a skill that's grown like any other. Practice encourages growth, so don't be discouraged if your tests aren't as straightforward as you'd like to first.

If you have any questions about testing, or maybe have a test you're unsure how to simplify, be sure to join [our Discord Server](https://discord.gg/FMcvc6T). We engage in tons of engineering discussions there and even live pair-program solutions when able.
