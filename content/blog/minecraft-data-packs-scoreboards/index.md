---
{
	title: "Minecraft Data Pack Programming: Scoreboard Usage",
	description: "Learn data pack development in Minecraft - using player scoreboards, variables, and operations!",
	published: '2022-06-19T21:12:03.284Z',
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

# Tracking statistics

Scoreboards can also be created to track *game statistics*, such as a number of blocks mined or number of times an item has been used. These can be found in the game by opening the pause menu in any world or server and clicking the "Statistics" button.

We can use any statistic as the second argument of `/scoreboard objectives add` - for example:

```shell
scoreboard objectives add fennifith.animals_carrot_stick minecraft.used:minecraft.carrot_on_a_stick
```

While this scoreboard will be updated by its statistic changes, its entries can also be individually changed in the scoreboard, so it might not necessarily reflect the same value as the statistic at all times.

For example, we can create the scoreboard above to track the number of times a "Carrot on a Stick" has been used. If we then set our entry to `0` in that scoreboard, its value will stay at `0`, regardless of the player's statistic for that item. If the player then uses the "Carrot on a Stick" again, the statistic and the scoreboard will both increase by 1.

## Detecting events with statistics

We can use this behavior in our `tick.mcfunction` (which runs on every game tick) to detect when a player has used the carrot on a stick. We'll first set the value for all players to 0, then check the scoreboard on every tick to see if it has increased. If it has, we know that the item has been used, and can reset it to 0 to detect it again.

In the previous article, you may have noticed the `/execute if score` subcommand for checking scoreboards in a condition. We can use this along with a *number range* to conditionally execute our function if the scoreboard has a value >= 1.

1. We first need to create our scoreboard when our data pack is loaded by the game - so we'll place the following line in our `load.mcfunction`:
	```shell
	# create a new scoreboard tracking the "carrot_on_a_stick" statistic
	scoreboard objectives add fennifith.animals_carrot_stick minecraft.used:minecraft.carrot_on_a_stick
	```
2. Then, we can place a command in `tick.mcfunction` to run our `fennifith:animals/spawn` function if the scoreboard has a value >= 1.
	```shell
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
