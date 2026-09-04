# fuzzy-b3-a1-design

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
Design the level now.
```

## Response

```
{"name":"dungeon_entry","grid":[
"############",
"#S........#",
"#P..X..P..#",
"#.......P.#",
"#P.X..P..#",
"#........#",
"#P..X..P.#",
"#........#",
"#P.X..P..#",
"#.......P.#",
"#P..X..P..#",
"#........G#",
"############"
]}
PITCH: Descend into the dungeon, utilizing pillars and crates for cover on your perilous journey to the treasure!
```

## Meta

```json
{
  "label": "fuzzy-b3-a1-design"
}
```
