---
{
	title: "The Form Club",
	description: "",
	published: '2026-01-01T05:12:03.284Z',
	tags: ['webdev', 'javascript'],
	license: 'cc-by-nc-sa-4'
}
---

Welcome to The Form Club! Only the most exclusive club for the most exclusive people, now accepting applicants. 

Wondering what it is? It's simple - become a master of developing the best darned forms on the internet.

Wanna know how to join? Lean in and we'll tell you the secret: _just read this post and you'll be well on your way_.

See, the club? We're comprised of your favorite form library authors. From [React Hook Form](https://www.react-hook-form.com/)
to [FormKit](https://formkit.com/), [TanStack Form](https://tanstack.com/form) to TODO: INSERT_ADDITIONAL_FORM_LIBRARIES_HERE.

What're we gonna teach you? Everything.

// TODO: Outline contents here

# Different form elements

- Text derivatives
  - Numbers 
    - `type="number"`
    - `e.target.valueAsNumber`
  - Password
  - Textarea
    - Content editable
    - `setSelectionRange()`
- Dates
  - `type="date"`
  - `type="time"`
  - `type="week` and `type="month"` and how they're not supported in Firefox
  - `e.target.valueAsDate`
- Select
- Checkbox
  - Indeterminate state
- Radio
- Range
- Color
- File
  - `multiple`
  - `accept` limitations
  - `capture` for mobile: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/capture

## Behavior Hints

Important for autocomplete and keyboard behavior customization

- `autocomplete`: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
- `autocapitalize`: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize

- `type="email"` - Changes keyboards on mobile to have `@` and `.com`, et al
- `type="search"`
- `type="tel"`
- `type="url"`

# Styling

- Labels selecting related checkboxes
- `:enabled`
- `:disabled`
- `:required`
- `:valid`
- `:invalid`
- `:checked` for checkboxes
- `:indeterminate` for checkboxes
- `::placeholder`
- `appearance: none` for resetting styles to blank
- `caret-color`
- 

# Reactivity basics

TODO: LINK TO EXISTING REACTIVITY BASICS?

- Talk about one-way and two-way bindings
- Talk about single-framework solutions
- Talk about multi-framework solutions

# Validations

- Built-in browser validations
  - Required
  - Regex
  - JS Validity
    - `checkValidity()`
    - `setCustomValidity`
    - `ValidityState` https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
- Linked validations

# A11Y

## Labels

- Don't do placeholders
- `aria-describedby`

## Focus

- `tabindex`
  - `-1`
  - `0`
  - Disallow positive numbers for A11Y

  - `autofocus` attribute (and why not to do it most times outside of `dialog`s)
    - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus

## Popover API

https://developer.mozilla.org/en-US/docs/Web/API/Popover_API

## Dialogs

https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
- Too many modals (https://modalzmodalzmodalz.com/)

# Form anti-patterns

Mostly duplicated from A11Y stuff. Short link out to internal comment

- Placeholder in inputs
- Validating names
- Too many modals (https://modalzmodalzmodalz.com/)

# Server-side form validation

- `type="submit"`
- `enctype`
- `<form method>`
- Server-side validation, AKA "do not trust the client" 

# Internationalization

- Translation
- i18n
