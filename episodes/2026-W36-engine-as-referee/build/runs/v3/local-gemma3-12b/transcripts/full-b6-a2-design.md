# full-b6-a2-design

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
Brief: A tiny hedge maze garden. The hedges must form at least two dead ends. A visitor enters at S and reaches the fountain G.
Your previous submission failed the engine check:
BORDER at (11,1): the outer wall has a hole; the world leaks into the void
Your trace cards so far:
- attempt 1: BORDER at (11,1): the outer wall has a hole; the world leaks into the void
Fix the level. Keep what works, repair what the engine named.
```

## Response

```
```json
{"name":"hedge_maze","grid":[
"############",
"#S#.#.#.#.#",
"#.#.#######.#",
"#.#.#######.#",
"#.#.#######.#",
"#.#.#######.#",
"#.#.#######.#",
"#.#.#######.#",
"#.#.#######.#",
"#.#.#######.#",
"#.#.###.G.#",
"############"
]}
PITCH: Navigate a charming, miniature hedge maze to reach the refreshing fountain.
```
```

## Meta

```json
{
  "label": "full-b6-a2-design"
}
```
