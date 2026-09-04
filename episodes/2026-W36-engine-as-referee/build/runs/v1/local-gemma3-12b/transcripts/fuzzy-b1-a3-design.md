# fuzzy-b1-a3-design

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
Your previous level concept got this consultant note:
"The concept fits the brief by clearly incorporating two tables and a counter, with a clear goal of reaching the counter nook, making it visually and mechanically aligned with the requirements. The idea of navigating a bustling cafe while dodging tables adds a dynamic and engaging layer of challenge, making the concept both fun and immersive."
Design a new, better level now.
```

## Response

```
{"name":"CafeCozy","grid":[
"############",
"#S........#",
"#.TT......#",
"#........C#",
"#........#",
"#..P..T..#",
"#........#",
"#..P..C..#",
"#........#",
"#........#",
"#........G#",
"############"]}
PITCH: Enjoy a leisurely stroll through a charming cafe, carefully avoiding tables and reaching the cozy nook at the counter.
```

## Meta

```json
{
  "label": "fuzzy-b1-a3-design"
}
```
