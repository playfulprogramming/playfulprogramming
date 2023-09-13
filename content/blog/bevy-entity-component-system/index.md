---
{
	title: "Entity Component Systems: ",
	description: "",
	published: '2023-09-13',
	authors: ['fennifith'],
	tags: ['rust', 'computer science', 'opinion'],
	attached: [],
	license: 'cc-by-nc-sa-4',
}
---

An "Entity Component System" is a pattern followed by many game engines to create isolated systems of stateless, reusable game logic. They present a lot of advantages for all kinds of games: enabling out-of-the-box parallelization, universal state management, and unrestricted polymorphism. But how does this work? What makes it so special?

> **Note:** While this post focuses on the conceptual aspects of ECS, it will reference a Rust game engine called [Bevy](https://bevyengine.org) in many of its examples.
>
> I recommend checking out the [Unofficial Bevy Cheat Book](https://bevy-cheatbook.github.io) for a more in-depth introduction to the framework!

# What is an Entity Component System?

- **Entity**: An instance of an object with components in the game world.
- **Component**: A piece of state or data that can be attached to an entity.
- **System**: A function that operates on a set of entities and their components to perform some game logic.

ECS is characterized by using entities to represent game objects. Each entity has a unique ID, which ties it to a set of components that store its data.

*There is no top-level class or trait that defines an entity!* It's just an ID! Everything about it is defined by what components it has, and how systems interact with it.

## Systems are the Game Loop!

In most games, you'll find a logical "game loop" or "tick loop" that processes logical events or user input, and processes its effects in the world. These might handle things like physics calculations, collision detection, score tracking, win conditions - anything related to the game's *state* or *data*.

These are often (but not always!) kept separate from the *visual* aspects of the game, such as a render loop, which would process graphics updates.

> Most games can run at different frame rates, which sometimes even vary while the game is running. This needs to be separate from the game's logic to ensure that it always has reliable behavior, regardless of what frame rate it's running at.
>
> Changing from 60 to 120 fps shouldn't also double your character's movement speed in the game!

Point being, this is behavior that needs to be reliable and consistent, as it is used to continuously process the game state during gameplay.

---

A *system* is then effectively a function that gets continuously invoked during the game. It would typically define a query for the components it uses, and perform some kind of operation as a result.

# So, you want to build a game?

I think it's best to show the benefits of the ECS approach in a practical example: Snake!

Snake is a well-known retro game in which the player moves a snake on a grid of square tiles, with the goal of eating apples in order to grow. The game ends if the snake runs into itself, or if all apples are eaten.

In an object-oriented approach, I might implement individual structs for each object in the game, as follows:

```rust
struct Snake {
	segments: Vec<SnakeSegment>;
}

struct SnakeSegment {
	position: (i32, i32);
}

impl Snake {
	fn move(&mut self, direction: KeyCode) -> bool {
		// - move the tail of the snake to "head.position + direction"
		// - if the new position collides with the snake, return true
		//     (the game should end)
		// - else, return false
	}

	fn grow(&mut self) {
		// - add a new segment to the tail of the snake
	}
}
```

Now, this code might seem pretty straightforward. All of the snake's "state" lives within `Snake` and `SnakeSegment`. We'd likely implement a game loop to interact with it and call these methods where appropriate, e.g.

```rust
let mut player_snake = Snake {};
let mut apples: Vec<Apple> = Vec::new();

loop {
	let key_code = input.poll();

	let is_collision = player_snake.move(key_code);
	if (is_collision) { break; }

	// TODO: detect if the snake eats an apple
	if (is_apple_eaten) {
		player_snake.grow();
	}

	if (apples.len() == 0) {
		break;
	}
}
```

## Why is this a bad example?

You might be noticing that this code is mixing together a lot of different functionality. `snake.move()` is directly tied to both keyboard input and the game's end condition.

This might be fine for a game where we know the full extent of its functionality ahead of time. However, in a lot of game development scenarios, this isn't the case. New features and mechanics frequently need to be added, changed, and iterated upon in ways that are rarely considered in the initial version.

For example, take this list of potential additions:
- The snake should continue moving in the same direction after a key is released, until a new action is entered.
- Lava pits! The game should end if the snake runs into a lava pit.
- The snake can also eat speed powerups, which make it move faster.
- The player should move the snake diagonally when pressing two directions at once.
- After eating an apple, the snake gains a few seconds of invulnerability in which the game does not end for any reason.
- The game has multiple snakes, which the player can control with different keybinds for multiplayer!

All of these ideas are possible, but they would become progressively more difficult to implement as the game grows in complexity. Suddenly your `move()` function is handling 20 different edge cases, your game loop is 2k lines long, and your codebase is an confusing web of logic that is inherently connected to everything else.

## ECS to the Rescue!

Designing this behavior with components allows us to isolate these mechanics into individual pieces of state:

- `SnakeSegments { segments: Vec<SnakeSegment>; }`
- `SnakeMovement { direction: (i32, i32); }`
- `Invulnerability { ticks_left: u32; }`
- `Speed { ticks_left: u32; }`
- `Player { key_binds: Map<KeyCode, (i32, i32)>; }`

We can then write some systems to process parts of the game logic using these components.

```rust
/// Update the snake movement according to Player.key_binds,
/// whenever a key is pressed
fn system_player_input(
	input: Res<Input>,
	mut player_query: Query<(&Player, &mut SnakeMovement)>,
) {
	for (player, mut movement) in player_query.iter_mut() {
		for (key, value) in player.key_binds.iter() {
			if input.pressed(key) {
				movement.direction = value;
			}
		}
	}
}


/// Move any SnakeSegments on each tick, according to its
/// SnakeMovement value
fn system_move_snake(
	mut movement_query: Query<(&mut SnakeSegments, &SnakeMovement, Has<Speed>)>,
) {
	for (mut segments, movement, has_speed) in movement_query.iter_mut() {
		// - move the tail of the snake to "head.position + movement.direction"
		// - if has_speed is true, move another segment (to move by two segments at once)
	}
}

/// If the snake runs into itself, and does not have
/// invulnerability, end the game!
fn system_detect_collision(
	mut segments_query: Query<&SnakeSegments, Without<Invulnerability>>,
) {
	for segments in segments_query.iter() {
		// - find if any two segments have the same position in the snake
		// - if true, end the game!
	}
}
```

Finally, we can assemble our "player snake" by attaching any combination of the above components, depending on what functionality we want:

```rust
commands.spawn((
	SnakeSegments { ... },
	SnakeMovement { direction: (0, 0) },
	Player { key_binds: map!(
		KeyCode::ArrowUp: (0, 1),
		KeyCode::ArrowDown: (0, -1),
		KeyCode::ArrowLeft: (-1, 0),
		KeyCode::ArrowRight: (1, 0),
	) },
));
```

---

This is far from a full implementation, but I hope this illustrates the advantages of ECS from an architectural standpoint. Each of these systems accesses only the components they need in order to run. Other components and systems can be added, modified, and replaced without affecting any other part of the game!

This might be a bit more verbose, but it provides a massive improvement for reusability in return.

# Aren't these queries bad?

So far, every system we've written has defined a `Query<Q, F>` type for it to iterate over.

This seems like it would involve an iteration over every entity in the game - which could be absolutely massive! In games that can have millions of entities at once, how is this not a major performance bottleneck?

Well, most ECS frameworks are able to implement some neat tricks by knowing these queries *ahead of time.* In particular, Bevy already knows every query it needs, and is able to track and update them on each modification, rather than at the time of the query.

This makes each query have an `O(1)` runtime, at the cost of some memory space and some slight processing whenever a modification is made. Great!

> *Note:* If you're familiar with relational databases, this is similar to
> the idea of [*materialized views*](https://en.wikipedia.org/wiki/Database#Materialized_views), which store the results of frequent
> queries to avoid computing them every time they're needed.

However, there are still some cases where these queries don't work! In particular, considering relations between two entities can be a point of concern.

TODO: Entity Relations

TODO: IDs > Pointers

