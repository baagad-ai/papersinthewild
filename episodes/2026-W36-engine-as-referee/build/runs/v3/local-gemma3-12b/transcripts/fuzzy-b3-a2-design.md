# fuzzy-b3-a2-design

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
"The concept fits the brief by clearly establishing the dungeon environment with stone pillars and crates as key cover elements, guiding the adventurer’s path from start to goal. It sounds fun by emphasizing peril and strategic use of cover, creating a tense and engaging gameplay experience."
Design a new, better level now.
```

## Response

```
{"name":"dungeon_entry","grid":[
"############",
"#S...P...#G#",
"#.P.X.P.X.#",
"#.....P..#.#",
"#P.X.X.P.#.#",
"#.......P.#.#",
"#P.X.P.X.P.#",
"#.......P.#.#",
"#P.X.X.P.#.#",
"#.....P..#.#",
"#.P.X.P.X.#",
"############"
]}
PITCH: Navigate a crumbling entry hall, utilizing pillars and crates for cover as you race toward the treasure beyond.
```

## Meta

```json
{
  "label": "fuzzy-b3-a2-design"
}
```
