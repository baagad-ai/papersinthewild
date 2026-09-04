# full-b6-rev-design

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
The studio head REJECTED your level with this reason: "I count one dead end. The brief asked for at least two; this is a corridor with an alcove, not a maze."
Your trace cards:
- attempt 1: studio head rejected (no reason given)
- attempt 2: studio head rejected (no reason given)
- attempt 3: studio head rejected (I count one dead end. The brief asked for at least two; this is a corridor with an alcove, not a maze.)
Design a new level that fixes the complaint.
```

## Response

```
{"name":"hedge_maze_v2","grid":[
"############",
"#S.....#....#",
"#.#.....#.#.#",
"#.#.#####.#.#",
"#.#.....#.#.#",
"#.#.#####.#.#",
"#.#.....#.#.#",
"#.#.#####.#.#",
"#.#.....#.#.#",
"#.#.#####.#.#",
"#.....#....#",
"############",
"#.........G#",
"############"]}
PITCH: Wander through a charming, compact hedge maze to reach the central fountain.
```

## Meta

```json
{
  "label": "full-b6-rev-design"
}
```
