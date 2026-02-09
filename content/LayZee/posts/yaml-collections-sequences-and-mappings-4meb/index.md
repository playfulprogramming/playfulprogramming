---
{
title: "YAML collections: Sequences and mappings",
published: "2022-11-21T17:14:55Z",
edited: "2023-12-12T14:14:35Z",
tags: ["yaml", "beginners"],
description: "A quick overview of YAML sequences (arrays/lists) and mappings (hash maps/associative arrays).",
originalLink: "https://https://dev.to/playfulprogramming/yaml-collections-sequences-and-mappings-4meb",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

*Cover photo by [Karen Vardazaryan](https://unsplash.com/@bright) on Unsplash.*

## Sequences

A sequence is a YAML node that contains an ordered list of zero to *n* YAML *nodes* (mappings, sequences, or scalars). Sequences are commonly known as arrays or lists in other languages.

### Block collection style

A block sequence is a series of YAML nodes lead by a dash (`-`) indicator and white space.

```yaml
integers:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
  - 9
  - 10
colors:
  - red
  - green
  - blue
  - yellow
  - cyan
  - magenta
  - black
  - white
```

In JSON, this is

```json
{
  "integers": [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10
  ],
  "colors": [
    "red",
    "green",
    "blue",
    "yellow",
    "cyan",
    "magenta",
    "black",
    "white"
  ]
}
```

### Flow collection style

A flow sequence is a series of YAML nodes contained in square brackets (`[` and `]`). Flow sequence entries are separated by a comma (`,`) with a trailing comma allowed but empty node entries disallowed.

```yaml
integers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
colors: [red, green, blue, yellow, cyan, magenta, black, white]
```

but also

```yaml
integers: [
  1, 2,
3, 4, 5,
  6, 7, 8, 9,
10,
]
colors: [red, green, blue,
yellow, cyan, magenta, black, white]
```

or any other white space variation.

In JSON, this is

```json
{
  "integers": [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10
  ],
  "colors": [
    "red",
    "green",
    "blue",
    "yellow",
    "cyan",
    "magenta",
    "black",
    "white"
  ]
}
```

## Mappings

A mapping is a YAML node that contains an unordered set of zero to *n* key-value pairs. A key and its value are separated by a colon (`:`). Keys must be unique. Both keys and values may be any kind of YAML node. Mappings are commonly known as hash maps or associative arrays in other languages.

### Block collection style

A block mapping is a series of key-value pairs on separate lines.

```yaml
integer: 3
color: blue
```

In JSON, this is

```json
{
  "integer": 3,
  "color": "blue"
}
```

### Flow collection style

A flow mapping is a series of key-value pairs contained in curly braces (`{` and `}`). Flow mapping entries are separated by a comma (`,`) with a trailing comma allowed but empty node entries disallowed.

```yaml
{ integer: 3, color: blue }
```

but also

```yaml
{
  integer: 3,
color: blue,}
```

or any other white space variation.

In JSON, this is

```json
{
  "integer": 3,
  "color": "blue"
}
```

### Explicit mapping entries

A mapping key and value pair is optionally put on separate lines where the key is lead by a question mark (`?`) and the value is lead by a colon (`:`). This allows for special keys such as the empty node or complex non-scalar nodes.

```yaml
? 
: My key is empty
? - 3
  - [blue]
  - { autocorrect: On }
: My key is a nested collection
```

The previous example is a mapping containing two key-value pairs where the values are strings. It has no equivalent JSON expression.
