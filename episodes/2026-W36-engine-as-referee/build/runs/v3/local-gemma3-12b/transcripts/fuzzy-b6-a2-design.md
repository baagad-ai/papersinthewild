# fuzzy-b6-a2-design

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
Your previous level concept got this consultant note:
"The concept fits the brief by creating a compact, hedge-formed maze with two dead ends and a clear path from S to G, but it lacks the charm and whimsy needed to make the experience feel truly engaging and fun. The idea is simple and functional, but it could benefit from more vivid imagery and a stronger sense of exploration to enhance the playful experience."
Design a new, better level now.
```

## Response

```
{"name":"HedgeHaven","grid":[
"############",
"#S.A.B.C.D#",
"#.#######.#",
"#.A.G.B.D#",
"#.#######.#",
"#.C.A.E.F#",
"#.#######.#",
"#.D.B.G.C#",
"#.#######.#",
"#.F.E.A.B#",
"#.#######.#",
"#.G.D.C.A#",
"############"]}
PITCH: Discover a whimsical, overgrown garden maze, complete with hidden blooms and a sparkling fountain at its heart.
```

## Meta

```json
{
  "label": "fuzzy-b6-a2-design"
}
```
