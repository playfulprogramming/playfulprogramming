---
{
    title: "A Guide to Python's Secret Superpower: Magic Methods",
    description: "",
    published: '2022-06-08T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['python'],
    attached: [],
    license: 'coderpad',
    originalLink: 'https://coderpad.io/blog/development/guide-to-python-magic-methods/'
}
---

Python has a secret superpower with a similarly stupendous name: Magic Methods. These methods can fundamentally change the way you code with Python classes and introduce code that seems ✨ magical ✨ to handle complex logic. They’re more powerful than [list comprehensions](https://coderpad.io/blog/development/python-list-comprehension-guide/) and more exciting than any new [PEP8](https://peps.python.org/pep-0008/) linter.

Today, we’ll be talking about a few things:

- What magic methods are
- Some simple introductory magic method usage
- How to programmatically manage class properties
- How to overwrite operator symbol functionality
- How to make your classes iterable

We also have a cheat sheet for utilizing these magic methods quicker within your projects:

> [Download the related Magic Methods Cheat Sheet](https://coderpad.io/python-magic-methods-cheat-sheet/)

Without further ado, let’s dive in!

## What are magic methods?

Magic methods are methods that Python calls on your behalf in specific circumstances. These methods are named in a particular way to quickly distinguish them from other Python methods: they’re preceded and followed by two underscores.

```python
class Speaker:
    # This is a magic method
    def __init__(self):
        print("Hello, world!")
# This will call __init__ and print "Hello, world!"
instance = Speaker()
```

> This is why magic methods also called “dunder methods,” which is a shorthand for “Double underscore methods.”

In the above code you can see what I’m talking about: Python calls the `__init__` dunder method on your behalf when a new class instance is created.

This barely scratches the surface when it comes to the power that magic methods provide. Let’s dive into their usage.

## Simple magic method usage

If you’ve ever created a class, you’re likely familiar with the following method:

`__init__(self, …args)` - `ClassName()`

It’s probably the best-known magic method, Python’s **init** acts as a class constructor. You can use this to pass initial arguments to a Python class.

For example, take the following:

```python
class Speaker:
    message = ""
    def __init__(self, val):
        self.message = val
       
    def sayIt(self):
        print(self.message)

instance = Speaker("Hello, world!")
instance.sayIt()
```

Here, whenever the `Speaker` class is initialized, it will assign `self.message` to the passed value. We’re then able to use a custom “sayIt” method that utilizes `self.message`.

### Clean up class instantiation with `del`

In addition to a class initializer, there’s also a class deletion handler:

`__del__(self)` - `del instance`

This method will run any time you call `del` on a class instance. This is particularly useful whenever you have an I/O operation in the constructor in order to cleanup said I/O operations.

```python
import os

class Test:
    def __init__(self):
        f = open("temp.csv", "w")
        f.write("data,more data,testing")
        f.close()
    def __del__(self):
        os.remove('temp.csv')
        print("Cleanup done!")

firstItem = Test()

del firstItem
```

This type is cleanup is integral to ensure your applications are deterministic on each run, which in turn increases general application stability. After all, if you leave remnants of your cache, they’re likely to be picked up by subsequent runs and cause havoc with your application logic.

## How to programmatically manage class properties

Stuff like class constructors and cleanup are par for the course when it comes to class management. Ready for the weird stuff?

What about declaring attributes that don’t exist? `__getattr__` has you covered.

`__getattr__(self, key)` - `instance.property` (when `property` doesn’t exist)

Simply check what the lookup key is (in this case with the `__name` property) and return a value if you want to create a new property programmatically:

```python
class Test:
    number = 1

    def __getattr__(self, __name: str):
        if __name == "string":
            return "Test"
        pass


test = Test()
print(test.number) # Will print `1`
print(test.string) # Will print `"Test"`
```

There also exists a slightly different **getattribute** built-in:

`__getattribute__(self, key)` - `instance.property` (regardless of if `property` exists)

```python
class Test:
    number = 1

    def __getattribute__(self, __name: str):
        if __name == "string":
            return "Test"
        pass


test = Test()
print(test.number) # `None`
print(test.string) # `"Test"`
```

Notice how instead of `test.number` returning the expected `1` value, it returns a `None`.

This is because while `__getattr__` will resolve the existing variables and fallback to the special method when nothing is found, `__getattribute__` runs first and doesn’t fall back to existing values in the class instance.

In order to have `__getattribute__` to have the same behavior as `__getattr__`, we need to explicitly tell Python not to get stuck in the `__getattribute__` trap we’ve set up.

To do this, we can call `super().__getattribute__`:

```python
class Test:
    number = 1

    def __getattribute__(self, __name: str):
        """
        We need a "try/except" here, otherwise it will fail during
        lookup of an invalid key
        """
        try:
            existingVal = super().__getattribute__(__name)
            if existingVal:
                return existingVal
        except:
            if __name == "string":
                return "Test"
        pass


test = Test()
print(test.number) # Will print `1`
print(test.string) # Will print `"Test"`
```

### Customize class property dictionary lookup

While `__getattr__` and `__getattribute__` both work wonders for adding in keys programmatically, there’s a problem with that method. When using [the `dir` built-in method](https://docs.python.org/3/library/functions.html#dir), it won’t show the new keys.

Let’s show you what I’m talking about with a code sample. Take the following:

```python
class Test:
    number = 1

    def __getattr__(self, __name: str):
        if __name == "string":
            return "Test"
        pass


test = Test()
print(dir(test))
```

This `print` statement will output all of these keys:

```
['__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattr__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', 'number']
```

This list of keys includes other magic methods, which muddies the output a bit for our needs. Let’s filter those out with the following logic:

```python
def simpledir(obj):
    return [x for x in dir(obj) if not x.startswith('__')]
```

Now, when we run `simpledir(test)`, we only see:

```python
['number']
```

But where is our `’string’` field? It doesn’t show up.

This is because while we’ve told Python how to look up the overwritten values, we’ve not told Python which keys we’ve added.

To do this, we can use the `__dir__` magic method.

`__dir__(self)` - `dir(instance)`

```python
class Test:
    number = 1

    def __dir__(self):
        originalList = super().__dir__()
        originalList.append("string")
        return originalList
   
    def __getattr__(self, __name: str):
        if __name == "string":
            return "Test"
        pass
```

Customizing `dir` behavior like this will now enable us to treat our dynamic properties as if they existed normally. Now all we’re missing is a way to set values to those properties…

### Set programmatically created keys

While we’re now telling Python which keys we’re programmatically creating and how to lookup the value of those keys, we’re not telling Python how to store those values.

Take the following code:

```python
class Test:
    number = 1
 
    def __getattr__(self, __name: str):
        print("Test");
        if __name == "string":
            return "Test"
        pass
 
test = Test()
 
test.string = "Value"
print(test.string)
```

Here, we might expect the `print(test.string)` to output "Test" as well as "Value", since `getattr` should be called. But, if we look at the log, we only see the following:

```python
"Value"
```

This is because, once we assign `test.string`, it no longer calls `getattr` the way we expect it to.

To solve this problem, we need to use the `__setattr__` magic method to “listen” for property assignment.

`__setattr__(self, key, val)` - `instance.property = newVal`

```python
class Test:
    updateCount = 0
    valid = 1

    def __setattr__(self, key, val):
        super().__setattr__("updateCount", self.updateCount + 1)
        pass


test = Test()
test.valid = 12
print(test.updateCount)
```

> Notice our usage of `super().__setattr__`. We need to do this similarly to how we utilized the `super()` method in `__getattribute__`, otherwise `self.updateCount += 1` would trigger an infinite loop of calls to `__setattr__`.

### Clean up programmatic property instanciation

Just as we can hook into the setting and getting behavior of an attribute, we can also hook into the `del` behavior of an attribute using `__delattr__`.

For example, what if we wanted to create a class that acted like a dictionary. For each key created in this dictionary we’d want to automatically create a temporary file. Then, on cleanup (using `del`), let’s remove that file with `os.remove`:

`__delattr__(self, key)` - `del instance.property`

```python
import os

class FileDictionary:
    def __setattr__(self, filename, val):
        f = open(filename, "w")
        f.write(val)
        f.close()
   
    def __delattr__(self, filename):
        os.remove(filename)

fileDictionary = FileDictionary()

fileDictionary.README = "Hello"
del fileDictionary.README
```

Remember, if you’re not cleaning up your side effects, it may cause havoc with future usage of your app. This is why it’s so important to add in `__delattr__` when relevant.

### Convert programatic lookups to index properties

In our most recent `FileDictionary` example, we created a class called “FileDictionary”, but then accessed the child values with the dot accessor:

```python
fileDictionary.README = "Hello"
```

However, this dot syntax causes some minor headache: it’s not consistent with how you access properties from a dictionary. The reason we’re not using the standard dictionary syntax is because if you do the following:

```python
fileDictionary['README'] = "Hello"
```

We would quickly get an error from Python:

```
> TypeError: 'FileDictionary' object is not subscriptable
```

To solve this problem, we need to migrate away from `__setattr__`, which only supports dot notation, to `__setitem__`, which only supports the dictionary-style notation.

- `__getitem__(self, key)` - `instance[property]`
- `__setitem__(self, key, val)` - `instance[property] = newVal`
- `__delitem__(self, key)` - `del instance[property]`

```python
import os

class FileDictionary:
    def __setitem__(self, filename, val):
        f = open(filename, "w")
        f.write(val)
        f.close()

    def __delitem__(self, filename):
        os.remove(filename)

fileDictionary = FileDictionary()

fileDictionary['README'] = "Hello"
del fileDictionary['README']
```

As a wonderful side effect, you’re now able to add in a file extension to the `fileDictionry`. This is because bracket notation supports non-ASCII symbols while the dot notation does not.

```python
fileDictionary['README.md'] = "Hello"
del fileDictionary['README.md']
```

## How to replace operator symbol functionality with custom logic

There’s nothing more Pythonic than the simplicity of using simple mathematical symbols to represent mathematic actions.

After all, what could more clearly represent the sum of two numbers than:

```python
sum = 2 + 2
```

Meanwhile, if we have a wrapper around a number:

```python
sum = numInstance.getNumber() + numInstance.getNumber()
```

It gets a bit harder to read through.

What if we could utilize those symbols to handle this custom class logic for us?

```python
sum = numInstance + numInstance;
```

Luckily we can!

For example, here’s how we can make the `+` symbol run custom logic:

- `__add__(self, other)` - `instance + other`

```python
class Test:
    __internal = 0
    def __init__(self, val):
        self.__internal = val
    def __add__(self, other):
        return self.__internal + other.__internal
 

firstItem = Test(12)
secondItem = Test(31)

# This will call "__add__" instead of the traditional arithmetic operation
print(firstItem + secondItem)
```

There’s also other math symbols you can overwrite:

- `__sub__(self, other)` - `instance - other`
- `__mul__(self, other)` - `instance * other`

### Manage comparison symbol behavior

Addition, subtraction, and multiplication aren’t the only usages for operator overloading, however. We can also modify the comparison operators in Python to run custom logic.

Let’s say we want to check if two strings match, regardless of casing:

- `__eq__(self, other)` - `instance == other`

```python
class Test():
    str = ""

    def __init__(self, val):
        self.str = val

    def __eq__(self, other):
        return self.str.lower() == other.str.lower()

firstItem = Test("AB")
secondItem = Test("ab")

print(firstItem == secondItem)
```

You can also have different logic for `==` and `!=` using `__ne__`.

- `__ne__(self, other)` - `instance != other`

However, if you don’t provide a `__ne__`, but **do** provide a `__eq__`, Python will simply negate the `__eq__` logic on your behalf when `instance != other` is called.

There’s also a slew of magic methods for customizing other comparison operators:

- `__lt__(self, other)` - `instance < other`
- `__gt__(self, other)` - `instance > other`
- `__le__(self, other)` - `instance <= other`
- `__ge__(self, other)` - `instance >= other`

### Overwrite a class’s type casting logic

Python, like any other programming language, has the concept of data types. Similarly, you’re able to convert easily from any of those types to another type using built-in methods of type-casting data.

For example, if you call `bool()` on a string, it will cast the truthy value to a Boolean.

What if you could customize the behavior of the `bool()` method? You see where we’re going with this…

- `__bool__(self)` - `bool(instance)`

```python
from os.path import exists

class File:
    file_path = ""
   
    def __init__(self, file_path):
        self.file_path = file_path
          # This method should return `True` or `False`
    def __bool__(self):
        return exists(self.file_path)

file = File("temp.txt")

# Will return True or False depending on if file exists
print(bool(file))
```

There’s also other type casts logic you can customize:

- `__int__(self)` - `int(instance)`
- `__str__(self)` - `str(instance)`

## How to make your classes iterable

Let’s say that we’ve used a custom class to build a replacement for a List:

```python
class ListLike:
    length = 0

    def __getitem__(self, key):
        return self.__getattribute__(str(key))

    def __setitem__(self, key, val):
        self.__setattr__(str(key), val)

    def __delitem__(self, key):
        self.__delattr__(key)

    def append(self, val):
        self[str(self.length)] = val
        self.length += 1

listLike = ListLike()
print(listLike.length) # 0
listLike.append("Hello")
listLike.append("World")
print(listLike.length) # 2
print(listLike[0]) # "Hello"
```

This appears to work amazingly at first glance, until you try to do the following:

```python
[x for x in listLike]
```

Or any other kind of iteration on the ListLike. You’ll get the following confusingly named error:

```python
'ListLike' object has no attribute '2'
```

This is because Python doesn’t know _how_ to iterate through your class, and therefore attempts to access a property in the class. This is where `__iter__` comes into play: It allows you to return an iterable to utilize anytime Python might request iterating through the class, like in [a list comprehension](https://coderpad.io/blog/development/python-list-comprehension-guide/).

- `__iter__(self)` - `[x for x in instance]`

```python
class ListLike:
    length = 0
 
    def __getitem__(self, key):
        return self.__getattribute__(str(key))
 
    def __setitem__(self, key, val):
        self.__setattr__(str(key), val)
 
    def __delitem__(self, key):
        self.__delattr__(key)
 
    def __iter__(self):
        isMethod = lambda x: type(x).__name__ == 'method'
        # Only return non-method keys that are not "length"
        return iter([x for x in dir(self) if not x.startswith('__') and x != 'length' and not isMethod(self[x])])
 
    def append(self, val):
        self[str(self.length)] = val
        self.length += 1
 
listLike = ListLike()
 
listLike.append("Hello")
listLike.append("World")
 
[print(x) for x in listLike]
```

> Notice that we’re having to return a real list wrapped in the `iter` method for the `__iter__` return value: This is required by Python.
>
> If you don't do this, you'll get the error:
>
> ```
> iter() returned non-iterator of type 'list'
> ```

### Check if an item exists using the “in” keyword

The `__iter__` magic method isn’t the only way to customize traditionally list-like behavior for a class. You can also use the `__contains__` method to add support for simple “is this in the class” checks.

- `__contains__(self, item)` - `key in instance`

Something to keep in mind is that if `__contains__` isn't defined, Python will use the information provided by `__iter__` to check if the key is present. However, `__contains__` is a more optimized method, since the default `__iter__` checking behavior will iterate through every key until it finds a match.

## Python magic method cheat sheet

Python magic methods can level up your application logic by reducing the amount of boilerplate required to do specific actions, but that’s not its only usecase. Othertimes, you might want to use magic methods to provide an API with a nicer development experience for consuming developers.

That said, we know that with so many magic methods it can be difficult to remember them all. This is why we made a cheat sheet that you can download or print out to reference when writing code.

> [Download the related Magic Methods Cheat Sheet](https://coderpad.io/python-magic-methods-cheat-sheet/)
