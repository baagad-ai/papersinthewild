# full-b1-a1-design

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
Brief: A cozy cafe. At least two tables (T) and a counter (C). A customer enters at S and should reach the counter nook G.
Design the level now.
```

## Response

```
{"name":"CafeCozy","grid":[
"############",
"#S........#",
"#.####.####",
"#.T###.T###",
"#.####.####",
"#........C#",
"#.####.####",
"#.T###.T###",
"#.####.####",
"#........G#",
"#.########.#",
"############"]}
PITCH: Step into our charming cafe and enjoy a relaxing path to the counter nook!
```

## Meta

```json
{
  "label": "full-b1-a1-design"
}
```
