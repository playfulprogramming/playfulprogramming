---
{
    title: "Doomsday Rule",
    description: 'In this blog I talk about the Doomsday Rule, how it works, how to put it into code then how to make a program that tests you.',
    published: '2022-02-10T22:12:03.284Z',
    authors: ['SkyHawk_0'],
    tags: ['python', 'math'],
    attached: [],
    license: 'cc-by-4'
}
---

# What is the doomsday rule?

Before I get to how my program works, I should probably explain what the doomsday rule is. The doomsday rule is an algorithm that determines the day of the week for a given date in the Gregorian calendar. For example, without looking at a calendar, I know that the 18th of March, 1898 is a Friday. I can't think when you would use this in everyday life, but it's a cool party trick to show off with.

The algorithm was invented by John Conway in 1973. You may know some of his work, like Conway's game of life. Here's a nice little fact: the dates that Conway was born and died on were both doomsdays. We'll explain what doomsdays are later. The algorithm is simple enough that it can be calculated mentally. Conway could do this in a couple of seconds, and to improve his speed, he created a program that gave him ten random dates every time he logged on to his computer.

# things you should know before the numbers

I gathered this information from the [Wikipedia page, which can be found here](https://en.wikipedia.org/wiki/Doomsday_rule).

## What is MOD?

If you didn't know already, when you get the MOD of something, you divide the first number by the second number, but the answer is the remainder. For example, 70 MOD 12 is 10, as 70 / 12 is 5 with a remainder of 10.

## The days of the week

The days of the week have numbers, I have put ways of remembering them in brackets:

```
0 = Sunday (Noneday)  
1 = Monday (Oneday)  
2 = Tuesday (Twosday)  
3 = Wednesday (Treblesday)  
4 = Thursday (Foursday)  
5 = Friday (Fiveday)  
6 = Saturday (Six-a-day)  
```

This makes it very easy to add numbers to them.

## Anchor Days

The Wikipedia page doesn't actually explain what an anchor day actually is, but it helps work out what the doomsday is for that year.

## Doomsdays

The rule is called Doomsday Rule for a reason; that reason is it relies on days that are called doomsdays.

I have mentioned these a lot, but what are they? They are dates of a year that fall on the same day of the week.

For examples of this, let's use the 18th of March 1898 for reference. To start, let's note that all of the following dates fall on a Monday:

- 4th of April
- 6th of June
- 8th of August
- 10th of October
- 12th of December

There is one for every month, but I have only listed the 4th, 6th, 8th, 10th, and 12th months; This leaves January, February, March, May, July, September, and November, or the 1st, 2nd, 3rd, 5th, 7th, 9th and 11th month. I say the numbers and will from now on as it helps with the calculations later on.

For the 1st month, it depends if it's a leap year or not. To work this out, you divide the year by 4, and if it is a whole number, it's a leap year. So if it's a leap year, it's the 4th; if it's not, it's the 3rd. An easy way of remembering this is if it's the fourth year (so a leap year), it's the 4th. So for the 18th of March 1898, as 1898 is not divisible by 4. Because of this, the doomsday in January is the 3rd.

For the 2nd month, it also depends if it's a leap year; this time, the doomsday is always the last day of the month. So if it were a leap year, it would be the 29th, but if it weren't, it would be the 28th. So like in the paragraph above, because 1898 is not divisible by 4, the doomsday in February is the 28th.

For the 3rd month, the doomsday is Pi day. Yep, Pi day is a doomsday. So using the example, Pi day is a Monday for the 18th of March 1898.

For the 5th month, the 9th is a doomsday. An easy way of remembering it is "working 9 to 5". This mnemonic has a second half to it, but that's for another month. As you may have noticed (if you write your dates with the month first then day, I'm British, so for me, it's day then month), the mnemonic is the wrong way round; this is because it works the other way round as well, for the 9th month the 5th is a doomsday.

Now it’s just the 7th month and the 11th month. This is where the rest of the mnemonic comes. For the 7th month, the 11th is a doomsday, and the same the other way, for the 11th month, the 7th is a doomsday. So the full mnemonic is "working 9 to 5, at 7-11"

List of all doomsdays (written is day/month):

- 3/1 or 4/1
- 28/2 or 29/2
- 14/3
- 4/4
- 5/9
- 6/6
- 7/11
- 8/8
- 9/5
- 10/10
- 11/7
- 12/12

## What about decimals?

You throw away the decimals; you don't round down as well, so, for example, the answer for 70 / 12 is 5.83, but for us, we only care about the whole number, so it would be 5.

# How does it work?

To explain how it works I will be using an example along with the explanation. I will be using the date Apollo 11 landed on the moon: July 20, 1969.

First, you get the anchor day for the century. The way you work this out is you get the first 2 digits of the year. Then do `5 × (century MOD 4) MOD 7 + Tuesday`.

So, for our example, `19 MOD 4` is 3; as a result, the calculation now looks like this:

`5 x 3 MOD 7 + Tuesday`

Because of BIDMAS, we do `5 x 3`, which gives us 15. Then get `15 MOD 7` - which is 1 - then add Tuesday (2) to our previous multiplication, giving us 3.

If we remember back to our date/number lookup chart, `3` is associated with Wednesday. So, from our calculation, we know that the anchor day for the 1900s is a Wednesday.

Now we need to find the years offset. We do this with three calculations, then adding the total together. I will label the first calculation "a", the second "b" and the third "c".

The calculations are:

```
a = (last two digits of the year) / 12

b = (last two digits of the year) MOD 12

c = b / 4
```

After these calculations, you finally do:

`a + b + c = offset`

Then you get the MOD of offset. Think of MOD as if you were to add 7 to Wednesday (3), then run MOD over that new number (10), you are back to Wednesday. (3)

So using the example you would do:

```
a = 69 / 12

a = 5

b = 69 MOD 12 

b = 9

c = 9 / 4

c = 2

So, 5 + 9 + 2 = 16
```

Then get the MOD which is, 2.

So we now know that the year offset is 2, and we know that the anchor day for the century is Wednesday, or 3. We add the two numbers together to get 5 and match that to our date chart, so for 1969, the doomsday is Friday.

Now we need to think about the closest doomsday to July 20th. Which is the 11th of July. So from the above calculation, we know that the 11th of July is a Friday. Then we work out the difference between the date we need to figure it and the doomsday, so here it would be `20 - 11 = 9`. Then we MOD this by 7 like we did to find the offset.

So this would be 2.

Then we add this to the doomsday. So `5 + 2 = 7`. But there isn't a 7 in our chart, but remember, `7 MOD 7` is 0. and 0 is Sunday. So we now know that the day of Apollo 11's landing was on a Sunday.

# The fun part, Coding!

## The Solver

I wrote the script using functions so that it would be easy to edit the code.

### Coding part 1 _The backbone of this project_

First, I thought it would be good to start with the harder bit, which is the actual solver; But what is the first part you need for the calculations? Inputs. Let's build a script to generate those inputs.

The script needs to output three inputs: a day, month, and year. We will call them their respective names, so it will look like this:

```python
day = int(input("What day do you want? (number needed) "))
month = int(input("What month do you want? (number needed) "))
year = int(input("What year do you want? "))
```

We put `int` there to tell the program that whatever the input is, it's an integer not a string.

Now we need the script to work out the anchor day for the century. Unfortunately, while I was making the script, whenever I tried to do the `century MOD 4` calculation, it would be incorrect. Luckily, Wikipedia has a different way of working out the anchor day, which is:

`5 * (Century MOD 4) MOD 7 + 2`

The way you work out the century is:

`year / 100`

Unless the year ended in 00, the output of this division would be a decimal, but we need a non-decimal number. To solve for this, we can write the following in our code:

`int(year / 100)`

So under the inputs we put:

```python
Century = int(year / 100)

anchor = 5 * (Century % 4) % 7 + 2
```

> The percentage sign (%) is python's MOD

The program now can get the anchor day. The next step is to work out the doomsday for the year. To do this, we must tell the program how to get the last 2 digits of the year. We'll tell the script to convert the year to a string, then tell it to get the 3rd and 4th character. That code looks like this:

```python
EndTwo = str(year)
EndTwo = EndTwo[2:4]
```

So going back to the a, b and c calculations they would look like this:

```python
A = int(int(EndTwo) / 12)

B = int(EndTwo) % 12

C = int(B / 4)
```

Then add them together and MOD the sum. After that you want to add the anchor. So in code this would look like:

```python
Doomsday = ((A + B + C) % 7) + anchor
```

Then just get the MOD of `Doomsday`:

```python
Doomsday = Doomsday % 7
```

So far the script looks like:

```python
day = int(input("What day do you want? (number needed) "))
month = int(input("What month do you want? (number needed) "))
year = int(input("What year do you want? "))

EndTwo = str(year)
EndTwo = EndTwo[2:4]

Century = int(year / 100)

anchor = 5 * (Century % 4) % 7 + 2

A = int(int(EndTwo) / 12)

B = int(EndTwo) % 12

C = int(B / 4)

Doomsday = ((A + B + C) % 7) + anchor

Doomsday = Doomsday % 7
```

Now we need the script to find the doomsday in the chosen month. But the script doesn't know what a doomsday is, so we will create a 2D list that contains the doomsday every month. We will put the list just after the inputs to keep the script structured. The list will be written as:

```python
DoomsdayList = [[4, 4], [6, 6], [8, 8], [10, 10], [12, 12], [9, 5], [5, 9], [14, 3], [7, 11], [11, 7], [4, 1], [29, 2]]
```

Now that the script knows what the doomsdays are, loop through all 12 items in the list. Then we can check if `month` is the same as `a` (declared in the loop). However, since it is a 2D list, we also need to tell it to look in the second column. As a result, the code looks like this:

```python
for a in range(len(DoomsdayList)):
    if DoomsdayList[a][1] == month:
        location = a
```

But this causes a problem; `DoomsdayList` has only the dates for a leap year. But what if it's not a leap year? We can solve this problem by adding an if statement after our check. This if statement should check if `year MOD 4` is greater than or equal to 1. If this statement is true, set the 10th item of the list to `[3, 1]` and the 11th item to `[28, 2]`.

```python
if year % 4 >= 1:
    DoomsdayList[10] = [3, 1]
    DoomsdayList[11] = [28, 2]
```

### Quick summary

Just summarizing what we have done so far, we have three inputs: year, month, and day. The script calculates the anchor day for the century. It gets the last two digits of the year then uses the a, b and c calculations. Once this is done, it adds them together, gets the MOD 7 of that then adds the anchor. Next, it receives the MOD 7 of that answer. The answer for the last MOD is the doomsday. We have a `DoomsdayList` which contains the doomsdays. We have an if statement that changes the 10th and 11th item if it's not a leap year. Then we have a loop that looks for the location of the doomsday in the picked month.

The code should look like this now:

```python
day = int(input("What day do you want? (number needed) "))
month = int(input("What month do you want? (number needed) "))
year = int(input("What year do you want? "))

DoomsdayList = [[4, 4], [6, 6], [8, 8], [10, 10], [12, 12], [9, 5], [5, 9], [14, 3], [7, 11], [11, 7], [4, 1], [29, 2]]

if year % 4 >= 1:
    DoomsdayList[10] = [3, 1]
    DoomsdayList[11] = [28, 2]

EndTwo = str(year)
EndTwo = EndTwo[2:4]

Century = int(year / 100)

anchor = 5 * (Century % 4) % 7 + 2

A = int(int(EndTwo) / 12)

B = int(EndTwo) % 12

C = int(B / 4)

Doomsday = ((A + B + C) % 7) + anchor

Doomsday = Doomsday % 7

for a in range(len(DoomsdayList)):
    if DoomsdayList[a][1] == month:
        location = a
```

### Coding part 2 _Doomsday and printing the right day of the week_

The most difficult bit is now done. Now, we only need to worry about the day of the month. After all, the script now knows the location of the closest doomsday. But this is only half true; we haven't told it to get the item in that location, which is luckily pretty easy to do:

```python
ClosestDoomsday = DoomsdayList[location]
```

Now we need the difference of day and `ClosestDoomsday[0]`, we put the zero there as that is the day of the month.

```python
difference = day - ClosestDoomsday[0]
```

After this we need to get MOD 7 of difference:

```python
difference = difference % 7
```

Then we can add `Doomsday` to `difference`:

```python
DayOfWeek = Doomsday + difference
```

after this we get MOD 7 of `DayOfWeek`:

```python
DayOfWeek = DayOfWeek % 7
```

Then we can just output the number:

```python
print("This date falls on a", DayOfWeek)
```

But this just would print out a number, so we will create another list called `weekList` we put this just above `DoomsdayList`:

```python
#            0         1         2          3            4           5         6
weekList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
```

Then we can change the output command to:

```python
print("This date falls on a", weekList[DayOfWeek])
```

Finally, the completed script should look like this:

```python
day = int(input("What day do you want? (number needed) "))
month = int(input("What month do you want? (number needed) "))
year = int(input("What year do you want? "))

#            0         1         2          3            4           5         6
weekList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

DoomsdayList = [[4, 4], [6, 6], [8, 8], [10, 10], [12, 12], [9, 5], [5, 9], [14, 3], [7, 11], [11, 7], [4, 1], [29, 2]]

if year % 4 >= 1:
    DoomsdayList[10] = [3, 1]
    DoomsdayList[11] = [28, 2]

EndTwo = str(year)
EndTwo = EndTwo[2:4]

Century = int(year / 100)

anchor = 5 * (Century % 4) % 7 + 2

A = int(int(EndTwo) / 12)

B = int(EndTwo) % 12

C = int(B / 4)

Doomsday = ((A + B + C) % 7) + anchor

Doomsday = Doomsday % 7

for a in range(len(DoomsdayList)):
    if DoomsdayList[a][1] == month:
        location = a

ClosestDoomsday = DoomsdayList[location]

difference = day - ClosestDoomsday[0]

difference = difference % 7

DayOfWeek = Doomsday + difference

DayOfWeek = DayOfWeek % 7

print("This date falls on a", weekList[DayOfWeek])
```

## The Tester

With the hardest bit now out of the way and put into functions, we can now relax. Make a new file but keep the old when as you can look back at it to see how it works and even modify it. We built it to be used to understand what our logic should do and can be used as a template for other programs that will use it: like the tester.

I built the tester using `randint` from the module `random`. This should be your first line of code:

```python
from random import randint
```

### Coding part 1: _The functions_

In the previous program, we made three inputs: Year, Month, Day. We still need to pass these to the doomsday program, but we need to do it randomly. To keep our code's structure, we will use functions.

#### Random Year

To get a random year, we will just make a function that has two arguments: `StartYear` and `EndYear`. These will be in a `randint` line:

```python
def randomYear(StartYear, EndYear):
    return randint(StartYear, EndYear)
```

So when ever `randomYear` is called it will pick a random number between `StartYear` and `EndYear`. This is only called once in the code but it keeps the code neat and you know what does what.

#### Random Month

`randomMonth` is the easiest out of the three. We don't need any arguments just a line that picks a random number between one and twelve. As there are 12 months in a year:

```python
def randomMonth():
    return randint(1, 12)
```

#### Random Day

`randomDay` is the hardest out of the three, as there 4 possibilities that can come out of the function. `31`, `30`, `29` and `28`

we need two arguments which will be the `month` and `Year`. We need the month to see how many days there are in the month. but if it's a leap year (That's why we need the year) and it is February we need to know if its 28 days or 29 days the code looks like this for starters:

```python
def randomDay(Month, Year):
    IsLeap = Year % 4 == 0

    if Month == 1 or Month == 3 or Month == 5 or Month == 7 or Month == 8 or Month == 10 or Month == 12:
        DaysInMonth = 31
    elif Month == 4 or Month == 6 or Month == 9 Month == 1:
        DaysIMonth = 30
    elif IsLeap == True and Month == 2:
        DaysInMonth = 29
    elif IsLeap == False and Month == 2:
        DaysInMonth = 28
```

After we have done this all we need to do is get a random number between 1 and `DaysInMonth`:

```python
Day = randint(1, DaysInMonth)
```

Then we just return `Day`:

```python
return Day
```

so altogther the `randomDay()` function should look like this:

```python
def randomDay(Month, Year):
    IsLeap = Year % 4 == 0

    if Month == 1 or Month == 3 or Month == 5 or Month == 7 or Month == 8 or Month == 10 or Month == 12:
        DaysInMonth = 31
    elif Month == 4 or Month == 6 or Month == 9 Month == 1:
        DaysIMonth = 30
    elif IsLeap == True and Month == 2:
        DaysInMonth = 29
    elif IsLeap == False and Month == 2:
        DaysInMonth = 28

    Day = randint(1, DaysInMonth)

    return Day
```

#### making the Finder a function

So now we have a random day, month and year. We can now make a function from The solver segment code, we need to change it slightly, like getting rid of the inputs and putting a `return` at the end. We will have three arguments and so we don't need to go through and change the variable names we will call them `day`, `month` and `year`. Then we need to put a `return` at the end that returns the day of the week.
As I have already talked about how this code works I will just give you the whole function:

```python
def Finder(day, month, year):
    #            0         1         2          3            4           5         6
    weekList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    DoomsdayList = [[4, 4], [6, 6], [8, 8], [10, 10], [12, 12], [9, 5], [5, 9], [14, 3], [7, 11], [11, 7], [4, 1], [29, 2]]

    if year % 4 >= 1:
        DoomsdayList[10] = (3, 1)
        DoomsdayList[11] = (28, 2)

    EndTwo = str(year)
    EndTwo = EndTwo[2:4]

    Ce = int(year / 100)

    anchor = 5 * (Ce % 4) % 7 + 2

    A = int(int(EndTwo) / 12)

    B = int(EndTwo) % 12

    C = int((int(EndTwo) % 12) / 4)

    Doomsday = ((A + B + C) % 7) + anchor

    Doomsday = Doomsday % 7

    for a in range(len(DoomsdayList)):
        if DoomsdayList[a][1] == month:
            location = a

    rightDoomsday = DoomsdayList[location]

    difference = day - rightDoomsday[0]

    difference = difference % 7

    DayOfWeek = Doomsday + difference

    DayOfWeek = DayOfWeek % 7

    return weekList[DayOfWeek]
```

### Coding Part 2 _Making the question code **almost there**_

We will start by making a variable called `questions`. This will simply just be to see how many questions the user wants:

```python
questions = int(input("How many questions? "))
```

then we will have a `for` loop that repeats for how many questions the user wants:

```python
for a in range(questions):
```

Until I say, all the code from now on will be inside this loop.

We want to get random `Year`, `Month` and `Day` first:

```python
    Year = randomYear(1800, 2200)
    Month = randomMonth()
    Day = randomDay(Month, Year)
```

So this will get a random year between 1800 and 2200, a random month, then a random day using the data from Month and Year.

We then want the code to figure out the correct day, this is easy as we have a function that we just built that does this:

```python
    DayOfWeek = Finder(Day, Month, Year)
```

So even before the question is asked the code already knows the answer.

Then we ask the user what the day is:

```python
    print(a+1, ". What day is ", Day, "/", Month, "/", Year, sep="", end="    ", flush=True)
```

This will show the question number (The `+1` is there as the loop starts on 0) then the date, then will add space for the input.

We then need to get the input. Very easy. We will then convert the string to uppercase so that if they put `Monday`, `monday` or `mOnday` it would just set it to `MONDAY`:

```python
    guess = input()
    guessUpper = guess.upper()
```

We also want to do this to the answer that the code got as well:

```python
    DayOfWeekUpper = DayOfWeek.upper()
```

Then we can find out if the user was right using a `if` statement:

```python
    if guessUpper == DayOfWeekUpper:
        Correct = True
    else:
        Correct = False
```

Then we need the code to do something if they got it right we can have another `if` statementL

```python
    if Correct:
        print("That is correct.")
        score += 1
    else:
        print("That is incorrect. The correct answer is", DayOfWeek)
```

Here we have used a variable called `score` which we haven't set anywhere so just above the `for` loop we will put:

```python
score = 0
```

We put it outside the loop as if it was in the loop it would set `score` back to zero, after each question so it would only be 1 or 0.

So now outside the `for` loop we will show the percentage of correct answers:

```python
print("Your percentage is", (score / questions) * 100)
```

And thats it! I will put the whole code here so that you can check errors and stuff:

# If you just want the code and don't care how it works, look here!

```python
from random import randint

def randomYear(StartYear, EndYear):
    return randint(StartYear, EndYear)

def randomMonth():
    return randint(1, 12)

def randomDay(Month, Year):
    IsLeap = Year % 4 == 0

    if Month == 1 or Month == 3 or Month == 5 or Month == 7 or Month == 8 or Month == 10 or Month == 12:
        DaysInMonth = 31
    elif Month == 4 or Month == 6 or Month == 9 Month == 1:
        DaysIMonth = 30
    elif IsLeap == True and Month == 2:
        DaysInMonth = 29
    elif IsLeap == False and Month == 2:
        DaysInMonth = 28

    Day = randint(1, DaysInMonth)

    return Day

def Finder(day, month, year):
    #            0         1         2          3            4           5         6
    weekList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    DoomsdayList = [[4, 4], [6, 6], [8, 8], [10, 10], [12, 12], [9, 5], [5, 9], [14, 3], [7, 11], [11, 7], [4, 1], [29, 2]]

    if year % 4 >= 1:
        DoomsdayList[10] = (3, 1)
        DoomsdayList[11] = (28, 2)

    EndTwo = str(year)
    EndTwo = EndTwo[2:4]

    Ce = int(year / 100)

    anchor = 5 * (Ce % 4) % 7 + 2

    A = int(int(EndTwo) / 12)

    B = int(EndTwo) % 12

    C = int((int(EndTwo) % 12) / 4)

    Doomsday = ((A + B + C) % 7) + anchor

    Doomsday = Doomsday % 7

    for a in range(len(DoomsdayList)):
        if DoomsdayList[a][1] == month:
            location = a

    rightDoomsday = DoomsdayList[location]

    difference = day - rightDoomsday[0]

    difference = difference % 7

    DayOfWeek = Doomsday + difference

    DayOfWeek = DayOfWeek % 7

    return weekList[DayOfWeek]

questions = int(input("How many questions? "))
score = 0
for a in range(questions):
    Year = randomYear(1800, 2200)
    Month = randomMonth()
    Day = randomDay(Month, Year)

    DayOfWeek = Finder(Day, Month, Year)

    print(a+1, ". What day is ", Day, "/", Month, "/", Year, sep="", end="    ", flush=True)

    guess = input()
    guessUpper = guess.upper()

    DayOfWeekUpper = DayOfWeek.upper()

    if guessUpper == DayOfWeekUpper:
        Correct = True
    else:
        Correct = False

    if Correct:
        print("That is correct.")
        score += 1
    else:
        print("That is incorrect. The correct answer is", DayOfWeek)

print("your percentage is", (score / questions) * 100)
```
