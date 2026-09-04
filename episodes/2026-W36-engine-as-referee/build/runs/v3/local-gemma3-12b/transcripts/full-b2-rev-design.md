# full-b2-rev-design

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
The studio head REJECTED your level with this reason: "Four shelves and one table is a pamphlet rack in an empty hall. This is not a library yet."
Your trace cards:
- attempt 1: studio head rejected (no reason given)
- attempt 2: studio head rejected (no reason given)
- attempt 3: studio head rejected (Four shelves and one table is a pamphlet rack in an empty hall. This is not a library yet.)
The studio head accepted this level for the same brief:
  0 1 2 3 4 5 6 7 8 9 0 1
0 ############
1 #S.B.B.B.B##
2 #.B.B.B.B.##
3 #.B.B.B.B.##
4 #.B.B.B.B.##
5 #.B.B.B.B.##
6 #.B.B.B.B.##
7 #.......T.##
8 #.......T.##
9 #.......T.##
0 #........G##
1 ############
props: B1=B B2=B B3=B B4=B B5=B B6=B B7=B B8=B B9=B B10=B B11=B B12=B B13=B B14=B B15=B B16=B B17=B B18=B B19=B B20=B B21=B B22=B B23=B B24=B T1=T T2=T T3=T
Design a new level that fixes the complaint.
```

## Response

```
{"name":"OldLibrary","grid":[
"############",
"#S.B.B.B.B#",
"#.B.B.B.B.B#",
"#.B.B.B.B.B#",
"#.B.B.B.B.B#",
"#.B.B.B.B.B#",
"#.B.B.B.B.B#",
"#.......T.B#",
"#.......T.B#",
"#.......T.B#",
"#.....G....#",
"############"
]}
PITCH: A cozy library with towering bookshelves and a comfortable reading table awaits the eager reader.
```

## Meta

```json
{
  "label": "full-b2-rev-design"
}
```
