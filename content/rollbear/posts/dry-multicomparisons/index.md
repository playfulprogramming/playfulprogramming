---
{
  title: "DRY multicomparisons",
  published: "2018-07-14",
  edited: "2018-07-14",
  tags: [ 'cpp' ]}
---

Now and then, I find myself writing something like if `(x == a || x == b || x == c) ...`, and every time the repetition
of `x ==` annoys me.

A number of people, me included, have reduced the repetition by writing code like:

```cpp
template <typename T>
class is
{
public:
    constexpr is(T t_) : t(std::move(t_)) {}
    template <typename ... U>
    constexpr auto any_of(U const& ... u) const { return ((t == u) || ...); }
private:
  T t;
};
```

If you're not familiar with the C++17 constructs, I'll walk you through it.

To begin with, C++17 has
a [class template argument type deduction](https://en.cppreference.com/w/cpp/language/class_template_argument_deduction)
that works for constructors. This works automatically when the type used in the constructor is enough to deduce the
template types, which is the case with the constructor on line 5, so `is{3}` is automatically deduced to
be `is<int>{3}`,
since the literal `3` is an `int`.

The member function template `any_of()`, on line 7, uses
a [variadic template parameter pack](https://en.cppreference.com/w/cpp/language/parameter_pack) `...u`, to accept any
number of arguments of any type. This is then passed to
a [fold expression](https://en.cppreference.com/w/cpp/language/fold) which will be expanded such that the
pattern (`t == u`) is repeated, where u takes on each and every of the parameters called with, in the `...`.

Here's an example use of the construction:

```cpp
if (is{x}.any_of(a,b,c)) ...
```

It will construct an `is<int>{x}`, and the call to `any_of(a,b,c)` will in effect return the result of
`((x == a) || (x == b) || (x == c))`.

This takes care of much of the repetition, but it doesn't read very nicely. It's awkward.

Enter [ranges](https://en.cppreference.com/w/cpp/experimental/ranges). Ranges have been in the works for C++ for some
time now, and is available as open source libraries if you want to try them out. Chances are they will
be [a part of C++20](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2018/p0896r2.pdf), but that decision is not made
yet.

With ranges, the algorithms from [`<algorithm>`](https://en.cppreference.com/w/cpp/header/algorithm)
and [`<numeric>`](https://en.cppreference.com/w/cpp/header/numeric) can work on whole ranges of values at once, so you
don't have to fiddle with iterator pairs. Collections counts as ranges,
including [`std::initializer_list<>`](https://en.cppreference.com/w/cpp/utility/initializer_list). In my examples I'm
using the range-v3 library, available from [github.com](https://github.com/ericniebler/range-v3). In the range-v3
library, the algorithms are in namespace `ranges::v3`.

So we can instead write:

```cpp
if (ranges::v3::any_of({a,b,c}, [x](auto y){ return x == y; }) ...
```

It takes care of repetition, but at the cost of boiler plate to the degree it smells of obfuscation. It's not easy to
read.

A trivial [higher order function](https://en.wikipedia.org/wiki/Higher-order_function) improves it:

```cpp
template <typename T>
inline auto equals(T t)
{
    return [=](auto&& x) { return x == t;};
}
```

The call can now be made as:

```cpp
if (ranges::v3::any_of({a,b,c}, equals(x)) ...
```

The call to `equals(x)` gives us the lambda that makes the test for equality. I guess that if you read it out, except
for
the namespace and punctuations, it kind of reads like normal English.

But there is a difference here. A subtle one, and one I didn't think of for a very long time. What if `a`, `b` and `c`,
are
not all of the same type?

Just a couple of days ago, I had a different idea. What if I make `any_of` to be a class template, that holds the values
I want to compare, and implements an `operator==`? This would be sort of like the first example solution, but inside
out.

```cpp
template <typename ... T>
class any_of : std::tuple<T...>
{
public:
    using std::tuple<T...>::tuple;
    template <typename U>
    constexpr bool operator==(const U& u) const {
        return std::apply([&](const auto& ... a) { return ((a == u) || ...);},
                          get());
    }
    template <typename U>
    friend constexpr bool operator==(const U& u, const any_of& a)
    {
        return a == u;
    }
private:
    constexpr const std::tuple<T...> get() const { return *this;}
};

template <typename ... T>
any_of(T&& ...) -> any_of<T...>;
```

I'll walk you through the code.

First, `any_of<T...>` inherits privately from `std::tuple<T...>`, and on line 5 we say that we have all the constructors
that `tuple` does.

Lines 6-10 implements `operator==`, that can be called with any type. `std::apply`, on line 8, calls a function (first
parameter) with the individual values from a `tuple` (2nd parameter). The function is a lambda that can take any number
of
arguments, and compare them with the reference captured u, as explained above for the `is<T>::any_of()` function
template, and the 2nd parameter is the `tuple` that `any_of` inherits from (as given by the private `get()` member
function
on line 17.)

The one thing missing now is that it is not obvious for the compiler what the types `T` are. It cannot deduce them
automatically, so we need to help it. The deduction guide on lines 20-21 takes care of that. It say if we call
`any_of(a,b,c)`, it will deduce the `T`s from the types of `a`, `b` and `c`. l-values will be deduced to l-value
references, and r-values
will be moved into the tuple.

This is enough to make it work. A call can now be made as:

```cpp
if (any_of{a,b,c} == x)...
```

This is nice! A little bit Yoda-like grammar, but the friend `operator==` on lines 11-15 allows comparison with the
arguments in the reversed order, like:

```cpp
if (x == any_of{a,b,c})...
```

This is all and well. But since this can be used with any types for which the comparisons make sense, why not expand it
to other operators too, and implement `all_of` and `none_of`? Why not allow an assertion like the following?:

```cpp
assert(all_of(a,b,c,d) > " ");
```

This of course requires that `a`, `b`, `c` and `d` are all greater-than comparable with a c-string.

I think this is neat. It reads nicely, and is not very difficult to understand.

If you want to have a look at code generation, please toy with this link
to [gcc.godbolt.org](https://gcc.godbolt.org/#z:OYLghAFBqd5QCxAYwPYBMCmBRdBLAF1QCcAaPECAKxAEZSAbAQwDtRkBSAJgCFufSAZ1QBXYskwgA5NwDMeFsgYisAag6yAwiIJ4GhAJ4bsHAAwBBOQqUrM6rUwbAShBAFtjZy13mLlajU0CAwAHTAB9AmImQkFPCys/W3tNJmJoo1kTBJ9rfztAghEQhkx4718bAK0AMxFFXVQWR3LEqoKtQSiFYFbcpOrNLuIe8IA3PEwAdz7K/JTkJkFBTGICWbzkwOi2TAB6Mdk9xwYAOgQQkNaLEUEe1Wa3TEEQpglVLvQQEH0CVcc4rI%2BBY/m4Skw/ilgmFHnYACrlJRLQSqPBxBIAdmB5hCIgARvpkCAvKpSao0CwupgAB4hYiowQQOGqAjhACUqhALIgn2%2BblQY0wEFZbI5HCx4oAIiSyaDwZDCqFMLDVKc1aoAKrlMnkppU2n0pg6VCqVgGcKoGoQDW6ynrLgANlV6pEHIpXXUWNUxEwRWILFUUAI9mlsklqldns04s0ztObI0PE90osOrlzAVWmhyqYTzjmu1ZPdfwNpuNDyaEUt1ttXW4TrVpwjbr1wfFSZ9foDEDAsDbYY04cjMZjcdFieTXjpeDGEMkMtJzPWQK8UsTq9yNVUpi86bnUKVKoRWS8aKZ9frLI5AFpjAzAseTCuQZgwRmOkFD7n4eUzwjHVeqi3lk95aP%2BDqeM%2BFTKvgNReEaRCqGMtAhgyECyGypxmhaVr0FwpAAKwJlBCEmmMXCoWeGFYSw5rVvQsiEcR2KkUhsiUYy1EsJWOEQHhTHrhYrFjAALBx6GYdxLBVrhpCMURgmWC%2Bb77oqMLfvmj5eEiyymrROGch8BBfCARQlGUYGNq0EoWLiBJ4ESC4RncbBGSZZmlA%2BVlZN8HkWdiaavvKH7ZiqWonqmRatjSdKqHiqCoAwqioGE0REMQg6DhAxYFgBkY5e2Tk6p2YgBryIBMJcDAGBAHAEXwjp1ZK2WtmWRCXo2ppil6JX%2BoGEBMCGg7NlGo6NsxUqkEVOozbNs3AL6EDjlBOprpFpJ7pmn7qXm4XZOYOo1CMMG1iWsXxYlyWpRCJCZWGLV2rlToiKQp16XRcEAUwCbrZ6AVzb1AaDXdQ6KatGIpgdspBe%2BB47XYe1OcWMX0hdSUpf86W9llOVanlLaPYVv3Fb6pVud8lUlDVdUNRBBHNTlpEdeq31/d6pN9VAg3Y2GI0XgB43rhDU3E3NYvzYty3/aSa1QxtMOqVmX67YWpJHZMLDoKdKNxQl6PXVjYA461ePPa9jP6Zal7fU5RNyzNgOmqoPOgytZKy4FKlbaFGmI79yOlmjV2Y7dWgPR6psjQVNn2yTXbkxVVXU/VF70%2BHwZMwLLPdR2HPdgNKR8xi0bF2OQuSiLsfi9XpILQQS0Tb9HvQ17IXKwjquqOrJ0B%2BdevB2lofYOnT0RubrXYVbX0/fbdti47wNaBGYPuxDTmbW38MFhF9u96j/cY4PGVaMbj2R/lrVzwDecJ5T1W1SnjVp4zxrM02rPtuz8dcykw3DsXY01QTWFtNGu4s64NxXjLNev0N5wxzCrHeh1jqa21oHA%2BBsh6nwjpeF6b1J6fSdDbJuMd5430XtGXmIgoGTlgQrb27dt77R1HvXWl1D43WPsPXGuCCYeivrNR25U77J1pk1EemcGzZzZo7H%2Bd5/4l1jILFcIDRZgLFhAqWtsYH2zgWpBBHckFkm7qg1hQcOHpUCCPc%2B49HoEOtjPcG0sHbkPsNgZebtoGQ09sFeBYVO5mIwSHLh2Dgznz4W2Uh1947CKTg/MRz8J6vyzu/HOX8yZyJPFQ7qiiy4qIrqA9REt65aISKYAAnNo7xLdfH6P8UYtWKCtaBPYZg4%2BlCGYm1wbYj09jp7aOcXHMmi8nyu2cbLacs4/jEn9tFUsOVyp%2BS8mqO8mi3qf0dgAKgIAgNE5dVxrygruehm8DGaURMwXSUkZKGUWcUTylkVk7ztnZQkMz7a3HuHc8yyzTjGF8vc/y68Tl%2BN9gEuZfdWnBJBtY3h6yomCJvrEqm8TU6dLsckqRqSZE317Jk0MQ4cmAPjOXSuRSwGaMbrPHRPjYZ1LBQ0ruTS0GQv1tCgc90eF5R6cGa5OEHEDMKQvIaVCaHN3lq3UFiDmFRTtDrcxbSXawvxvCwZZIhHGQpnEmmaKJGYvzB/HquLYDcyNtk9QjUUnAIKWo8lOpKVippTUulSst5%2B3tiY5pEL95QqPkqrlZs3p8qnkQxxq81WkmFSDDx4ynUStqa6s57qWHerYWyo%2BViA1R0vgilxMTNWJxRTqp%2B6Len6s6oa3O8c8UF0CEXXJyi%2BCqKrna%2B1ksqXg2qfGl120k2d09Syn16bOHGGVYGnKwbCFdUFbaqNS9qGeNobokF9LpVI1TQq9lHSx3ZsJrmoZfVkX32LXTUtGdy3SI2cazJHT63EutWS1tGj22Oq7SyFdib6kysaRrL1cr0G%2BpHVks9o88ETp4iG6dJCI3pL6hQv%2Br7gWStXYY79g600DyA9wrpKro4wY1SZERqKS16vaikrqOLq0mrcXe0ujbJqFKfQ6xd4r33Ic/QytDA6WnDssWHLNYHWqToFdBoVrj5GIboex3tX713/tZZhvjoyd0Xz3fhpFBaiMnvES/MjWKKNXqo5k0ZtGlFANJYx1tzHY1vr0Rxtdv1uMbqCRmk%2BnKcPjqExBqdxDqXqfjiMhDLGdGTLnO8lN8n6QLILUsx5fyQJrLw7BgM2zdmAibZDNcRzlIJpkxpTqWkLA6RRCcAyXJvkPM0HCby%2B0Xn4jeU5T5rkKsWSqzVgFPzF12byw53eznAN8YJSpiJf0xP5sI9qx%2Bp7SOoDfgZo139a0csJRaiCVqLO2qYy%2B4LtmP09dQ05JzkWMMWNDkNgTPLTQMAYPy/ponZ3ieWzGqpSHcs%2B16xF/UCnTvEH9R53d/D93qo0xNotU2dNJL0watJsiC4u1M3kjLj6n3FMgTt17Pb3sHcc8ynjimSB/bPt0/B13buhpnS25LTt4cLpsxjxW%2B2mFya%2B0O/H7ThuqrG2TI9ojdW6dm%2BRytVOb180tVih9lm7XWZe1Jt7jDk3GNx/13jQ8VOXdK5B3zTiudwcLrTmXy7pNY6Z7M47m7XPboEyNgRebueacmwkkDkjoeUYyUt29w4xeI4Y5tqz226ey8x/L/tSuzcuaw6E0D6vSea7DdA/zwzf6ivR4HhnxuFekjxz90dVvOcPfG1qsHjuZtzaF7DkZou1vi425TrbJSO2r120b4PjKjss5O20zN/3BN2Jjz5uPo38%2BJ4kynw3cu3XgrDwNrB7mie4ZzQnw99ui988hwL/TZeb7Gb/mKL39Hm0o7mtLkhTfx99tb6H9v5ugOW%2B79Hm7seKdkIC24oLAecQjCmfOU37fovuUBb8qspLKqlTqlnsvkgcqGNiKuDlkHlvAVuUAQueHvkAkBHePYnFpBNiN1sbggTvJOsgVXmOGgSBMJpgVktgXtrgeqIVuYBrlaOBG/DeOgX3oARQTAXQeWEwChMNOxNGvYliPxARFlixFwRRMNAITwAxIRFKCKuGLIIpKxEwHwbzMJoIaQPhMIRDHIaoAoSRFwWJLwToWoVIXJDIYcqIYhEwARKhPQe2EIbIfDnoZYSaEwE6EYfDnYeofJCIRwTgYwrQQoPoNJG1CaJgAAI4iAAhMhXgHLOKOw6oDhpySKXjUgw43zUg6HLgZaKSyzwTljEA8G8w7ALSCDfCHAUyWxWj2EaHmEVyqARFREMCcSlKcGITEDiHFGsClHlGyCVEfS1TeF1GvSNHREYRUqngsDBhWh/7fDDA9CXiCD0BvTlTzFsCLFcAcjcQ0gSAhDrCYjOLIirD1z0E8j0CCCbE6HcBcDXGCBjAN6RpIq0CnClBsA7JLQWpJgXEvHKjADvFUp7B7CPEBasFYhLFCA3HaHRrXG3FjC5EQxSBsiMDSAERSCkAsDSCmBomoDSDRi8D8AfCiDiAFA%2BC0BokECYmIlIkICYBMBYDECUBIkADWIAIkIkpwBEIkDoBEGIBEsgBEpgDotABEDojEDA0gIkaJGJUgWJpAOJUgaJZRpgpAFJMpiJpAcAsASAaAYIegqw5AlAOpIQepDJSIbADopgypNQegfwxAZREAeIlJpAeICgaQBg0gZJpAOpTwUxAA8iwNVE6VgG4N0aUEGXgD6MgLoIKGUWqaQDSJgMgDoJIFIJ6QoH8OKXGd0G4JSUicwGwCgPwPwIwHgHiGUbALCCACUc8IcKQIKAyVEPUEyaKHKXsXgHqNINeL6exNeJ8IOJwPibwLQBiEBDUNxNeDsZgG2XqIqUSRIHQHmSiVKU6fKdSAABwOjXgOhiRmnACqAOinCmCHmBi4CEAkAWqyDLGaCoC6mlD0hyC0Ach4kNQ8Dkm5kanak3nGl3kGktS3mrAoAMC0DlLhDbmkDWkMC2n2mOlxkunNDEDumplonenKgED%2BmBlxnBmhkpmyn4CRnRnPBOkJlJnTJIXkBTGYCZmynZnvn5nsBFm8AlllnwBIkpSNCUjSB7C8gDkvm0CSlCBzmSCPnIlSConokrnSDrmbnbmqAACyAAygAGqxjAWqBcCmDDmqAABKcIAA6iefgOlBeVeV%2BSaReZcc%2BfwG%2BWqS2TSXSQBUtKQCyVwM8XySJGuWubIKYBiOUrQBubINySJfxdKbKfKYqSAMqaqViUiZqYgCgKZT%2BRQH%2Bd%2BQBcABiPQBBVBZQDBbKXBW6R6chTeT6WhQGYhbha%2BNheGfhTOIRXGcRcmQVeRRmU6TRTZYwN0YWYOQIPoMxRWd%2BFWd0TWYxPWaZMQE2S2Wxe2RxVIL2cZP2QxVISOV2exKOeOZOdOZSLOWIPOcJZmWJSFdiZJRuVuWJMAMgMgKoBiKcChBAKeUZQ%2Ba9Nef%2BfeT4BhKoJZbwNZdFcySALILIKcL5WuZycKRiBpeUmuaYGKRKcuXGWFUIBFSqbmYuVIFwDDaFdIF9VSXWasHcE0KyUAA%3D%3D%3D).
Spoiler - the compilers see through it all and generates amazingly efficient code.

If you want to try it in your own code, clone it from [github.com](https://github.com/rollbear/dry-comparisons).
