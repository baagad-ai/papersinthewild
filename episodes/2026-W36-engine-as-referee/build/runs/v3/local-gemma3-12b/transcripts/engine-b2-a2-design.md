# engine-b2-a2-design

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
Brief: A small library. Bookshelves (B) along at least one wall, plus a reading table (T). A reader enters at S and reaches the reading nook G.
Your previous submission failed the engine check:
SUPPORT at (3,1) [B2]: rests inside solid tiles; no floor touches it
Fix the level. Keep what works, repair what the engine named.
```

## Response

```
```json
{"name":"library","grid":[
"############",
"#S.B.B.B.B#",
"#.B.B.B.B.#",
"#.B.B.B.B.#",
"#.B.B.B.B.#",
"#.B.B.B.B.#",
"#.B.B.B.B.#",
"#.......T.#",
"#.......T.#",
"#.......T.#",
"#........G#",
"############"
]}
PITCH: Quietly browse the shelves and settle into a cozy reading nook.
```
```

## Meta

```json
{
  "label": "engine-b2-a2-design"
}
```
