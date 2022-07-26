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

The data packs built in this series can be found in the [unicorn-utterances/mc-datapacks-tutorial](https://github.com/unicorn-utterances/mc-datapacks-tutorial/tree/main/1-introduction) repository. Feel free to use it for reference as you read through these articles!

# Storing scores

In many data packs, you might find a need to store information that can't be directly accessed through an entity or another command. A common way to do this is through the use of *scoreboards,* which can store a table of numbers for each entity or player. These can be used to reference player statistics, such as the number of blocks mined, or keep track of arbitrary values in your code.

## Creating a scoreboard

We can use the subcommands of `/scoreboard objectives` to create and modify any scoreboards that we use. Let's try making a simple scoreboard to track the number of animals that each player has spawned through our datapack.

```shell
scoreboard objectives add fennifith.animals_spawned dummy
```

This creates an objective named `fennifith.animals_spawned` that is connected to the `dummy` game statistic. We'll talk about this more later on, but this effectively means the scoreboard will only be modified if you set its values yourself.

## Scoreboard conventions

### Namespaced objective names

Players often want to have multiple data packs installed in their world at once. Since all scoreboards operate globally, we need to make sure that our scoreboard names will not conflict with any scoreboards used by other data packs.

To accomplish this, it is common to "namespace" your scoreboard names within your data pack by adding a certain prefix. Here, I've started my scoreboard names with `fennifith.animals` to indicate that they belong to my data pack.

### Creating / removing Scoreboards

Typically, all data packs will create any scoreboards they need in a `load.mcfunction` function connected to the `#minecraft:load` function tag.

Some data packs additionally create an `uninstall.mcfunction` file, not connected to any function tag, that can be executed to remove all of the data pack's scoreboard objectives. This is useful for when a player wants to remove your datapack from their world without leaving any of its behavior behind.

## Setting values

We can set values of this scoreboard using the `/scoreboard players` subcommands. Most of these subcommands accept two arguments for the `<targets>` and `<objective>` of the score to change. For example, the following command will set our entry in the `fennifith.animals_spawned` table to `1`.

<!-- tabs:start -->

### Code

```shell
#                     set our scoreboard entry
#                     |   use the entry of the current player
#                     |   |                    use "1" as the value to add
#                     |   |                    |
scoreboard objectives set @s fennifith.animals_spawned 1
```

### Scoreboard

| Target    | Value |
| --------- | ----- |
| fennifith | 1     |

<!-- tabs:end -->

If we want to add to this value, we can use the `scoreboard objectives add` subcommand instead. Likewise, `scoreboard objectives remove` will subtract a value from our scoreboard.

<!-- tabs:start -->

### Code

```shell
#                     add a number to the current scoreboard value
#                     |   use the entry of the current player
#                     |   |                    use "2" as the number to add
#                     |   |                    |
scoreboard objectives add @s fennifith.animals_spawned 2
```

### Scoreboard

| Target    | Value |
| --------- | ----- |
| fennifith | 3     |

<!-- tabs:end -->

### Using global entries

While these entries allow us to store player-specific numbers, we might also want a value that affects our entire datapack. For example, we might want to track the total number of animals spawned in our world in addition to the number of animals for each player.

We can do this by referencing a *nonexistent player*. The scoreboard will include an entry for any entity or name, regardless of whether it actually exists in our world - so by using an invalid name as the target, we can reference it globally from anywhere in our code.

<!-- tabs:start -->

#### Code

```shell
scoreboard objectives set $global fennifith.animals_spawned 4
```

If we didn't include the `$` before our variable name in this snippet, our code would still work! However, what would happen if a player registered the username `global` and tried to use our datapack?

Since the `$` is an invalid username character, we can safely use it for global values without that possibility.

#### Scoreboard

| Target    | Value |
| --------- | ----- |
| fennifith | 3     |
| $global   | 4     |

<!-- tabs:end -->

## Scoreboard operations

If we want to set a scoreboard value based on another entry, we can use the `scoreboard players operation` subcommand to specify a conceptual state of existence between the two values.

For example, to make our `$global` entry in the previous examples equal to the `fennifith` entry, we can use the following command:


<!-- tabs:start -->

### Code

```shell
#                            write the result *to* the $global entry
#                            |                                 set the scoreboards equal to each other
#                            |                                 | get the value *from* @s
#                            |                                 | |
scoreboard players operation $global fennifith.animals_spawned = @s fennifith.animals_spawned
```
### Scoreboard

| Target    | Value |
| --------- | ----- |
| fennifith | 3     |
| $global   | 3     |

<!-- tabs:end -->

### Math operations

We can also replace the `=` operation with other math operations that can be performed on the scoreboard entry.

For example, to add the `@s` entry to `$global`:

<!-- tabs:start -->

### Code

```shell
#                            write the result *to* the $global entry
#                            |                                 add to the existing value
#                            |                                 |  get the value *from* @s
#                            |                                 |  |
scoreboard players operation $global fennifith.animals_spawned += @s fennifith.animals_spawned
```
### Scoreboard

| Target    | Value |
| --------- | ----- |
| fennifith | 3     |
| $global   | 6     |

<!-- tabs:end -->

**Note:** the `operation` subcommand only runs on scoreboard entries, so we cannot pass constant values to it. For example, if we want to divide our `$global` entry by two, we need to write the divisor value to another temporary scoreboard first.

<!-- tabs:start -->

### Code

```shell
# set the "$divisor" variable to "2"
scoreboard players set $divisor fennifith.animals_spawned 2
# divide the "$global" entry by "$divisor" (2)
scoreboard players operation $global fennifith.animals_spawned /= $divisor fennifith.animals_spawned
```
### Scoreboard

| Target    | Value |
| --------- | ----- |
| fennifith | 3     |
| $global   | 3     |
| $divisor  | 2     |

<!-- tabs:end -->

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

Scoreboards can also be created to track *game statistics*, such as a number of blocks mined or number of times an item has been used. These can be found in the game by opening the pause menu in any world or server and clicking the "Statistics" button - and the names used to reference them can be found [on the Minecraft wiki](https://minecraft.fandom.com/wiki/Scoreboard#Criteria).

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

## Maximum value of a scoreboard

Let's say that we need to find the maximum value of all entries in a scoreboard objective. We can use the `@a` selector to target every player in the game, and store the result in `$max fennifith.animals_spawned`.

Consider using the scoreboard operations that we have available, such as `>`. Remember that any command can also be used with `execute` to run it multiple times.

<details>
<summary>Solution</summary>

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

</details>

## Challenge: Get the second-most entry




> This introduces a small caveat of using entity selectors: they will only apply to any entity *that is currently alive and on the server.*
>
> When a player entity logs off, or a non-player entity is killed/despawned or in an unloaded chunk, there is no longer any way to reference it with an entity selector. While this does not cause problems for most functionality, it is important to remember that the results might not always be perfectly accurate in actual usage.
