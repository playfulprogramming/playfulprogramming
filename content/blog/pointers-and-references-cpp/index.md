---
{
    title: 'Pointers and References in C/C++',
    description: 'An overview of how pointers and references function in C/C++',
    published: '2020-06-02T09:40:00.000Z',
    authors: ['seanmiller'],
    tags: ['computer science', 'cpp'],
    attached: [],
    license: 'cc-by-nc-nd-4'
}
---

Every new C/C++ programmer will eventually reach the point at which they are forced to work with pointers and will undoubtedly realize that they extremely dislike using them because they are a little complex. Today, we'll be looking at what pointers are, deconstructing their usage, and hopefully, making the usage of pointers easier to grok.

# What is a Pointer? {#what-is-a-pointer}

A pointer is simply a variable or object that instead of holding a value, holds a memory address to another spot in memory. You will commonly see a pointer being most recognizable by their declaration including the **\*** operator, also known as the **dereference operator**. This operator is called the dereference operator because when you try to access the value that the pointer is referencing, you have to use the **\*** operator to "de-reference" the value. Which is just a fancy way of saying, "go to that reference".

Here's an example:

```cpp
	// Defines int variable num
	int num = 12;

	// Declares pointer p
	// Ignore the '&' symbol here, we'll discuss that next
	int *p = &num;

	// Prints out the memory address that p is pointing to
	cout << p << endl;

	// Prints out the memory address of num
	// Again ignore the '&' symbol here, we'll discuss that next
	cout << &num << endl;

	// Dereferences the pointer p
	cout << *p << endl;

	// Prints out the value num
	cout << num << endl;
```

This should print out something like...

```
	0xffffcc14
	0xffffcc14
	12
	12
```

As you can see, the pointer p holds the memory address of num, and when you use the dereference operator, the value at num is printed out.

Pointers can also get a lot more complex and must be used in certain situations. For example, if you put an object on the heap (Check out my article on Virtual Memory to learn more about heap memory) then you will have to use a pointer because you can't access the heap directly. So, instead of having a pointer to an address on the stack, it will point to an address on the heap. You might even find yourself using double or triple pointers as you get more used to them.

# What is a Reference? {#what-is-a-reference}

In simple terms, a reference is simply the address of whatever you're passing. The difference between a pointer and a reference lies in the fact that a reference is simply the **address** to where a value is being stored and a pointer is simply a variable that has it's own address as well as the address it’s pointing to. I like to consider the **&** operator the "reference operator" even though I'm pretty sure that's not actually what it is called. I used this operator in the last example, and it's pretty straightforward.

```cpp
	int num = 12;
	int *val = &num;
	int **doublePointer = &val;

	cout << "Address of num: " << &num << endl;
	cout << "Value of val" << val << endl;
	
	// Pointers have memory addresses too!
	cout << "Address of val" << &val << endl;
	
	// Prints out every phase of the double pointer
	cout << &doublePointer << " : " << doublePointer << " : ";

	cout << *doublePointer << " : " << **doublePointer << endl;
```

The output will look something like this...

```
	Address of num: 0xffffcc1c
	Value of val: 0xffffcc1c
	Address of val: 0xffffcc10
	0xffffcc08 : 0xffffcc10 : 0xffffcc1c : 12
```

As you can see, all the **&** operator does is gives you the memory address at its specific spot in memory. I also included a small example of a double-pointer which just contains one more layer of abstraction then a single pointer. You can see how the memory addresses line up in the output.

Here’s what this looks like in memory with more easily understandable addresses in a “0x…” format.

**![Memory Example](./memory.png)**

# Pass by Reference vs. Pass by Value {#passing}

This is another more complex topic that we as programmers need to be aware of in almost all languages - even languages without pointers. The idea of the two all stems from functions, sometimes called methods, and their parameters. Whenever you pass something into a function, does the original variable/object that is passed in get updated inside as well as outside the function, or is it hyperlocal and it just creates a copy of the original parameter? "Pass by reference" refers to when the parameter is changed both within the function and outside of it. "Pass by value" refers to when the parameters are merely a copy and have their own memory address, only being updated inside of the function.

The primary difference between the two is what happens when you change values. If you pass by reference and update the property, it will update the original variable that was passed as well. However, if you pass by value and update it in the function, it will not impact the original variable.

The neat part of C++ is that you can control whether something is passed by reference or passed by value, but rather than try and explain it further let's look at an example.

```cpp
	// Pass by reference
	void passByReference(int &num) {
		num += 2;
	}
	  
	// Pass by value
	void passByValue(int num) {
		num += 2;
	}	  

	int main() {
	
		int num1 = 0;
		int num2 = 0;
		cout << "Original value: " << num1 << endl;

		// call passByReference()
		passByReference(num1);

		cout << "After passing by reference: " << num1 << endl;
		
		// call passByValue()
		passByValue(num2);

		cout << "After passing by value: " << num2 << endl;
		
	}
```

The output of this looks like...

```
	Original value: 0
	After passing by reference: 2
	After passing by value: 0
```

As you can see, when passed by reference, the local value is changed, but when it is passed by value, it is not; even though they both perform the same operation. Some other languages, such as Java, do not give you this control. Java always passes by value, though it does pass addresses by value.

This gets confusing after a while if you're not paying attention to your outputs. In fact, Python gets even more confusing, but that's a topic for another day; be sure to sign up for our newsletter to see when that lands 😉

# Review/Conclusion {#conclusion}

Pointers and References are extremely important in your day to day work in languages like C/C++. C++ gives you a lot of manual control with the most common being memory. Knowing how each one of your pointers or variables are stored will help you write code faster and more efficiently. Knowing also how parameters are passed to your functions as well as how they are updated, will make your life **so** much easier.
