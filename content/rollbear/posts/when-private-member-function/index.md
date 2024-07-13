---
{
  title: "When private member function?",
  published: "2023-12-12",
  edited: "2023-12-12",
  tags: [ 'cpp', 'opinion' ],
  originalLink: "https://playfulprogramming.blogspot.com/2023/12/when-private-member-function.html"
}
---

I've seen this a few times too many recently, and need to get it off my chest.

Ponder a class that has a private member function. The function does not touch any member variables nor does it call any
member functions.

In my opinion, there are three possible situations here:

1. The function is completely generic. Nothing it does is specific to the class.
2. The function is specific to the problem domain of the class, but it not otherwise dependent on it.
3. The function uses types that are private to the class.

In case of 1, talk to your colleagues. Say that you need this generic function. Fight^H^H^H^H^HArgue about its name,
what
it does, and where it belongs. That's good. It increases understanding in your team. Do **not** make it a member.

In case of 2, make it a free function, in anonymous namespace, in the .cpp file for the class. It's a detail of how
things are done, and no user of the class needs no know.

For 3, it may be the right thing to make it a private static member, but it may also be right to make it a function
template. Discuss with your colleagues.

These are not do or die issues, but small things that makes the daily a little better for yourself and your colleagues.

If the function is completely generic, making it available for others saves them the work of replicating it. This, of
course, requires that they know about its existence, hence the discussion about where it belongs, what it should be
called, and what it's signature should be.

If the function can be squirreled away in the .cpp file, it reduces the visibility. At the very least it shortens the
build times, since users of the class won't have to spend the build time parsing the signature, but more importantly
it's a compartmentalization of the signature. If you need to make a change to how the function is called, it's an
internal matter for the implementation of that class, no other files will need to be recompiled.

In my experience the 3rd case is much rarer, but also much more worthy of discussion. Make use of the opportunity to
share with, and learn from, your colleagues.

And, most important of all, go through this list above before writing the function. There is no need to write the
private member function first and then argue that it shouldn't be there.
