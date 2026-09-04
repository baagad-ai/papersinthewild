# full-b1-rev-design

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
The studio head REJECTED your level with this reason: "Nook walls overcomplicate a cozy cafe; a customer needs the floor plan explained to find the counter."
Your trace cards:
- attempt 1: studio head rejected (no reason given)
- attempt 2: studio head rejected (Nook walls overcomplicate a cozy cafe; a customer needs the floor plan explained to find the counter.)
The studio head accepted this level for the same brief:
  0 1 2 3 4 5 6 7 8 9 0 1
0 ############
1 #S...C..T.P#
2 #....T..C..#
3 #.B...P..P.#
4 #.T..C..B..#
5 #...B..P..##
6 #.P..C..B.##
7 #.T..P..P.##
8 #..B..C..B.#
9 #.P..T..P.##
0 #...G..P..##
1 ############
props: C1=C T1=T P1=P T2=T C2=C B1=B P2=P P3=P T3=T C3=C B2=B B3=B P4=P P5=P C4=C B4=B T4=T P6=P P7=P B5=B C5=C B6=B P8=P T5=T P9=P P10=P
Design a new level that fixes the complaint.
```

## Response

```
{"name":"Cafe_Simplicity","grid":[
"############",
"#S...C..T.P#",
"#....T..C..#",
"#.B...P..P.#",
"#.T..C..B..#",
"#...B..P..##",
"#..C..T..B.#",
"#..B..C..B.#",
"#..P..T..P.#",
"#...G..P..##",
"#..........#",
"############"]}
PITCH: Enjoy a relaxed coffee experience in this open-plan cafe with clear sightlines to the counter.
```

## Meta

```json
{
  "label": "full-b1-rev-design"
}
```
