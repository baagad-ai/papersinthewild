# full-b4-a3-design

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
Brief: A flower shop. Flower buckets (F) and a counter (C). A customer enters at S and reaches the bouquet counter G.
Your previous submission failed the engine check:
REACH at (10,8) [G]: no path exists from S to G; the goal is unreachable
Your trace cards so far:
- attempt 1: BORDER at (10,11): the outer wall has a hole; the world leaks into the void
- attempt 2: REACH at (10,8) [G]: no path exists from S to G; the goal is unreachable
Fix the level. Keep what works, repair what the engine named.
```

## Response

```
```json
{"name":"flower_shop","grid":[
"############",
"#S...F...#",
"#....F....#",
"#...C..F..#",
"#.......C.#",
"#..F..C..#",
"#..F..C..#",
"#..F..C..#",
"#..F..C..#",
"#.......G.#",
"#........#",
"############"]}
PITCH: Browse the fragrant blooms and reach the counter for a perfect bouquet.
```
```

## Meta

```json
{
  "label": "full-b4-a3-design"
}
```
