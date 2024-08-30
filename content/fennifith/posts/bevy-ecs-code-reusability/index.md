---
{
	title: "Entity Component System: The Perfect Solution to Reusable Code?",
	description: "The ECS pattern is used by many game engines to create stateless, reusable game logic. But how does it work?",
	published: '2024-08-30',
	authors: ['fennifith'],
	tags: ['rust', 'computer science', 'opinion'],
	attached: [],
	license: 'cc-by-nc-sa-4',
}
---

An "Entity Component System" is a pattern followed by many game engines to create isolated systems of stateless, reusable game logic.

ECS presents a lot of advantages for all kinds of games: enabling out-of-the-box parallelization, universal state management, and unrestricted abstractions. But how does this work? What makes it so special?

> **Note:** While this post focuses on the conceptual aspects of ECS, it will reference a Rust game engine called [Bevy](https://bevyengine.org) in many of its examples.
>
> I recommend checking out the [Unofficial Bevy Cheat Book](https://bevy-cheatbook.github.io) for a more in-depth introduction to the framework!

# What is an Entity Component System?

- **Entity:** An instance or identifier of an object in the game world.
- **Component:** A piece of state or data that can be attached to an entity.
- **System:** A function that operates on a set of entities and their components to perform some game logic.

ECS is characterized by using entities to represent game objects. Each entity has a unique ID, which ties it to a set of components that store its data.

***There is no top-level class or trait that defines an entity!*** It's just an ID! Everything about it is defined by what components it has, and how the systems interact with it.

## Components are the Data

Components are defined as structs that hold particular pieces of data for entities in your world. These can be used to identify specific types of entities, or to hold some information about them - such as `Movement`, `Gravity`, or `Health`.

To better visualize this example - components can form the columns of a table that is indexed by `Entity`:

| `Entity` (ID) | `Player` | `Apple` | `Movement` | `Gravity` | `Health` | `Position` |
|---------------|----------|---------|------------|-----------|----------|------------|
| 0             | `{}`     |         | `direction: North` |      | `health: 10` | `pos: (0, 0)` |
| 1             |          | `{}`    |            | `acceleration: 9.8` |      | `pos: (3, 4)` |
| 2             |          | `{}`    |            | `acceleration: 9.8` |      | `pos: (-1, 8)` |

This shows three entities:
- a `Player` with `Movement`, `Health`, and `Position`
- two `Apple` entities with `Gravity` and `Position`

However, none of these components dictate the exact functionality that should apply to them! All behavior is implemented in *systems...*

## Systems form the Game Loop!

In most games, you'll find a logical "game loop" or "tick loop" that handles logical events or user input and processes its effects in the world. These might involve things like physics calculations, collision detection, score tracking, win conditions - anything related to the game's *state* or *data*.

These are often (but not always!) kept separate from the *visual* aspects of the game, such as a render loop, which would process graphics updates.

> Most games can run at multiple frame rates, which sometimes can even vary while the game is running. This needs to be separate from the game's logic to ensure that it always has reliable behavior, regardless of what frame rate it's running at.
>
> Changing from 60 to 120 fps shouldn't also double your character's movement speed in the game!

A *system* is a function that gets continuously invoked during the game. It would typically define a query for the components it uses, and perform some kind of operation as a result.

In the above example, we might want a system to operate on each entity with `Velocity` and `Gravity` to apply the effect of gravity on each tick:

```rust
// This is psuedocode, don't read too much into it - just illustrating the above :)
fn apply_gravity(velocity: Velocity, gravity: Gravity) {
	velocity.y -= gravity.acceleration
}
fn apply_velocity(position: Position, velocity: Velocity) {
	position.x += velocity.x;
	position.y += velocity.y;
}
```

The ECS framework is then in charge of the surrounding loop itself, and controls how and when each system is invoked.

## Entities are Composable

This is a significant benefit of having *data-driven behavior* in ECS - unlike patterns where this data is intrinsically tied to the implementation, ECS makes it very easy to configure specific components based on your needs.

Maybe you want type of `Apple` that also has `Health` - in Object Oriented Programming, it might look like this:

```java
class AppleWithHealth extends Apple {
	int health = 10;

	public AppleWithHealth(position: Vec3) {
		super(position);
	}

	@Override
	public void tick() {
		super.tick();
		if (health <= 0) {
			this.despawn();
		}
	}
}
```

Note that we're re-implementing anything that needs to check `health` inside of the `tick()` function. This behavior is probably defined in multiple places in our code, and will be costly to maintain.

In ECS, rather than creating an entirely new implementation, all you should need is to construct it with the `Health` component:

```rust
commands.spawn((
	Apple,
	Gravity { acceleration: 9.8 },
	Health { health: 10 },
));
```

This is similar to the [Composition over Inheritance](https://en.wikipedia.org/wiki/Composition_over_inheritance) pattern, where behavior is defined by assembling an entity out of components, rather than having a single concrete implementation. This means that your systems can be reused to apply to any entity in your game!

# So, you want to build a game?

I think it's best to show the benefits of the ECS approach in a practical example: Snake!

Snake is a well-known retro game in which the player moves a snake on a grid of square tiles, with the goal of eating apples in order to grow. The game ends if the snake runs into itself, or if all apples are eaten.

In an object-oriented approach, I might implement individual structs for each object in the game, as follows:

```rust
struct Snake {
	// keep an array of each segment in the snake
	segments: Vec<SnakeSegment>;
}

struct SnakeSegment {
	// each segment has an integer x/y position
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
	// get a key pressed by the keyboard
	let key_code = input.poll();

	// the snake should move once on each tick
	let is_collision = player_snake.move(key_code);

	if (is_collision) {
		// moving has caused the snake to run into itself,
		// so the player loses the game
		break;
	}

	// TODO: detect if the snake eats an apple
	if (is_apple_eaten) {
		// if the snake eats an apple, it should grow
		player_snake.grow();
	}

	if (apples.len() == 0) {
		// there are no apples left, so the player has won the game
		break;
	}
}
```

## The challenge with reusability

You might be noticing that this code is mixing together a lot of different functionality. `snake.move()` is directly tied to both keyboard input and the game's end condition.

This might be fine for a game where we know the full extent of its functionality ahead of time. However, in a lot of game development scenarios, this isn't the case. New features and mechanics frequently need to be added, changed, and iterated upon in ways that are rarely considered in the initial version.

For example, take this list of potential additions:
- The snake should continue moving in the same direction after a key is released, until a new action is entered.
- Lava pits! The game should end if the snake runs into a lava pit.
- The snake can also eat speed powerups, which make it move faster.
- The player should move the snake diagonally when pressing two directions at once.
- After eating an apple, the snake gains a few seconds of invulnerability in which the game does not end for any reason.
- The game has multiple snakes, which the player can control with different keybinds for multiplayer!

All of these ideas are possible, but they would become progressively more difficult to implement as the game grows in complexity. Suddenly your `move()` function is handling 20 different edge cases, your game loop is 2,000 lines long, and your codebase is a confusing web of logic that is inherently connected to everything else.

If you've ever felt backed into a wall by the way your project is structured, you know that the solution can be time-consuming. Refactoring functions to use a different data structure, abstracting some functionality behind an extra interface to make way for new changes... What if there was a way to structure your code that could make it universally reusable from the start?

## ECS to the Rescue!

Designing this behavior with components allows us to isolate these mechanics into individual pieces of state:

- `Snake { segments: Vec<SnakeSegment>; }`
- `SnakeMovement { direction: (i32, i32); }`
- `Invulnerability { ticks_left: u32; }`
- `Speed { ticks_left: u32; }`
- `Apple { position: (i32, i32); }`
- `Player { key_binds: Map<KeyCode, (i32, i32)>; }`
- `Apple { position: (i32, i32); }`

Unlike OOP, these components are not restricted into any sort of heirarchy based on *what they are* or *what they implement.* They are solely buckets of data that can be used by systems to achieve their functionality.

We can then write some systems to process parts of the game logic using these components.

- `system_player_input` can check which keys are pressed using the bevy `Input` API, using key binds configured on the `Player` component, and update the direction of its `SnakeMovement`.

	```rust
	/// Update the snake movement according to Player.key_binds,
	/// whenever a key is pressed
	fn system_player_input(
		input: Res<Input>,
		// query for all entity with the `Player` and `SnakeMovement` components
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
	```

- `system_move_snake` updates the `SnakeSegments` positions of every snake entity according to its `SnakeMovement` direction.

	```rust
	/// Move any SnakeSegments on each tick, according to its
	/// SnakeMovement value
	fn system_move_snake(
		// query for all entities with the `Snake` and `SnakeMovement` components,
		// and check whether they have a `Speed` component
		mut movement_query: Query<(&mut Snake, &SnakeMovement, Has<Speed>)>,
	) {
		for (mut snake, movement, has_speed) in movement_query.iter_mut() {
			// - move the tail of the snake to "head.position + movement.direction"
			// - if has_speed is true, move another segment (to move by two segments at once)
		}
	}
	```
- `system_eat_apple` checks if the snake has found an apple, and makes the snake eat it and grow!

	```rust
	// If the snake runs into an apple, it should eat the apple
	// and grow by one segment.
	fn system_eat_apple(
		mut commands: Commands,
		// query for all entities with the `Snake` component
		snake_query: Query<&mut Snake>,
		// query for all entities with the `Apple` component
		apple_query: Query<(Entity, &Apple)>,
	) {
		for mut snake in snake_query.iter_mut() {
			// Get the first snake segment
			let Some(snake_segment) = snake.segments.get(0) else { continue };

			for (apple_entity, apple) in apple_query.iter() {
				// If its position is the same as an apple, then...
				if (snake_segment.pos == apple.pos) {
					// Eat the apple (remove it from the world)
					commands.entity(apple_entity).despawn();
					// Grow the snake by adding a new segment
					snake.segments.push(SnakeSegment { pos: snake_segment.pos });
				}
			}
		}
	}
	```

- `system_detect_collision` determines when the snake has run into itself, as long as it doesn't have the `Invulnerability` component, and ends the game (by despawning the snake entity).

	```rust
	/// If the snake runs into itself, and does not have
	/// invulnerability, end the game!
	fn system_detect_collision(
		mut commands: Commands,
		// query for any entities with the `Snake` component that do not
		// have an `Invulnerability` component
		snake_query: Query<(Entity, &Snake), Without<Invulnerability>>,
	) {
		for (entity, snake) in snake_query.iter() {
			// - find if any two segments have the same position in the snake
			// - if true, end the game!
			if (is_colliding) {
				commands.entity(entity).despawn();
			}
		}
	}
	```

Finally, we can assemble our "player snake" by attaching any combination of the above components, depending on what functionality we want:

```rust
commands.spawn((
	SnakeSegments { ... },
	SnakeMovement { direction: (0, 0) },
	Player { key_binds: map![
		KeyCode::ArrowUp -> (0, 1),
		KeyCode::ArrowDown -> (0, -1),
		KeyCode::ArrowLeft -> (-1, 0),
		KeyCode::ArrowRight -> (1, 0),
	] },
));
```

---

This is far from a full implementation, but I hope this illustrates the advantages of ECS from an architectural standpoint. Each of these systems accesses only the components they need in order to run. Other components and systems can be added, modified, and replaced without affecting any other part of the game!

This might be a bit more verbose, but it provides a massive improvement for reusability in return.

# Aren't these queries slow?

So far, every system we've written has defined a `Query<Q, F>` type for it to iterate over.

This seems like it would involve an iteration over every entity in the game - which could be absolutely massive! In games that can have many thousands of entities at once, how is this not a major performance bottleneck?

Well, most ECS frameworks are able to implement some neat tricks by knowing these queries *ahead of time.* In particular, Bevy already knows every query it needs, and is able to cache the results and update some parts of them when an entity is modified, rather than recomputing them every time they're used.

> **_From [the Bevy docs on Query Performance](https://docs.rs/bevy_ecs/latest/bevy_ecs/system/struct.Query.html#performance):_**
>
> The following table compares the computational complexity of the various methods and operations, where:
>
> - n is the number of entities that match the query,
> - r is the number of elements in a combination,
> - k is the number of involved entities in the operation,
> - a is the number of archetypes in the world,
> - C is the binomial coefficient, used to count combinations. nCr is read as “n choose r” and is equivalent to the number of distinct unordered subsets of r elements that can be taken from a set of n elements.
>
> | Query operation   | Computational complexity |
> |-------------------|--------------------------|
> | `iter(_mut)`      | O(n)                     |
> | `for_each(_mut)`, `par_iter(_mut)`    | O(n) |
> | `iter_many(_mut)` | O(k)                     |
> | `iter_combinations(_mut)` | O(nCr)           |
> | `get(_mut)`       | O(1)                     |
> | `(get_)many`      | O(k)                     |
> | `(get_)many_mut`  | O(k^2)                   |
> | `single(_mut)`, `get_single(_mut)` | O(a)    |
> | Archetype based filtering (`With`, `Without`, `Or`) | O(a) |
> | Change detection filtering (`Added`, `Changed`)	 | O(a + n) |

At this point, most of the runtime is down to the iteration over the query itself, aside from a few cases where extra filters are involved. This can still be costly for performance... but the same operations could be equally costly when written without ECS.

On the other hand, the *existence* of a query is almost negligible. Which is great!

However, there are still some cases where these queries don't work! In particular, considering relations between two entities can be a point of concern.

# Entity Relations

Consider:

- An orange tree has many oranges. An orange can be picked individually, or the tree can be cut down.
  If the tree is removed, the oranges should go with it!

- Two boats can be tied together with a rope. Each end of the rope can only be tied to a single boat
  at a time!

This would be hard to implement with queries! Queries are great for filtering sets or types of components, but not so good for finding entities based on their relations to each other.

Many ECS frameworks implement some kind of Entity-Entity relation mechanism to satisfy these cases. These can be used to enforce One-to-Many or One-to-One constraints, and can be much better optimized using a graph structure than what would be possible with queries.

## Defining Relations in Bevy

While Bevy has [ongoing discussion](https://github.com/bevyengine/bevy/issues/3742) about entity relations, there isn't a clear-cut way to implement them in the current release (at the time of writing).

> *Note:* Bevy *does* support [Parent-Child relations](https://bevy-cheatbook.github.io/fundamentals/hierarchy.html), which may
> satisfy some use cases.

In the meantime, the alternative practice seems to be storing any related entity IDs in a component attached to each entity...


```rust
#[derive(Component)]
struct Snake {
	// keep track of all segment entity IDs belonging to the snake
	segments: Vec<Entity>;
}

// Each segment entity includes this `SnakeSegment` component
#[derive(Component)]
struct SnakeSegment {
	position: (i32, i32);
}


fn system_move_snake(
	mut snake_query: Query<&mut Snake>,
	mut segment_query: Query<&mut SnakeSegment>,
) {
	for mut snake in snake_query.iter_mut() {
		// iterate over each entity ID in the `Snake`
		for segment_id in snake.segments.iter() {
			// fetch the `SnakeSegment` component for each referenced segment entity
			// from the segment query.
			let segment = segment_query.get(segment_id);
			// ...
		}
	}
}
```

This is a little suboptimal, as it leaves your code open to race conditions and unexpected behavior depending on how it's implemented. Remember that Bevy runs systems in parallel unless configured to do otherwise!

None of this provides any assurance that:
- Each entity in `Snake.segments` has a `SnakeSegment` component
- Any entity with `SnakeSegment` is referenced by one and only one `Snake`
- The entities referenced in `Snake.segments` actually exist

However, a single `query.get(id)` is still a big runtime improvement compared to looping through a broad query to find the one entity you need.

# Conclusion

Overall, while ECS might not be a perfect solution to every problem, it's clear that it presents a lot of advantages in the context of game development.

If this post caught your interest, I recommend looking into the [Bevy tutorials](https://bevyengine.org/learn/) and the [Unofficial Bevy Cheat Book](https://bevy-cheatbook.github.io/) to explore it further!

