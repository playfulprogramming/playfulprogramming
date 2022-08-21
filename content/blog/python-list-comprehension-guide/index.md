---
{
    title: "Python List Comprehension - The Comprehensive Guide",
    description: "Python is a language with broad and powerful APIs. One such API is 'List Comprehensions'. Let's learn to use them to improve your code!",
    published: '2021-05-07T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['python'],
    attached: [],
    license: 'coderpad',
    originalLink: 'https://coderpad.io/blog/python-list-comprehension-guide/'
}
---

Python list comprehensions allow for powerful and readable list mutations. In this article, we'll learn many different ways in how they can be used and where they're most useful.

Python is an incredibly powerful language that’s widely adopted across a wide range of applications. As with any language of sufficient complexity, Python enables multiple ways of doing things. However, the community at large has agreed that code should follow a specific pattern: be “Pythonic”. While “Pythonic” is a community term, the official language defines what they call [“The Zen of Python” in PEP 20](https://www.python.org/dev/peps/pep-0020/). To quote just a small bit of it:

> Explicit is better than implicit.
>
> Simple is better than complex.
>
> Complex is better than complicated.
>
> Flat is better than nested.

Introduced in Python 2.0 with [PEP 202](https://www.python.org/dev/peps/pep-0202/), list comprehensions help align some of these goals for common operations in Python. Let’s explore how we can use list comprehensions and where they serve the Zen of Python better than alternatives.

## What is List Comprehension?

Let’s say that we want to make an array of numbers, counting up from 0 to 2. We could assign an empty array, use `range` to create a generator, then `append` to that array using a `for` loop

```python
numbers = []
for x in range(3):
    numbers.append(x)
```

Alternatively, we could use list comprehension to shorten that to one line of code.

```python
numbers = [x for x in range(3)]
```

Confused on the syntax? Let’s outline what’s happening token-by-token.

![Breakdown of a list comprehension explained more below](./list_comp_breakdown.png)

The first and last brackets simply indicate that this is a list comprehension. This is also how I remember that a list comprehension outputs an array - it looks like we’re constructing an array with logic inside.

Second, we have the “x” before the “for”. This is the return value. This means that if we change the comprehension to:

```python
numbers = [x*2 for x in range(3)]
```

Instead of “0, 1, 2”, we’d get “0, 2, 4”.

Next up, we have a declaration of a `for` loop. This comprises of three separate parts:

1. “for” - the start of the loop
2. “x” - declaring the name of the variable to assign in each iteration
3. “in” - denoting the start of listening for the iterator

Finally, we have the `range`. This acts as the iterator for the `for` loop to iterate through. This can be replaced with anything a `for` loop can go through: a list, a tuple, or anything else that implements the iterator interface.

## Are List Comprehension Pythonic?

While it might seem counterintuitive to learn a new syntax for manipulating lists, let’s look at what the alternative looks like. Using `map`, we can pass an anonymous function (lambda) to multiply a number by 2, pass the `range` to iterate through. However, once this is done, we’re left with a `map` object. In order to convert this back to a list, we have to wrap that method in `list`.

```python
numbers = list(map(lambda x: x*2, range(3)))
```

Compare this to the list comprehension version:

```python
numbers = [x*2 for x in range(3)]
```

Looking at the comprehension, it’s significantly more readable at a glance. Thinking back to The Zen of Python, “Simple is better than complex,” list comprehensions seem to be more Pythonic than using `map`.

While others might argue that a “for” loop might be easier to read, the Zen of Python also mentions “Flat is better than nested”. Because of this, list comprehensions for simple usage like this are more Pythonic.

Now that we’re more familiar with basic usage of list comprehension, let’s dive into some of it’s more powerful capabilities.

## Filtering

While it might seem like list comprehension is only capable of doing a 1:1 match like `map`, you’re actually able to implement logic more similar to `filter` to change how many items are in the output compared to what was input.

If we add an `if` to the end of the statement, we can limit the output to only even numbers:

```python
even_numbers = [x for x in range(10) if x%2==0] #[0, 2, 4, 6, 8]
```

This can of course be combined with the changed mutation value:

```python
double_even_numbers = [x*2 for x in range(10) if x%2==0] #[0, 4, 8, 12, 16]
```

## Conditionals

While filtering might seem like the only usage of `if` in a list comprehension, you’re able to use them to act as conditionals to return different values from the original.

```python
number_even_odd = ["Even" if x % 2 == 0 else "Odd" for x in range(4)]
# ["Even", "Odd", "Even", "Odd"]
```

Keep in mind, you could even combine this ternary method with the previous filtering `if`:

```python
thirds_even_odd = ["Even" if x % 2 == 0 else "Odd" for x in range(10) if x%3==0]
# [0, 3, 6, 9] after filtering numbers
# ["Even", "Odd", "Even", "Odd"] after ternary to string
```

If we wanted to expand this code to use full-bodied functions, it would look something like this:

```python
thirds_even_odd = []
for x in range(10):
    if x%3==0:
        if x%2==0:
            thirds_even_odd.append("Even")
        else:
            thirds_even_odd.append("Odd")
```

## Nested Loops

While we explained that you’re able to have less items in the output than the input in our “filtering” section, you’re able to do the opposite as well. Here, we’re able to nest two “for” loops on top of each other in order to have a longer output than our initial input.

```python
repeated_list = [y for x in ["", ""] for y in [1, 2, 3]]
# [1, 2, 3, 1, 2, 3]
```

This logic allows you to iterate through two different arrays and output the final value in the nested loop. If we have to rewrite this, we’d write it out as:

```python
repeated_list = []
for x in ["", ""]:
    for y in [1, 2, 3]:
        repeated_list.append(y)
```

This allows us to nest the loops and keep the logic flat. However, you’ll notice in this example, we’re not utilizing the “x” variable. Let’s change that and do a calculations based on the “x” variable as well:

```python
numbers_doubled = [y for x in [1, 2] for y in [x, x*2]]
# 1, 2, 2, 4
```

Now that we’ve explored using hard-coded arrays to nest loops, let’s go one level deeper and see how we can utilize list comprehensions in a nested manner.

## Nested Comprehensions

There are two facts that we can combine to provide list comprehension with a super power:

1. You can use lists inside of a list comprehension
2. List comprehensions returns lists

Combining these leads to the natural conclusion that you can nest list comprehensions inside of other list comprehensions.

For example, let’s take the following logic that, given a two-dimensional list, returns all of the first index items in one list and the second indexed items in a second list.

```python
row_list = [[1, 2], [3,4], [5,6]]
indexed_list = []
for i in range(2):
    indexed_row = []
    for row in row_list:
        indexed_row.append(row[i])
    indexed_list.append(indexed_row)

print(indexed_list)
# [[1, 3, 5], [2, 4, 6]]
```

You’ll notice that the first indexed items (`1`, `3`, `5`) are in the first array, and the second indexed items (`2`, `4`, `6`) are in the second array.

Let’s take that and convert it to a list comprehension:

```python
row_list = [[1, 2], [3,4], [5,6]]
indexed_list = [[row[i] for row in row_list] for i in range(2)]
print(indexed_list)
# [[1, 3, 5], [2, 4, 6]]
```

## Readable Actions and Other Operators

Something you may have noticed while working with list comprehension is how close some of these operators are to a typical sentence. While basic comprehensions serve this well on their own, they’re advanced by the likes of Python’s other grammatical-style operators. For example, operators may include:

- `and` - Logical “and”
- `or` - Logical “or”
- `not` - Logical “not”
- `is` - Equality check
- `in` - Membership check/second half of `for` loop

These can be used for great effect. Let’s look at some options we could utilize:

```python
vowels = 'aeiou'
word = "Hello!"

word_vowels = [letter for letter in word if letter.lower() in vowels]

print(word_vowels)

# ['e', 'o']
```

Alternatively we could check for consonants instead, simply by adding one “not”:

```python
word_consonants = [letter for letter in word if letter.lower() not in vowels]
# ['H', 'l', 'l']
```

Finally, to showcase boolean logic, we’ll do a slight contrived check for numbers that mod 2 and 3 perfectly but are not 4:

```python
restricted_number = 4

safe_numbers = [x for x in range(6) if (x%2==0 or x%3==0) and x is not restricted_number]

# [0, 2, 3]
```

## Conclusion & Challenge

We’ve covered a lot about list comprehension in Python today! We’re able to build complex logic into our applications while maintaining readability in most situations. However, like any tool, list comprehension can be abused. When you start including too many logical operations to comfortably read, you should likely migrate away from list comprehension to use full-bodied `for` loops.

For example, given this sandbox code pad of a long and messy list comprehension, how can you refactor to remove all usage of list comprehensions? Avoid using `map`, `filter` or other list helpers, either. Simply use nested `for` loops and `if` conditionals to match the behavior as it was before.

<iframe src="https://app.coderpad.io/sandbox?question_id=177671" loading="lazy"></iframe>

This is an open-ended question meant to challenge your skills you’ve learned throughout the article!

Stuck? Wanting to share your solution? [Join our community Slack](https://bit.ly/coderpad-slack), where you can talk about list comprehensions and the challenge in-depth with the CoderPad team!
