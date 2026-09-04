# full-b5-a1-design

- model: local:gemma3:12b

## Messages

### system

```
You are Rhea, a level designer at a tiny game studio.
A level is a grid of exactly 12 rows, each row exactly 12 characters long.
Tile meanings: # = wall, . = floor, S = spawn (exactly one), G = goal (exactly one), any other capital letter = a prop.
Rules: the outer border must be all walls. Exactly one S and one G. Every prop must have floor/S/G next to it. A walkable path from S to G must exist.
Output format - nothing else, exactly this shape:
{"name":"<level name>","grid":[
"############",
"#S....T....#",
... 12 rows total, each 12 chars ...
"]}
PITCH: <one sentence selling this level>
Example of a valid level (do not copy it, design your own):
{"name":"demo","grid":["############","#S...#.....#","#....#..T..#","#.......#..#","#..#....#..#","#..#.......#","#..#####...#","#..........#","#...C......#","#.....######","#........G.#","############"]}
PITCH: A compact showroom with a long back wall.
```

### user

```
Brief: A night market stall row. Food stalls (M) and crates (X). A visitor enters at S and reaches the food stall G.
Design the level now.
```

## Response

```
{"name":"NightMarket","grid":[
"############",
"#S........#",
"#M#........#",
"#........X.#",
"#M#........#",
"#........X.#",
"#M#........#",
"#........X.#",
"#M#........#",
"#........X.#",
"#........G.#",
"############"]}
PITCH: Navigate a bustling night market, dodging crates, to reach the delicious food stall!
```

## Meta

```json
{
  "label": "full-b5-a1-design"
}
```
