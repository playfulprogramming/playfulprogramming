---
{
	title: "Minecraft Data Pack Programming: Scoreboard Usage",
	description: "Learn data pack development in Minecraft - using player scoreboards, variables, and operations!",
	published: '2022-07-26T21:12:03.284Z',
	authors: ['fennifith'],
	tags: [],
	attached: [],
	license: 'cc-by-nc-sa-4',
	series: "Minecraft Data Pack Programming",
	order: 3
}
---

> Please note: this guide specifically covers the **Java Edition** version of Minecraft. Bedrock Edition does not use data packs, but provides customization through [add-ons](https://minecraft.fandom.com/wiki/Add-on).

The data packs built in this series can be found in the [unicorn-utterances/mc-datapacks-tutorial](https://github.com/unicorn-utterances/mc-datapacks-tutorial/tree/main/3-scoreboards) repository. Feel free to use it for reference as you read through these articles!

# Storing scores

In many data packs, you might find a need to store information that can't be directly accessed through an entity or another command. A common way to do this is through the use of *scoreboards,* which can store a table of numbers for each entity or player. These can be used to reference player statistics, such as the number of blocks mined, or keep track of arbitrary values in your code.

## Creating a scoreboard

We can use the subcommands of `/scoreboard objectives` to create and modify any scoreboards that we use. Let's try making a scoreboard to track the number of animals that each player has spawned through our data pack.

```shell
scoreboard objectives add fennifith.animals_spawned dummy
```

This creates an objective named `fennifith.animals_spawned` that is connected to the `dummy` game statistic. We'll talk about what that means later on, but this effectively means the scoreboard will only be modified if you set its values yourself.

## Scoreboard conventions

### Namespaced objective names

Players often want to have multiple data packs installed in their world at once. Since all scoreboards operate globally in the world, we need to make sure that our scoreboard names will not conflict with any scoreboards used by other data packs.

To accomplish this, it is common to "namespace" your scoreboard names within your data pack by adding a certain prefix. Here, I've started my scoreboard names with `fennifith.animals` to indicate that they belong to my data pack.

### Creating / removing Scoreboards

Typically, all data packs will create any scoreboards they need in a `load.mcfunction` function, connected to the `#minecraft:load` function tag.

Some data packs additionally create an `uninstall.mcfunction` file, not connected to any function tag, that can be executed to remove all of the data pack's scoreboard objectives. This is useful for when a player wants to remove your data pack from their world without leaving any of its behavior behind.

## Setting values

We can set values of a scoreboard using the `/scoreboard players` subcommands. Most of these subcommands accept two arguments for the `<targets>` and `<objective>` of the score to change. For example, the following command will set our entry in the `fennifith.animals_spawned` table to `1`.

```shell
#                     set our scoreboard entry
#                     |   use the entry of the current player
#                     |   |                    use "1" as the value to add
#                     |   |                    |
scoreboard objectives set @s fennifith.animals_spawned 1
```

<div style="margin-top: -2em;">

| Target    | Value |
| --------- | ----- |
| fennifith | 1     |

</div>

If we want to add to this value, we can use the `scoreboard objectives add` subcommand instead. Likewise, `scoreboard objectives remove` will subtract a value from our scoreboard.

```shell
#                     add a number to the current scoreboard value
#                     |   use the entry of the current player
#                     |   |                    use "2" as the number to add
#                     |   |                    |
scoreboard objectives add @s fennifith.animals_spawned 2
```
<div style="margin-top: -2em;">

| Target    | Value |
| --------- | ----- |
| fennifith | 3     |

</div>

### Using global entries

While these entries allow us to store player-specific numbers, we might also want a value that affects our entire data pack. For example, we might want to track the total number of animals spawned in our world in addition to the number of animals for each player.

We can do this by referencing a *nonexistent player*. The scoreboard will include an entry for any entity or name, regardless of whether it actually exists in our world - so by using an invalid name as the target, we can reference it globally from anywhere in our code.

```shell
scoreboard objectives set $global fennifith.animals_spawned 4
```

<div style="margin-top: -2em;">

| Target    | Value |
| --------- | ----- |
| fennifith | 3     |
| $global   | 4     |

</div>

If we didn't include the `$` before our variable name in this snippet, our code would still work! However, what would happen if a player registered the username `global` and tried to use our data pack?

Since the `$` is an invalid username character, we can safely use it for global values without that possibility.

### Using the "/execute store" subcommand

Each Minecraft command provides a "success" and a "result" value which specify if the command was successful - and if so, what value it returned.

The `execute store` subcommand can be used to designate a place to store these values, such as a scoreboard entry.

For example, this command will copy the value of our `$global` variable into `$global_2`...

```shell
#       store the result of the command
#       |                  place it in "$global_2"
#       |                  |                                       run a command that returns the value of "$global"
#       |                  |                                       |
execute store result score $global_2 fennifith.animals_spawned run scoreboard players get $global fennifith.animals_spawned
```

<div style="margin-top: -2em;">

| Target    | Value |
| --------- | ----- |
| fennifith | 3     |
| $global   | 4     |
| $global_2 | 4     |

</div>

> While this example will successfully copy our `$global` variable to `$global_2`, there is somewhat shorter way to achieve that using [scoreboard operations](#Scoreboard-operations)...

It might not always be obvious what value a command returns as its "result", as this is sometimes different from what it prints in the game chat. However, all commands can be looked up on the [Minecraft wiki](https://minecraft.fandom.com/wiki/Commands) to see what values and behavior they should provide.

## Scoreboard operations

If we want to set a scoreboard value based on another entry, we can use the `scoreboard players operation` subcommand to specify a conceptual state of existence between the two values.

For example, to make our `$global` entry in the previous examples equal to the `fennifith` entry, we can use the following command:


```shell
#                            write the result *to* the $global entry
#                            |                                 set the scoreboards equal to each other
#                            |                                 | get the value *from* @s
#                            |                                 | |
scoreboard players operation $global fennifith.animals_spawned = @s fennifith.animals_spawned
```
<div style="margin-top: -2em;">

| Target    | Value |
| --------- | ----- |
| fennifith | 3     |
| $global   | 3     |

</div>

### Math operations

We can also replace the `=` operation with other math operations that can be performed on the scoreboard entry.

For example, to add the `@s` entry to `$global`:

```shell
#                            write the result *to* the $global entry
#                            |                                 add to the existing value
#                            |                                 |  get the value *from* @s
#                            |                                 |  |
scoreboard players operation $global fennifith.animals_spawned += @s fennifith.animals_spawned
```
<div style="margin-top: -2em;">

| Target    | Value |
| --------- | ----- |
| fennifith | 3     |
| $global   | 6     |

</div>

**Note:** the `operation` subcommand only runs on scoreboard entries, so we cannot pass constant values to it. For example, if we want to divide our `$global` entry by two, we need to write the divisor value to another temporary scoreboard first.

```shell
# set the "$divisor" variable to "2"
scoreboard players set $divisor fennifith.animals_spawned 2
# divide the "$global" entry by "$divisor" (2)
scoreboard players operation $global fennifith.animals_spawned /= $divisor fennifith.animals_spawned
```

<div style="margin-top: -2em;">

| Target    | Value |
| --------- | ----- |
| fennifith | 3     |
| $global   | 3     |
| $divisor  | 2     |

</div>

Here is a list of all the other operations that can be performed with this command.
`lhs` denotes the *left hand side* of the operation (the scoreboard entry being written to), while `rhs` denotes the *right hand side*.

- `=` sets `lhs` to the value of `rhs`
- `+=` adds `rhs` to `lhs`
- `-=` subtracts `rhs` from `lhs`
- `*=` multiplies `lhs` by `rhs`
- `/=` divides `lhs` by `rhs`
- `%=` sets `lhs` to the remainder of `lhs / rhs`
- `<` sets `lhs` to `rhs` only if `rhs` is *smaller*
- `>` sets `lhs` to `rhs` only if `rhs` is *larger*
- `><` swaps the values of `lhs` and `rhs`

> While both sides of these operations accept entity selectors, only `lhs` can refer to multiple entities. For example, `@e[type=pig]` could be used to set the scoreboards of every pig entity in the game.
>
> In `rhs`, you may need to add a `limit=1` attribute to limit the number of entities that it can select.

# Displaying scores

In order to see what scores are applied to any entity, there are a few methods of displaying the scoreboard values to players.

## In-game display

The `/scoreboard objectives setdisplay` subcommand can be used to set a particular scoreboard to display in part of the UI. For example, `/scoreboard objectives setdisplay sidebar fennifith.animals_spawned` will show every player and the number of animals they have spawned in a sidebar on the right of the screen.

More areas other than `sidebar` include:
- `list`, which shows the scores next to player names in the tab menu (in Multiplayer only)
- `belowName`, which displays a player's score underneath their name tag

## `/tellraw` command

The `/tellraw` command can be used to send a formatted message in the game chat. It has a wide variety of uses and formatting options, one of which can embed a scoreboard value into the printed message.

`/tellraw` accepts an array of arguments which it concatenates together to form its message. To reference a score in this array, we can write an element with the structure `{"score":{"name":"<selector>","objective":"<objective>"}}`. For example, here is a command that prints the number of animals that the player (`@s`) has spawned:

```shell
tellraw @a ["You have summoned ",{"score":{"name":"@s","objective":"fennifith.animals_spawned"}}," animals!"]
```

# Tracking statistics

Scoreboards can also be created to track *game statistics*, such as the number of blocks mined or number of times an item has been used. These can be found in the game by opening the pause menu in any world or server and clicking the "Statistics" button - and the names used to reference them can be found [on the Minecraft wiki](https://minecraft.fandom.com/wiki/Scoreboard#Criteria).

We can use any statistic as the second argument of `/scoreboard objectives add` - for example:

```shell
scoreboard objectives add fennifith.animals_carrot_stick minecraft.used:minecraft.carrot_on_a_stick
```

> **Note:** These statistics are only tracked for players! While we can still manipulate scoreboard values for other entities using commands, non-player entities do not have statistics, and their objectives will not be updated when an action is performed.

While this scoreboard will be updated when its statistic changes, its entries can also be individually changed by the data pack, so it might not necessarily reflect the same value as the statistic at all times.

For example, we can create the scoreboard above to track the number of times a "Carrot on a Stick" has been used. If we then set our entry to `0` in that scoreboard, its value will stay at `0`, regardless of the player's statistic for that item. If the player then uses the "Carrot on a Stick" again, the statistic and the scoreboard will both increase by 1.

## Detecting events with statistics

We can use this behavior in our `tick.mcfunction` (which runs on every game tick) to detect when a player has used the carrot on a stick. We'll first set the value for all players to 0, then check the scoreboard on every tick to see if it has increased. If it has, we know that the item has been used, and can reset it to 0 to detect it again.

In the previous article, you may have noticed the `/execute if score` subcommand for checking scoreboards in a condition. We can use this along with a *number range* to conditionally execute our function if the scoreboard has a value >= 1.

1. We first need to create our scoreboard when our data pack is loaded by the game - so we'll place the following line in our `load.mcfunction`:
	```shell
	# data/fennifith/functions/animals/load.mcfunction

	# create a new scoreboard tracking the "carrot_on_a_stick" statistic
	scoreboard objectives add fennifith.animals_carrot_stick minecraft.used:minecraft.carrot_on_a_stick
	```
2. Then, we can place a command in `tick.mcfunction` to run our `fennifith:animals/spawn` function if the scoreboard has a value >= 1.
	```shell
	# data/fennifith/functions/animals/tick.mcfunction

	#       for every player in the game...
	#       |     if their score for "carrot_stick" is >= 1
	#       |     |                                                      spawn some animals
	#       |     |                                                      |
	execute as @a if score @s fennifith.animals_carrot_stick matches 1.. run function fennifith:animals/spawn
	```
3. Finally, after we run our function, we need to reset the scoreboard value so that it won't run until the item is used again:
	```shell
	# set the "carrot_stick" score for all players to 0
	scoreboard players set @a fennifith.animals_carrot_stick 0
	```

# Examples of scoreboard functionality

## Applying unique values to each entity in a selector

If we have an entity selector, such as `@e[type=pig]`, we might want to assign a different scoreboard value to each entity. This can be done somewhat concisely using the `execute store result` subcommand...

```shell
# create a dummy objective named "fennifith.animals_id"
scoreboard objectives add fennifith.animals_id dummy

# set a $counter variable to 0
scoreboard players set $counter fennifith.animals_id 0

#       for every entity in @e[type=pig]...
#       |               store the result as the entity's "fennifith.animals_id" score
#       |               |                                              add "1" to the $counter variable
#       |               |                                              |
execute as @e[type=pig] store result score @s fennifith.animals_id run scoreboard players add $counter fennifith.animals_id 1
```

For each pig entity, the `scoreboard add` command increments our `$counter` variable by 1. Conveniently, the `add` command also returns the total value of its scoreboard as its result, so we can use that to store the incremented value as the pig entity's score.

## Challenge: Maximum value of a scoreboard

Let's assume that the `fennifith.animals_spawned` scoreboard has several entries in it, and we want to find its highest score.

To accomplish this, we can use the `@a` selector to target every player in the game, and store the result in `$max fennifith.animals_spawned`.

<details>
<summary>Hint</summary>

Consider using the scoreboard operations that we have available, such as `>`. Remember that any command can also be used with `execute` to run it multiple times.

You might want to set an initial value of `0` to `$max fennifith.animals_spawned`, then apply some operations to increase it to the highest value in the scoreboard.

</details>

<details>
<summary>Solution</summary>

First, we set our `$max` variable to an initial value of 0. Then, we use an `execute` command to run through each player in `@a`. For each player, the `$max > @s` operation sets the value of `$max` only if the player's score is greater than its current value.

```shell
# initially, set the max value to 0
scoreboard players set $max fennifith.animals_spawned 0

#       for every player in the game...
#       |         run a scoreboard operation...
#       |         |                            set $max in fennifith.animals_spawned...
#       |         |                            |                              if the following value is larger...
#       |         |                            |                              | to @s in fennifith.animals_spawned...
#       |         |                            |                              | |
execute as @a run scoreboard players operation $max fennifith.animals_spawned > @s fennifith.animals_spawned
```

This results in `$max` holding the highest value in the scoreboard - you can use the `scoreboard players get $max fennifith.animals_spawned` to check this!

</details>

# Conclusion

This article has covered most of the scoreboard commands we can use, but there is a lot more that can be done with them. These can be used throughout functions to write almost any numerical logic; try experimenting to see what you can accomplish!

In the next post, we'll cover *NBT Data*, which is another way to store and query data in a program - except it also allows for decimals and text!
