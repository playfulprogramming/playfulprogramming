---
{
  title: "A forgotten C++ idiom revisited: pass-key",
  published: "2024-11-05",
  edited: "2024-11-05",
  tags: [ 'cpp' ]
}
---

So you have a class, and you want to control who can create instances
of it? Easy, make constructors private, and make friends with those
who can create it.

Now, let's say, you want to allow utilities like
[`std::make_unique<>()`](https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique)
create it. Now things got a bit tricky. The constructor must be public
for `std::make_unique<>()` to do its thing, but you still want to limit
who can create it. How?

Here's the thing. You can have a public constructor that takes an
argument that only a trusted party could have created. Even though
a non-trusted party cannot create it, they can still pass it on if they
are given one.

So we can write something like this:

```cpp
class special
{
    class pass_key {
        friend class special;
        pass_key() = default;
    };
};
```

The constructor of `pass_key` is private, but class `special` is a
friend and is allowed to create it.

Let's use this in a constructor:

```cpp
class special {
    class pass_key {
        friend class special;
        pass_key() = default;
    };
public:
    special(pass_key, int x);
    static std::unique_ptr<special> make(int x)
    {
        return std::make_unique<special>(pass_key{}, x);
    }
};
```

Even though the constructor of `special` is public, it can still
only be called if you have an instance of a `pass_key`, and it's only
class `special` that can create one.

While `std::make_unique<>()` cannot create a `pass_key`, it can,
well, pass it on when it's given one, therefore the call to
`std::make_unique<>()` inside `special::make()` works.

If you find reason to use this idiom in many places, it can be
somewhat automated by making `pass_key` a freestanding utility
class template that you can use over and over.

```cpp
template <typename T>
class pass_key
{
    friend T;
    explicit pass_key() = default;
};
```

The `pass_key` class template is parametrized on which type it
is friends with, and therefore which type is allowed to construct it.

Here I made the constructor `explicit`, because in C++17 and earlier,
anyone could, quite sneakily, create the type using empty `{}`
even though its constructor is private. Making the constructor
`explicit` prohibits that. This mistake was fixed in C++20, so
`explicit` is not actually needed if you use a reasonably modern
standard.

Use the freestanding utility like this:

```cpp
class special {
public:
    special(pass_key<special>, int x);
    static std::unique_ptr<special> make(int x)
    {
        return std::make_unique<special>(pass_key<special>{}, x);
    }
};
```

The constructor requires a `pass_key<special>`, and only
class `special` can create an instance of it. 

This technique is not new, and neither is it my invention. I think
I first learned it from Arne Mertz's blog
[SimplifyC++](https://arne-mertz.de/2016/10/passkey-idiom/)
already back in 2016, and I don't think it was new then either.

As Arne wrote: "_While it probably is not needed too often, small
tricks like this one can help us to make our programs more robust
against mistakes._"

So true.