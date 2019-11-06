


Computers - on a very low level - are built upon binary (ones and zeros). Think about that - all of the text you're reading on your screen started life as either a one or a zero in some form. That's incredible! How can it turn something so simple into a sprawling sheet of characters that you can read on your device? Let's find out together! 

## Decimal

When you or I count, we typically use 10 numbers in some variation of combination to do so: `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, and `9`.

When you count to `10`, you're really using a combination of `1` and `0` in order to construct a larger number that we cognizantly recognize. The number `10` persists in our minds even when we have it written out; **ten**.



  ![An image showcasing the symbols for decimal with one and zero highlighted to make up the number "10"](./introduction_to_symbols.svg)



Knowing that we can separate the number from our thoughts allows us to categorize the number in a further manor, breaking it down into smaller groupings mentally. For example, if we take the number `34`, for example, we can break it down into three groups: the _ones_, the _tens_, and the _hundreds_.

![A "0" in the hundreds column, a "3" in the tens column, a "4" in the ones column which drop down to show "30 + 4" which equals 34](./base_10_34_.svg)

For the number `34`, we break it down into: `0` _hundreds_, `3` _tens_, and `4` _ones_. We can then multiply the higher number with the lower number (the column they're on) to get the numbers **`30`** (`3` _tens_) and **`4`** (`4` _ones_). Finally, we add the sum of them together to make the number we all know and love: **`34`**.

This breakdown showcases a limitation with having 10 symbols to represent numbers; with only a single column, the highest number we can represent is _`9`_.
Remember that the number **`10`** is a combination of **`0`** and **`1`**? That's due to this limitation. Likewise - with two columns - the highest number we can represent is _`99`_

## Binary

Now this may seem rather simplistic, but it's important to demonstrate this to understand binary. Our numerical system is known as the _base 10 system_. **Called such because there are 10 symbols used to construct all other numbers** (once again, that's: `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, and `9`).
Binary, on the other hand, is _base two_. **This means that there are only two symbols that exist in this numerical system.**

> For the latin enthusiasts, binary comes from "binarius" meaning "two together". *Deca*, meaning 10, is where "decimal" comes from

Instead of using numbers, which can get very confusing very quickly while learning for the first time, let's use **`X`**s and **`O`**s as our two symbols for our first few examples. _An **`X`** represents if a number is present and we should add it to the final sum_, _an **`O`** means that the number is not present and we should not add it_.
Take the following example:

![A "X" on the two column and a "X" on the ones column which add together to make 3](./base_2 _3_symbols.svg)

In this example, both `1` and `2` are present, so we add them together to make **`3`**. You'll see that since we can only have a value present or not present — because we only have two symbols in binary — this conversion has less steps than using decimal. For example, if you only wanted the number two, you could simply mark the `1` as "not present" using the **`O`**

![A "X" on the two column and an "O" on the ones column which add together to make 2](./base_2_2_symbols.svg)

You can even replace the two symbols with `1` and `0` to get the actual binary number of `10` in order to represent `2`

![A "1" on the two column and an "0" on the ones column which add together to make 2](./base_2_2.svg)

So how does this play out when trying to represent the number **`50`** in binary?

![The binary number "110010" which shows 32, 64, and 2 to combine together to make 50. See the below explaination for more](./base_2_50.svg)

As you can see, we create columns that are exponents of the number `2` for similar reasons as exponents of `10`; You can't represent `4`, `8`, `16`, or `32` without creating a new column otherwise. 

> Remember, in this system a number can only be present or not, there is no _`2`_. Because of this, without the **`4`** column, there can only be a `1` and a `2`, which makes up **`3`**. Continuing on with this pattern: without an **`8`** column, you can only have a `4`, `2`, and `1` which would yeild you **`7`**.

Once each of these exponents is laid out, we can start adding 1s where we have the minimum amount of value. EG: 
Is `64` less than or equal to `59`? No. That's a **`0`**
Is `32 <= 50`? Yes, therefore that's a **`1`**
`50 - 32 = 18`
Moving down the list, is `16 <= 18`? Yes, that's a **`1`** 
`18 - 16 = 2`
Is `8 <= 2`? No, that's a **`0`** 
`4 <= 2`? No, that's a **`0`** as well 
`2 <= 2`? Yes, that's a **`1`** 
`2 - 2` is **`0`**. That means every number afterwards (in this case only `1` is left) is not present, therefore is a **`0`**. 

Add up all those numbers: 
`64`: **`0`**
`32`: **`1`**
`16`: **`1`**
` 8`: **`0`**
` 4`: **`0`**
` 2`: **`1`**
` 1`: **`0`**

And voilà, you have the binary representation of `50`: **`0110010`**

> Author's note:
>
> While there are plenty of ways to find the binary representation of a decimal number, this example uses a "greedy" alogrithm. I find this algorithm to flow the best with learning of the binary number system, but it's not the only way (or even the best way, oftentimes).

## Hexadecimal

But binary isn't the only non-deciamal system. You're able to reflect any numerical base so long as you have the correct number of symbols for that system. Let's look at another example of a non-decimal system: _Hexadecimal_.

Hexadecimal is the base 16 number system.

>  _Hexa_ meaning "six" in Latin, _deca_ meaning "ten", combining to mean "sixteen".

Now you may wonder how you can count to 16 in a single column when we only use 10 numbers. The answer, to many developers, is to fill the remaining last 6 with other symbols: letters.

`0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `A`, `B`, `C`, `D`, `E`, `F`

These are the symbols that makeup the hexadecimal numerical systems for many devs. _`A`_, in this case, represents the number **`10`**. _`F`_ being the number **`15`**. In this numerical system, there are the _sixteens_, the _two-hundred fifty sixs_ (gathered by multiplying 16 by itself — 16 ^ 2), and other exponents of 16.

Given this information, how 

![img](./base_16_50.svg)






## Applications

### CSS Colors

Funnily enough, if you've used a HEX value in HTML and CSS, you may already be loosely familiar with a similar scenario. 


### Text Encoding