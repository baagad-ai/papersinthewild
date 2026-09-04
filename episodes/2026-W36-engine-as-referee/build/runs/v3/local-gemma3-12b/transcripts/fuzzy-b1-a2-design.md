# fuzzy-b1-a2-design

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
"The concept fits the brief by creating a cozy, inviting atmosphere with clear pathways to the counter, but it lacks the playful energy needed to make the experience feel fun. The description feels more like a serene moment than an engaging and interactive game experience."
Design a new, better level now.
```

## Response

```
{"name":"CafeRush","grid":[
"############",
"#S...C..T.P#",
"#....T..C..#",
"#.B...P..P.#",
"#.T..C..B..#",
"#...B..P..#",
"#.P..C..B.#",
"#.T..P..P.#",
"#..B..C..B.#",
"#.P..T..P.#",
"#...G..P..#",
"############"]}
PITCH: Serve your customers quickly and avoid bumping into the busy cafe patrons!
```

## Meta

```json
{
  "label": "fuzzy-b1-a2-design"
}
```
