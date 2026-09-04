# fuzzy-b3-a3-design

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
Brief: A dungeon entry hall. Stone pillars (P) and crates (X) for cover. The adventurer enters at S and reaches the treasure door G.
Your previous level concept got this consultant note:
"The concept fits the brief perfectly by emphasizing the use of stone pillars and crates as strategic cover in a crumbling environment, creating a tense and dynamic traversal. It sounds fun by introducing a race against time and danger, which adds urgency and replayability to the player's journey."
Design a new, better level now.
```

## Response

```
{"name":"DungeonEntry","grid":[
"############",
"#S..P..P..#",
"#..X.####.X#",
"#..P.####.P#",
"#..X.####.X#",
"#..P..P..P#",
"#..X.####.X#",
"#..P.####.P#",
"#..X.####.X#",
"#..P..P..P#",
"#..X.####.X#",
"###G..P..P###"
]}
PITCH: Navigate a crumbling dungeon entry hall, using pillars and crates for cover to reach the treasure.
```

## Meta

```json
{
  "label": "fuzzy-b3-a3-design"
}
```
