# full-b4-rev-design

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
The studio head REJECTED your level with this reason: "Counters scattered mid-floor read cafe, not flower shop; the buckets clump in one column."
Your trace cards:
- attempt 1: studio head rejected (no reason given)
- attempt 2: studio head rejected (no reason given)
- attempt 3: studio head rejected (Counters scattered mid-floor read cafe, not flower shop; the buckets clump in one column.)
The studio head accepted this level for the same brief:
  0 1 2 3 4 5 6 7 8 9 0 1
0 ############
1 #S.F.F.F.F##
2 #.C.########
3 #.......#..#
4 #.F.F.F.F.##
5 #.......#..#
6 #.F.F.F.F.##
7 #.......#..#
8 #.F.F.F.F.##
9 #.......#..#
0 #........G##
1 ############
props: F1=F F2=F F3=F F4=F C1=C F5=F F6=F F7=F F8=F F9=F F10=F F11=F F12=F F13=F F14=F F15=F F16=F
Design a new level that fixes the complaint.
```

## Response

```
{"name":"FloralDelight","grid":[
"############",
"#S.F..C.F.F#",
"#.......#..#",
"#F.F..F.F.F#",
"#.......#..#",
"#F.C.F..F.F#",
"#.......#..#",
"#F.F..F.F.F#",
"#.......#..#",
"#F.C.F..F.F#",
"#.......#..#",
"#....G...F.#"
]}
PITCH: Stroll through a charming flower shop, collecting blooms on your way to the bouquet counter.
```

## Meta

```json
{
  "label": "full-b4-rev-design"
}
```
