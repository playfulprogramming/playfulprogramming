---
{
    title: "Intro to Formik",
    description: "",
    published: '2025-01-01T22:12:03.284Z',
    tags: ["react", "javascript", "webdev"]
}
---

One of the most common types of front-end applications that I've seen in my career can be classified as some form of "Form wrapper". Whether it's a payment form, a user-submitted tracking form, or anything of the like - these pages exist in almost every app I've ever seen.

What's more, even in less obvious "form wrapper" style pages, you'll always need a way to track a user's input for usage in some kind of processing.

To do this, React has a few tools at its disposal.

We've been working on a files app up to this point in a fairly simplistic manner of getting files listed for the user. However, many modern file apps (such as Dropbox and Google Drive) allow you to share files with others.

Let's create a form that the user can fill out to add a new user to their existing files.

# One-way Form Bindings

One common and easy way to assign a value to form elements - like a text input - is to simply listen for value changes (using events) on the element and assign those changes back to a bound input value.

```jsx
const FormComp = () => {
  const [usersName, setUsersName] = useState("");

  const onChange = (e) => {
    setUsersName(e.target.value);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(usersName);
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" onChange={onChange} value={usersName} />
      <button type="submit">Submit</button>
    </form>
  )
}
```

While this works as-is, it can get complex when too many inputs are present. For each input, you need:

- A function to listen for changes and bind them to the value
- A variable to assign the data to
- Rebind said data back to the input

Let's try to simplify this by removing the first step.

# Reactive Forms

Reactive forms are a way for you to keep all of your form data inside of a single variable when it comes time to submit a form. There are also multiple enhancements to this method, such as data validation and array handling.

Let's take a look at how we can use reactive forms in our frameworks, then touch on the additional features afterward.

Because of React's minimalist API philosophy, React does not have anything equivocal to Angular's reactive forms. Instead, it relies on the ecosystem of libraries to support this functionality.

Luckily, there's a similar tool that's both widely used and highly capable: [Formik](https://formik.org/).

Here's what a basic form might look like in Formik:

```jsx {10-18,20,24-29}
import React from "react";
import { useFormik } from "formik";

const FormComponent = () => {
  /**
   * Formik provides us a hook called "useFormik" which allows us to
   * define the initial values and submitted behavior
   * 
   * This return value is then used to track form events and more
   */
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label>
          Name
          <input
            type="text"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
        </label>
      </div>
      <div>
        <label>
          Email
          <input
            type="text"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.favoriteFood}
          />
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
```

### `<Formik/>` Component 

The `useFormik` hook isn't the only way to declare a form, however. Formik also provides a set of components that can then be used in place of a hook.

```jsx {5-14}
import React from "react";
import { Formik } from "formik";

const FormComponent = () => {
  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
      }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values, handleChange, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Name
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={values.name}
              />
            </label>
          </div>
          <div>
            <label>
              Email
              <input
                type="text"
                name="email"
                onChange={handleChange}
                value={values.favoriteFood}
              />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </Formik>
  );
};
```

This component isn't just useful as an alternative API, however. It also enabled us to use functionality like Formik's built-in `Form` and `Field` components, which allows us to remove the `onSubmit` and `onChange` method passing for a more terse API.

```jsx {12,16,22,26}
const FormComponent = () => {
  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
      }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values, handleChange, handleSubmit }) => (
        <Form>
          <div>
            <label>
              Name
              <Field type="text" name="name" />
            </label>
          </div>
          <div>
            <label>
              Email
              <Field type="text" name="email" />
            </label>
          </div>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};
```

> Keep in mind that the `Field` and `Form` components will not work when using `useFormik`. This is because of underlying implementation details that [rely on React's Dependency Injection (which we'll touch on in a future chapter)](// TODO: Add link). Instead, you'd have to pass `onChange` and `onSubmit`, respectively, to `input` and `form` HTML elements, as we demonstrated before.

> We are currently using version 2 of Formik. Inevitably, its API will change, and this section will be out-of-date, but the core concepts at play likely will not change very much.

## Input States {#input-states}

As we mentioned earlier, reactive forms have more features than the simple two-way (or even one-way) input binding!

One feature that's added with reactive forms is the concept of an input's state. An input can have many different states:

- "Touched" - When the user has interacted with a given field, even if they haven't input anything
  - Clicking on the input
  - Tabbing through an input
  - Typing data into input
- "Pristine" - The user has not yet input data into the field
  - Comes before "touching" said field if the user has not interacted with it in any way
  - Comes between "touched" and "dirty" when the user has "touched" the field but has not put data in
- "Dirty"  - When the user has input data into the field
  - Comes after "touching" said field
  - Opposite of "pristine"
- "Disabled" - Inputs that the user should not be able to add values into

While some of these states are mutually exclusive, an input may have more than one of these states active at a time. For example, a field that the user has typed into has both "dirty" and "touched" states applied at the same time.

These states can then be used to apply different styling or logic to each of the input's associated elements. For example, a field that is `required && touched && pristine`, meaning that the user has clicked on the field, not input data into the field, but the field requires a user's input. In this instance, an implementation might show a `"This field is required"` error message.

> The method of displaying this error message is part of a much larger discussion of [field validation, which we'll touch on in a different section in this chapter](#form-validation).

In addition to the form's fields having these possible states applied, many of them apply to the `form` itself.

For example, when the user "touches" a field for the first time, they're also "touching" the form itself. You can use this information to do something like:

```javascript
// This is pseudocode and likely won't work with any framework unconfigured
if (!form.touched) {
	alert("You must put data into the form first!")
    return;
}
```

In addition to the existing field states, a form may also contain the following states:

- "Submitted" - When the user has submitted a form
- "Pending" - When a user has submitted a form while the form is currently doing something
  - Comes after the "submitted" state
  - Submitting data to the server

Here's an interactive playground that you can use to play around with each of the different input states.


Formik only provides the states for:

- Touched fields
- Dirty forms
- Submitted forms

And allows you to construct the rest from it

```jsx
const FormComponent = () => {
  const [isPending, setIsPending] = useState(false);
  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
      }}
      onSubmit={(values) => {
        setIsPending(true);
        sendToServer(values).then(() => setIsPending(false));
      }}
    >
      {({ touched, dirty, isSubmitting }) => (
        <Form>
          <div>
            <label>
              Name
              <Field type="text" name="name" />
            </label>
            {touched.name && <p>This field has been touched</p>}
            {!touched.name && <p>This field has not been touched</p>}
          </div>
          <div>
            <label>
              Disabled Field
              <Field type="text" name="email" disabled />
            </label>
          </div>
          {/* Formik doesn't provide "dirty" on a field-level basis */}
          {dirty && <p>This form is dirty</p>}
          {!dirty && <p>This form is pristine</p>}
          {isSubmitting && <p>Form is submitted</p>}
          {isPending && <p>Form is pending</p>}
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

// Pretend this is calling to a server
function sendToServer(formData) {
  // Wait 4 seconds, then resolve promise
  return new Promise((resolve) => setTimeout(() => resolve(), 4000));
}
```

Additional to form states, a reactive form also adds the following features into a form: 

- Form groups - A collection of fields (or sub-fields) that create a grouping
- [Form arrays](#form-arrays) - A collection of fields in a list
- [Validation - making sure an input's value aligns with a set of rules.](#form-validation)
	- "Is input a valid email"
	- Required fits into this category

Let's start by taking a look at form arrays.

# Form Arrays {#form-arrays}

The example we set off to build at the start of the chapter was a method of sharing a file with a selection of users. 

While we've built a primitive version of this that allows us to share a file with a single user, let's expand that behavior to allow us to share a file with any number of users.

To do this, we'll need to rely on the ability to add in an array of a form.

Formik provides a `FieldArray` to help make handling arrays easier with Formik fields. Similar to Formik's `Field` and `Form` components, `FieldArray` only works when using the `Formik` component instead of the `useFormik` hook.

```jsx
import { Formik, Form, Field, FieldArray } from "formik";

// We'll explain why we need an id a bit later
let id = 0;

export const FriendList = () => (
  <div>
    <h1>Friend List</h1>
    <Formik
      initialValues={{ users: [{name: "", id: ++id}] }}
      onSubmit={(values) => console.log(values)}
     >
       {({ values }) => (
        <Form>
          <FieldArray
            name="users"
            render={(arrayHelpers) => (
              <div>
                {values.users.map((user, index) => (
                  <div key={index}>
                    <label>
                      Name
                      <Field name={`users.${index}.name`} />
                    </label>
                    <button
                      type="button"
                      onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                    >
                      Remove User
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => arrayHelpers.push({ name: "", id: ++id })}
                >
                  Add user
                </button>
                <button type="submit">Submit</button>
              </div>
            )}
          />
        </Form>
      )}
    </Formik>
  </div>
);
```

> You may notice that we're using `arrayHelpers.push` and `arrayHelpers.remove` instead of simply doing `values.push`. This is because if we do a `values.push` command, it won't trigger a re-render. We'll learn more about why this is and what the alternatives tend to be [in the chapter exploring React's internals](// TODO: Add link).

Because we're now using an array, we need a unique ID for each user. This is why, for each implementation, there's an `id` field. We then use this `id` field to identify which user is which to the framework, [just like we've done before for loops in HTML](/posts/dynamic-html).



# Form Validation {#form-validation}

After adding in form arrays to your share dialog, you sit down, ready to work on the next task. Suddenly, an email slides in from your issues tracker: Dang it - you missed a requirement.

Namely, we need to make sure that the user has actually typed in the user's name before moving forward.

Let's see if we can't mark the name field as "required" and show an error when the user tries to submit a form without inputting a name.

> To focus on form validation, let's temporarily remove the array requirement and limit our scope just to the form validation.

Formik allows you to pass a function to the `Field` component in order to `validate` the data input. Here, we can simply check if `value` is present or not. Then, we can check against the `Formik` component's `errors` field to see if the `name` field has any errors. 

```jsx
import { Formik, Form, Field } from 'formik';

function requiredField(value) {
  let error;
  if (!value) {
    error = 'Required';
  }
  return error;
}

const FormComp = () => {
  return (
    <Formik initialValues={{ name: '' }} onSubmit={(val) => console.log(val)}>
      {({ errors, touched }) => (
        <Form>
          <div>
            <Field name="name" validate={requiredField} />
          </div>
          {errors.name && errors.touched && <div>{errors.name}</div>}
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};
```

### Complex Data Schema

Formik's `validate` function passing works quite well for basic usage. That said, let's introduce a better way to do form validation that scales a little better when dealing with more complex data.

There are multiple different libraries that will integrate with Formik to add dedicated complex validation functionality. [`yup` is one such library](https://github.com/jquense/yup).

By using `yup`, you're able to replace our home-grown function with something as simple as `yup.string().required()` to mark the field as required.

Yup works by introducing the concept of a "schema" into form validation. You start by declaring a schema that's then validated against using the `validationSchema` in the `Formik` component.

```jsx
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

const FormSchema = yup.object().shape({
  name: yup.string().required(),
});

const FormComponent = () => {
  return (
    <Formik
      initialValues={{
        name: '',
      }}
      validationSchema={FormSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ errors }) => (
        <Form>
          <div>
            <label>
              Name
              <Field type="text" name="name" />
            </label>
            {errors.name && <p>{errors.name}</p>}
          </div>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};
```

While Yup will generate an error message based on the expected and received data types, we're also able to customize the error message ourselves:

```javascript
const FormSchema = yup.object().shape({
  name: yup.string().required("You must input a name of the user to share with."),
});
```

One concept that's introduced with form validation -- especially forms with groups -- is the idea of an object's "shape". You can think of this as the "type" of information an object might contain. For example:

```javascript
const obj1 = {name: "Corbin", id: 2}
const obj2 = {name: "Kevin", id: 3}
```

Would be considered to have the same "shape" since they contain the same keys, and each of the keys contains the same type of value. However, the following objects would have divergent shapes due to differing keys:


```javascript
const obj3 = {name: "Corbin", favFood: "Ice Cream"}
const obj4 = {name: "Kevin", id: 3}
```

Likewise, another concept that's introduced here is the concept of a "schema". A schema is simply a blueprint for how data should be represented.

A schema defines what an object's shape and input values _should_ look like, as opposed to what the user may input.


## Validation Types

Marking a field as required is far from the only type of form validation. While there are any number of items, there

- Minimum string length
- Maximum string length
- Two inputs match each other
- Match a regex

Here's a playground where we demonstrate a form that validates all of those examples:

```jsx
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

const FormSchema = yup.object().shape({
  minLenStr: yup.string().min(3),
  maxLenStr: yup.string().max(3),
  regex: yup.string().matches(/hello|hi/i),
  pass: yup.string(),
  confirm: yup
    .string()
    .oneOf([yup.ref('pass'), null], 'Must match "password" field value'),
});

const FormComponent = () => {
  return (
    <Formik
      initialValues={{
        name: '',
      }}
      validationSchema={FormSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ errors }) => (
        <Form>
          <div>
            <label>
              Minimum Length String (3)
              <Field type="text" name="minLenStr" />
            </label>
            {errors.minLenStr && <p>{errors.minLenStr}</p>}
          </div>
          <div>
            <label>
              Maximum Length String (3)
              <Field type="text" name="maxLenStr" />
            </label>
            {errors.maxLenStr && <p>{errors.maxLenStr}</p>}
          </div>
          <div>
            <label>
              Regex
              <Field type="text" name="regex" />
            </label>
            {errors.regex && <p>{errors.regex}</p>}
          </div>
          <div>
            <label>
              Password
              <Field type="password" name="pass" />
            </label>
          </div>
          <div>
            <label>
              Password Confirm
              <Field type="password" name="confirm" />
            </label>
            {errors.confirm && <p>{errors.confirm}</p>}
          </div>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};
```

# Non-Text Form Fields

Not all fields in a form are going to be text inputs, however. You might want to introduce a checkbox to the user to make sure they've accepted terms and conditions, have a dropdown of time zones, or have a date picker for the user to input a time.

Just like text inputs, you can combine these input types with validation!

While there are many other types of user input elements, let's focus on just one: Checkboxes.

Formik allows you to easily cast a `Field` component to a different `type` to display a different base input UI. This is the same as how the `input` element works.

```jsx
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

const FormSchema = yup.object().shape({
  termsAndConditions: yup
    .bool()
    .oneOf([true], 'You need to accept the terms and conditions'),
});

const FormComponent = () => {
  return (
    <Formik
      initialValues={{
        termsAndConditions: false,
      }}
      validationSchema={FormSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ errors }) => (
        <Form>
          <div>
            <label>
              Terms and conditions
              <Field type="checkbox" name="termsAndConditions" />
            </label>
            {errors.termsAndConditions && <p>{errors.termsAndConditions}</p>}
          </div>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};
```

Something worth mentioning in terms of validation is how Formik integrates with Yup; we can't simply mark our `termsAndConditions` field as `required`. Instead, we have to tell `yup` that it has to be `oneOf([true])` to enforce the checkbox to be `true`.
