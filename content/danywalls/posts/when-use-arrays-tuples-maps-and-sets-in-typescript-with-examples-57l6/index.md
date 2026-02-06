---
{
title: "When Use Arrays, Tuples, Maps, and Sets In Typescript with Examples",
published: "2023-08-14T15:52:32Z",
edited: "2023-08-15T14:26:38Z",
tags: ["typescript", "javascript", "frontend"],
description: "A few days ago, a friend asked how to prevent duplicate keys in an array, and I told him there are...",
originalLink: "https://dev.to/this-is-learning/when-use-arrays-tuples-maps-and-sets-in-typescript-with-examples-57l6",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

A few days ago, a friend asked how to prevent duplicate keys in an array, and I told him there are other collections to work with, and each one is suited for a specific situation. Because I love the NBA, I tried to find an easy way to explain each data structure using the context of basketball.

In the basketball is all about strategy, and using the right players at the right time can make all the difference. So the choice of data structures—arrays, tuples, maps, and sets—can greatly influence the game. Let's dive into each one to understand when to use them, when not to use them, or their disadvantages.

Let's start:

### **Arrays**

Arrays are like a team roster, containing a list of players. It can change over time, adding or removing players as needed.

> Read the more about [Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

**Example:**\
A list of players drafted for the upcoming season.

```typescript
let teamRoster: string[] = ["LeBron James", "Stephen Curry", "Kevin Durant"];
```

**Advantages:**

- Dynamically sized.

- Players (elements) can be accessed directly using their position (index).

**Disadvantages:**

- Lacks strict type checks across positions.

**When to Use:**

- When you have a list of similar items, like all point guards or all rookies.

**When to Avoid:**

- Fixed-size collections or varied data types.

### **Tuples**

Tuples are like specifying exact players for specific positions; each position is predefined.

> Learn more about [Tuples](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)

**Example:** A fixed starting lineup, where positions and players are predefined.

```typescript
let startingLineup: [string, string, string, string, string] = ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"];
```

**Advantages:**

- Strict structure for fixed-size data.

- Each position (index) has a specific type.

**Disadvantages:**

- Not flexible; can't easily change the lineup size.

**When to Use:**

- When positions and players are fixed, such as a specific game's starting five.

**When to Avoid:**

- Variable roster sizes or changing lineups.

### **Maps**

Maps are like a team’s jersey numbers. Each player (value) has a unique jersey number (key).

> Learn more about [Maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

**Example:** Associating each player with their jersey number.

```typescript
let jerseyNumbers = new Map<string, number>();
jerseyNumbers.set("LeBron James", 6);
jerseyNumbers.set("Stephen Curry", 30);
```

**Advantages:**

- We can have any key and Value

- Keeps the insertion order.

**Disadvantages:**

- It might be overkill for simple key-value associations.

**When to Use:**

- When associating players with stats, awards, or any specific data.

**When to Avoid:**

- Simple lists or when an object might suffice.

### **Sets**

Sets are like All-Star game rosters. No player is picked twice; everyone is unique.

> Learn more about [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

**Example:** A set of players selected for the All-Star game.

```typescript
let allStars = new Set<string>();
allStars.add("LeBron James");
allStars.add("LeBron James");  // He's already an All-Star!
```

**Advantages:**

- Ensures uniqueness.

- Quick membership checks.

**Disadvantages:**

- No key-value associations.

**When to Use:**

- Unique collections like Hall of Fame inductees or MVP winners.

**When to Avoid:**

- When duplicates are acceptable or key-value pairings are needed.

### **Conclusion**

In conclusion, TypeScript provides a variety of data structures, each with pros and cons. Our job is to identify the strengths and potential of each one. I hope these examples make it easy to know when to choose or avoid a structure and help in making decisions and selecting the most appropriate data structure for each specific situation.
