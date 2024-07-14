---
{
  title: "Serializing structs with C++17 structured bindings",
  published: "2016-12-29",
  edited: "2016-12-29",
  tags: [ 'cpp' ]}
---

Serializing data in C++ is a surprisingly difficult problem. There are many libraries for it with varying degrees of
finesse, power and ease of use. C++17 offers an unexpected simplification
with [structured bindings](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2016/p0217r2.html). The simplification
does not lead to a universal solution, but its applicability is wide none the less.

First, what is this serialization problem? It may be the need to transfer data over a network or store on disk, or a
test frame work that wants to display unexpected values in a human readable form, and do all this for structured
types with unknown contents. This post will focus on visualizing data for a user, but the underlying problem is the for
networking or storage, so there is no fundamental reason why the technique shouldn't be applicable in other domains.

A common technique in many unit testing frame works is to use compile time reflection to find out if a type offers an
output stream operator and call it when available, and print a hex dump of the memory that the object occupies
otherwise. This works quite well for simple data, but if a member of a struct is, say, a `std::string`, you don't get
much useful information.

[Antony Polukhin](https://github.com/apolukhin), in his
talk "[C++14 Reflections Without Macros Markup Nor External Tooling: Metaprogramming Tricks For POD TYPES](https://www.youtube.com/watch?v=abdeAew3gmQ)"
at [CPPCon](http://cppcon.org/) 2016, showed impressive tricks for creating tuples matching a struct to grab the data
members. At the end of the presentation he hinted at alternative C++17 solutions, and this post follows up on that.

# Stating the problem

What I want to do, is to create an `operator<<(std::ostream&, T&)` for all types `T` that do not already have such an
operator, and for which I can enumerate the data members and call the stream insertion operator on them, one by one. I
want this to be applicable recursively. For readability, I want the members to be printed in order as a comma separated
list, surrounded by `{}`. Unlike [Antony Polukhin](https://github.com/apolukhin), I do not intend to limit this
to [POD](http://en.cppreference.com/w/cpp/concept/PODType) types, but the data members must be accessible. For example,
given these data types:

```cpp
struct Inner
{
  int n;
  std::string s;
};
struct Data
{
  int n;
  Inner inner;
  char c;
};
```

I want `std::cout << Data{3, { -2, "foo" }, '.'}` to print the string `"{ 3, { -2, foo }, . }"`.

To avoid clashes with other templated stream insertion operators, this one is placed in namespace `print_struct`.

# C++17 structured bindings

Provided the number of data members in a struct is known by the programmer, and they are accessible, they are easy to
get hold of using structured bindings. For example:

```cpp
void print(std::ostream& os, const Inner& inner)
{
  auto& [m1, m2] = inner;
  // m1 is inner.n
  // m2 is inner.s

  os << "{ " << m1 << ", " << m2 << " }";
}
void print(std::ostream& os, const Data& data)
{
  auto& [m1, m2, m3] = data;
  // m1 is data.n
  // m2 is data.inner
  // m3 is data.c

  os << "{ " << m1 << ", ";
  print(os, m2);
  os << ", " << m3 << "}";
}
```

The declaration `auto& [m1, m2] = inner` means to declare as references (`auto&`) the identifiers `m1` and `m2` as the
members
of `inner ([m1, m2] = inner)`.

You can read more on [Steve Lorrimer's](https://skebanga.github.io/) blog post
about [structured bindings](https://skebanga.github.io/structured-bindings/), or
watch [Jason Turner's](https://twitter.com/lefticus) introduction
in [Episode 24 of C++Weekly on YOUTube](https://www.youtube.com/watch?v=aBZlbb9sE-g).

For this to be useful in generic function templates the number of members each type has must be figured out, and for
each member we need to know whether it can be printed directly or it needs to be unwrapped recursively.

Let's tackle one problem at the time.

# Find the arity of a struct

This is probably the most tricky part of this post. I don't think there is a generic solution to always finding the
arity, i.e. the number of data members of a struct, but we can get far and cover most situations.

My take is the observation that if we limit ourselves to types that do not have constructors, but rely on brace
initialization of the data members. For example, using the type `Inner`, above, can be constructed
as `Inner{value1, value2}`,
provided that `value1` is convertible to `int` and `value2` is convertible to `std::string`, but it cannot be
constructed as `Inner{value1, value2, value3}`, regardless of the types of the values, nor can it be constructed as
`Inner(value1, value2)`. It can, however, be constructed as `Inner{value1}` (any sane compiler gives a warning, but that
is just
visual information to the programmer, not anything we can base program logic on.)

So, a struct without constcuctors can be constructed using `Type{values...}`, but can not be constructed using
`Type(values...)`. A constructor can take
a [`std::initializer_list<T>`](http://en.cppreference.com/w/cpp/utility/initializer_list), which can be called using
braces, but such a list has no upper limit to its size. If a type can be brace constructed using `N` values but not with
`N+1` values, and cannot be constructed using a parenthesized constructor with `N` values, it's very likely to be a
struct (
or an array.)

Fortunately, we can test the ability to create objects using [SFINAE](http://en.cppreference.com/w/cpp/language/sfinae)
techniques.

The standard library
provides [`std::is_constructible<T, V...>`](http://en.cppreference.com/w/cpp/types/is_constructible), which has a value
member constant that is true if `T(V...)` does create a `T`, and false otherwise. There is no version in the standard
library which tests for brace initialization, so here's one way of doing that:

```cpp
template <typename T, typename ... V>
inline constexpr auto is_brace_constructible_(T*)
  -> decltype(T{std::declval<V>()...},std::true_type{})
{
  return {};
}

template <typename T, typename ... V>
inline constexpr std::false_type is_brace_constructible_(...)
{
  return {};
}

template <typename T, typename ... V>
inline constexpr auto is_brace_constructible()
  -> decltype(is_brace_constructible_<T, V...>(nullptr))
{
  return {};
}
```

With this we can test `static_assert(is_brace_constructible<Inner, int, std::string>())`.

Most of the magic above is on line 3. The return type is whatever the type (`decltype`) of the expression
`T{std::declval<V>()...}, std::true_type{}` is. [`std::declval<>`](http://en.cppreference.com/w/cpp/utility/declval) is
a way to
get an instance of type `V`, for a compile time check, without knowing how `V` can be constructed. So the expression
`T{std::declval<V>()...}` becomes a `T`, if `T` can be brace constructed from instances of `V`.... If that compiles, the
comma
operator comes into play so the type of the full expression
becomes [`std::true_type`](http://en.cppreference.com/w/cpp/types/integral_constant). If it fails to compile,
because `T`
cannot be brace constructed from instances of `V`..., then [SFINAE](http://en.cppreference.com/w/cpp/language/sfinae)
kicks in, and the ellipsis version on lines 8-12 is used instead, which
returns [`std::false_type`](http://en.cppreference.com/w/cpp/types/integral_constant).

The function on lines 14-19 is a convenience to skip the need for a call with `nullptr`.

We now have the tools to test if a type can be constructed using parenthesized constructor or brace initialized,
provided we know the types to construct it from.

For a generic type `T`, we don't know that, however.

Enter the compile time `wildcard`.

```cpp
struct wildcard
{
  template <typename T>
  operator T&&() const;

  template <typename T>
  operator T&() const;
};

```

The conversion operators cannot need to be implemented, but fortunately that isn't needed. They're used
in [SFINAE](http://en.cppreference.com/w/cpp/language/sfinae) context only, to test whether a conversion can succeed or
not.

With this we can test constructibility of almost any type:

```cpp
static_assert(is_brace_constructible<std::string, wildcard>());
static_assert(is_brace_constructible<int, wildcard>());
static_assert(std::is_constructible<int, wildcard>());
static_assert(std::is_constructible<std::string, wildcard>());
static_assert(is_brace_constructible<Inner, int, std::string>());
```

It's not free from problems, though.

Imagine a type:

```cpp
struct uncopyable
{
  uncopyable(int) {}
  uncopyable(uncopyable&&) = default;
};
```

This will fail because there's an ambiguity between the two constructors. The situation can be helped a bit by improving
the `wildcard` type a slight bit:

```cpp
struct wildcard
{
  template <typename T,
            typename = std::enable_if_t<!std::is_lvalue_reference<T>::value>>
  operator T&&() const;

  template <typename T,
            typename = std::enable_if_t<std::is_copy_constructible<T>::value>>
  operator T&() const;
};
```

This covers the uncopyable (but movable) type. There's one kind that still doesn't work, and for which I do not have a
solution (suggestions, anyone?) An immobile type:

```cpp
struct immobile
{
  immobile(int) {}
  immobile(const immobile&) = delete;
};
```

Even though the copy constructor is deleted, it takes part in overload resolution for the constructor call from
`wildcard`. It's a wart, but I can live with this limitation.

Now comes the problem of finding the largest `N`, for which `N` is the number of wildcard instances that the type `T`
can be
brace constructed from but for
which [`std::is_constructible<>`](http://en.cppreference.com/w/cpp/types/is_constructible)
says false. That number `N` is the arity of the type `T`.

To get there, let's add a convenient variable template for wildcard:

```cpp
template <size_t N = 0>
static constexpr const wildcard _{};
```

This doesn't look like much, but it allows a valuable change to `is_brace_constructible<>`, where the number
of `wildcard`
instances is a parameter, rather than repeating them over and over.

```cpp
template <typename T, size_t ... I>
inline constexpr auto
is_brace_constructible_(std::index_sequence<I...>, T *)
  -> decltype(T{_<I>...}, std::true_type{})
{
  return {};
}

template <size_t ... I>
inline constexpr std::false_type
is_brace_constructible_(std::index_sequence<I...>, ...)
{
  return {};
}


template <typename T, size_t N>
constexpr auto
is_brace_constructible()
  -> decltype(is_brace_constructible_(std::make_index_sequence<N>{},
                                      static_cast<T *>(nullptr)))
{
  return {};
}
```

On line 4, `_<I>` is an instance of wildcard. The index I itself is not used for anything, it's just that it is very
easy to get a sequence of `N` index values from the standard library, thus it is very easy to get `N` instances of
wildcard.
For this to work, the order of the parameters to the helper functions had to be changed, but this is not important since
it is all hidden under the final function on lines 17-24.

A similar convenience predicate is made
for [`std::is_constructible<>`](http://en.cppreference.com/w/cpp/types/is_constructible), which checks for constructor
calls with parenthesis instead of braces:

```cpp
template <typename T, typename U>
struct is_paren_constructible_;

template <typename T, size_t ... I>
struct is_paren_constructible_<T, std::index_sequence<I...>>
       : std::is_constructible<T, decltype(_<I>)...>
{
};

template <typename T, size_t N>
constexpr auto
is_paren_constructible()
  -> is_paren_constructible_<T, std::make_index_sequence<N>>
{
  return {};
}
```

The declaration on lines 1-2 are just to introduce the name as template. Lines 4-8 does the real job by specializing on
`<T, std::index_sequence<I...>>`, which inherits
from [`std::is_constructible<>`](http://en.cppreference.com/w/cpp/types/is_constructible).

Lines 10-16 is to make the convenience predicate `is_paren_constructible<>` usable with the same syntax as
`is_brace_constructible<>`.

These are the tools needed to check an arity of a struct, like:

```cpp
static_assert(!is_paren_constructible<Inner, 2>());
static_assert(is_brace_constructible<Inner, 2>());
static_assert(!is_brace_constructible<Inner, 3>());
static_assert(!is_paren_constructible<Data, 3>());
static_assert(is_brace_constructible<Data, 3>());
static_assert(!is_brace_constructible<Data, 4>());
```

With these tests in place, we can make a bunch of function templates that either fails substitution, or reports the
arity.

```cpp
template <typename T,
          typename = std::enable_if_t<
                         is_brace_constructible<T, count>{} &&
                         !is_brace_constructible<T, count+1>{} &&
                         !is_paren_constructible<T, count>{}
                       >
           >
inline constexpr std::integral_constant<size_t, count> arity()
{
  return {};
}
```

[`std::integral_constant<size_t, count>`](http://en.cppreference.com/w/cpp/types/integral_constant) is going to be used
a lot, so a convenience alias is introduced to help code readability a bit:

```cpp
template <size_t N>
using size = std::integral_constant<size_t, N>;
```

Now just repeat the `arity<>()` function template for any value of count desired. As much as I dislike the preprocessor,
I
prefer a macro for this kind of code repetition:

```cpp
#define MAKE_ARITY_FUNC(count)                                          \
  template <typename T,                                                 \
            typename = std::enable_if_t<                                \
                         is_brace_constructible<T, count>{} &&          \
                         !is_brace_constructible<T, count+1>{} &&       \
                         !is_paren_constructible<T, count>{}            \
                       >                                                \
           >                                                            \
  constexpr size<count> arity()                                         \
  {                                                                     \
    return {};                                                          \
  }

  MAKE_ARITY_FUNC(1)
  MAKE_ARITY_FUNC(2)
  MAKE_ARITY_FUNC(3)
  MAKE_ARITY_FUNC(4)
  MAKE_ARITY_FUNC(5)
  MAKE_ARITY_FUNC(6)
  MAKE_ARITY_FUNC(7)
  MAKE_ARITY_FUNC(8)
  MAKE_ARITY_FUNC(9)
  MAKE_ARITY_FUNC(10)
  MAKE_ARITY_FUNC(11)
  MAKE_ARITY_FUNC(12)
  MAKE_ARITY_FUNC(13)
  MAKE_ARITY_FUNC(14)
  MAKE_ARITY_FUNC(15)
```

A couple of asserts will show the correctness.

```cpp
static_assert(arity<Inner>() == 2);
static_assert(arity<Data>() == 3);
```

The way this works is that `arity<Inner>()` will fail substitution for all versions except the one where count is 2. But
since [Substitution Failure Is Not An Error](http://en.cppreference.com/w/cpp/language/sfinae), this is OK, and there is
exactly one that succeeds substitution, a uniquely defined value is returned.

The only thing missing is the case of the empty struct, because it is indistinguishable from default construction. This
is taken care of with a special version of `arity<>()`:

```cpp
template <typename T,
          typename = std::enable_if_t<
                       std::is_class<T>{} &&
                       std::is_empty<T>{}
                     >
          >
constexpr size<0> arity()
{
  return {};
}
```

This will succeed substitution for empty structs.

Now, the problem of finding the arity of struct types is taken care of.

# Making a print function for structs

If we, for the moment, boldly assume that there is a working stream insertion operator for all types, including for
nested structs, making a print function is quite easy, if somewhat tedious.

```cpp
template <typename T>
std::ostream& print_struct(std::ostream& os, const T& t)
{
  return print_struct(os, t, arity(t));
}
```

This function template just dispatches to another function template that accepts the arity as the 3rd parameter. Since
this is a compile time constant encoded in the type as `size<count>`, we can make one function template for each arity.
There will be a lot of repetition.

```cpp
template <typename T>
std::ostream& print_struct(std::ostream& os, const T&, size<0>)
{
  return os << "{ }";}

template <typename T>
std::ostream& print_struct(std::ostream& os, const T& t, size<1>)
{
  auto& [p1] = t;
  return os << "{ " << p1 << " }";}

template <typename T>
std::ostream& print_struct(std::ostream& os, const T& t, size<2>)
{
  auto& [p1, p2] = t;
  return os << "{ " << p1 << ", " << p2 << " }";}

template <typename T>
std::ostream& print_struct(std::ostream& os, const T& t, size<3>)
{
  auto& [p1, p2, p3] = t;
  return os << "{ " << p1 << ", " << p2 << ", " << p3 << " }";}

template <typename T>
std::ostream& print_struct(std::ostream& os, const T& t, size<4>)
{
  auto& [p1, p2, p3, p4] = t;
  return os << "{ " << p1 << ", " << p2 << ", " << p3 << ", " << p4 << " }";
}
```

etc., for as many members as we want to support. It's not pretty.

Structured bindings works here, because each function template only accepts calls for types with the correct arity.

However, while it appears impossible to completely get rid of the repetitive tedium, the likelyhood of mistakes can be
slightly reduced by making a print function for [`std::tuple<>`](http://en.cppreference.com/w/cpp/utility/tuple), which
prints its members comma separated and enclosed by `{}`.

```cpp
template <typename T, size_t ... I>
std::ostream& print_tuple(std::ostream& os,
                          const T& t,
                          std::index_sequence<I...>)
{
  os << "{ ";
  return ((os << ((I ? os << ", ":os),std::get<I>(t))),...) << " }";
}

template <typename ... T>
std::ostream& print_tuple(std::ostream& os, const std::tuple<T...>& t)
{
  return print_tuple(os, t, std::make_index_sequence<sizeof...(T)>{});
}
```

The function template on lines 10-14 just dispatches the call over to the one on lines 1-8. The latter one has a indexes
for each member of the tuple to play with.

The abomination on line 7 is a [fold expression](http://en.cppreference.com/w/cpp/language/fold) abusing the comma
operator in two ways.

First, `((os << ((I ? os << ", ":os),std::get<I>(t))),...)` is
the [fold expression](http://en.cppreference.com/w/cpp/language/fold). It can be modeled as `(expr(I) op ...)`, and in
this case `op` is `","`. What this means is that `expr(I)` is repeated, separated by `op` (i.e. `","`) for each value
of `I` in the
variadic template parameter pack. `expr(I)` is `(os << ((I ? os << ", ":os),std::get<I>(t))`, which again abuses the
comma
operator. The right hand side does evaluate to `std::get<I>(t)`, which is passed to the stream insertion operator, but
before that, the string `", "` is inserted into `os` if, and only if, `I != 0`.

This absurdity means that the `print_struct` function templates can be ever so slightly simplified to:

```cpp
template <typename T>
std::ostream &print(std::ostream &os, const T &, size<0>)
{
  return os << "{ }";
}

template <typename T>
std::ostream &print(std::ostream &os, const T &t, size<1>)
{
  auto [p1] = t;
  return print_tuple(os, std::forward_as_tuple(p1));
}

template <typename T>
std::ostream &print(std::ostream &os, const T &t, size<2>)
{
  auto [p1,p2] = t;
  return print_tuple(os, std::forward_as_tuple(p1, p2));
}

template <typename T>
std::ostream &print(std::ostream &os, const T &t, size<3>)
{
  auto [p1,p2,p3] = t;
  return print_tuple(os, std::forward_as_tuple(p1, p2, p3));
}

template <typename T>
std::ostream &print(std::ostream &os, const T &t, size<4>)
{
  auto[p1,p2,p3,p4] = t;
  return print_tuple(os, std::forward_as_tuple(p1, p2, p3, p4));
}
```

The gain is not great, but it's something.

If you're a very sharp reader, you may have noticed that the structured bindings do not capture by reference here. They
should, but due to bugs in the work-in-progress headers of both gcc and clang, header `<tuple>` interferes with the
ability to capture elements of structs by reference. I assume the bugs will be fixed by the time the official support
for C++17 is released.

# A generic stream insertion operator

The idea is to write a templated `operator<<(std::ostream&, const T&)` that only instantiates for types `T` that do not
already have a stream insertion operator, and that are structs that we can print using the functions shown earlier.

Checking whether a type can be inserted into an ostream is not very difficult, compared to what's already shown above.
It can be done in many ways. Here's my take on it:

```cpp
namespace stream_check
{
  template <typename T>
  constexpr auto is_output_streamable(const T* t)
  -> decltype((std::declval<std::ostream&>() << *t), std::true_type{})
  {
    return {};
  }

  constexpr std::false_type is_output_streamable(...)
  {
    return {};
  }

  template <typename T>
  constexpr auto is_output_streamable()
    -> decltype(is_output_streamable(static_cast<T*>(nullptr)))
  {
    return {};
  }
}

```

It's more or less the same technique as in the test for ability to construct an object. The version of `check<T>` on
lines 3-8 is preferred over the one on lines 10-13, since the latter uses the ellipsis. If the stream insertion
compiles, the comma expression makes sure that the return type of the version on lines 3-8
is [`std::true_type`](http://en.cppreference.com/w/cpp/types/integral_constant). If it fails to compile, the fallback is
the less desirable version on lines 10-13, which has a return type
of [`std::false_type`](http://en.cppreference.com/w/cpp/types/integral_constant).

The function template on lines 15-20 is the one to use. Its return type is whatever the version of check that compiles
gives.

This one is placed in a separate namespace from all the previously listed stuff, so as to not interfere with the stream
insertion operator that will be implemented next.

That stream insertion operator then becomes surprisingly simple:

```cpp
template <typename T>
auto operator<<(std::ostream& os, const T& t)
  -> std::enable_if_t<!stream_check::is_output_streamable<T>(),
                      decltype(print_struct(os, t, arity<T>())>
{
  return print_struct(os, t, arity<T>());
}
```

This function template will only successfully be instantiated if the type `T` doesn't already have a stream insertion
operator, and `arity<T>()` can be instantiated, and `print_struct<>()` can be instantiated with that arity. If the
`print_tuple<>()` function template shown earlier can see this templated stream insertion operator, the stream insertion
operators used for each member will find this one when needed, and thus drill down recursively, just as desired.

# So what about performance?

Yes, yes, we're C++ developers. We count cycles in our sleep, so performance matters. Here's a very small test program:

```cpp
#include "print_struct.hpp"
#include <iostream>
struct inner
{
  const char *p;
  int n;
};
struct outer
{
  int m;
  inner i;
};
int main()
{
  outer o{3, {"foo", 88}};
  using namespace print_struct;
  std::cout << o << '\n';
}
```

Compiling it with a home-built gcc (not yet version 7) with -O3 gives this assembly language output:

```asm
.LC0:
        .string "{ "
.LC1:
        .string ", "
.LC2:
        .string "foo"
.LC3:
        .string " }"
        .section        .text.startup,"ax",@progbits
        .p2align 4,,15
        .globl  main
        .type   main, @function
main:
.LFB2124:
        .cfi_startproc
        pushq   %rbx
        .cfi_def_cfa_offset 16
        .cfi_offset 3, -16
        movl    $.LC0, %esi
        movl    std::cout, %edi
        subq    $16, %rsp
        .cfi_def_cfa_offset 32
        call    std::basic_ostream<char, std::char_traits<char> >& std::operator<< <std::char_traits<char> >(std::basic_ostream<char, std::char_traits<char> >&, char const*)
        movl    $3, %esi
        movl    std::cout, %edi
        call    std::basic_ostream<char, std::char_traits<char> >::operator<<(int)
        movl    $.LC1, %esi
        movl    std::cout, %edi
        call    std::basic_ostream<char, std::char_traits<char> >& std::operator<< <std::char_traits<char> >(std::basic_ostream<char, std::char_traits<char> >&, char const*)
        movl    $.LC0, %esi
        movl    std::cout, %edi
        call    std::basic_ostream<char, std::char_traits<char> >& std::operator<< <std::char_traits<char> >(std::basic_ostream<char, std::char_traits<char> >&, char const*)
        movl    $.LC2, %esi
        movl    std::cout, %edi
        call    std::basic_ostream<char, std::char_traits<char> >& std::operator<< <std::char_traits<char> >(std::basic_ostream<char, std::char_traits<char> >&, char const*)
        movl    $.LC1, %esi
        movl    std::cout, %edi
        call    std::basic_ostream<char, std::char_traits<char> >& std::operator<< <std::char_traits<char> >(std::basic_ostream<char, std::char_traits<char> >&, char const*)
        movl    $88, %esi
        movl    std::cout, %edi
        call    std::basic_ostream<char, std::char_traits<char> >::operator<<(int)
        movl    $2, %edx
        movq    %rax, %rbx
        movl    $.LC3, %esi
        movq    %rax, %rdi
        call    std::basic_ostream<char, std::char_traits<char> >& std::__ostream_insert<char, std::char_traits<char> >(std::basic_ostream<char, std::char_traits<char> >&, char const*, long)
        movq    %rbx, %rdi
        movl    $2, %edx
        movl    $.LC3, %esi
        call    std::basic_ostream<char, std::char_traits<char> >& std::__ostream_insert<char, std::char_traits<char> >(std::basic_ostream<char, std::char_traits<char> >&, char const*, long)
        leaq    15(%rsp), %rsi
        movq    %rbx, %rdi
        movl    $1, %edx
        movb    $10, 15(%rsp)
        call    std::basic_ostream<char, std::char_traits<char> >& std::__ostream_insert<char, std::char_traits<char> >(std::basic_ostream<char, std::char_traits<char> >&, char const*, long)
        addq    $16, %rsp
        .cfi_def_cfa_offset 16
        xorl    %eax, %eax
        popq    %rbx
        .cfi_def_cfa_offset 8
        ret

```

This is quite good. All obvious overhead is removed. The one different that stands out over a hand tooled one, is that
with knowledge of the flattened structure, you could remove a few calls by concatenating strings like `", "` and `"{ "`
into `", {"`. Compared to hand written stream insertion operators for each type, called recursively, I think this is
identical to the best you can get.

# Wrap up

It is possible to do generic serialization of structs, provided they don't have constructors, and provided that each
member can be tested for constructibility using a single value. This is very close to the goal stated at the very
beginning of this post. Writing it wasn't very easy, but it's write once use often, compared to writing stream insertion
operators for each and every struct.

Implementing read logic is left as an exercise for the interested reader.
