# full-b5-rev-design

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
Brief: A night market stall row. Food stalls (M) and crates (X). A visitor enters at S and reaches the food stall G.
The studio head REJECTED your level with this reason: "Stall-and-crate stripes read as warehouse racking, not a night market."
Your trace cards:
- attempt 1: studio head rejected (Stall-and-crate stripes read as warehouse racking, not a night market.)
The studio head accepted this level for the same brief:
  0 1 2 3 4 5 6 7 8 9 0 1
0 ############
1 #S........##
2 #..X..X..###
3 #..M..X..###
4 #..X..X..###
5 #..M..X..###
6 #..X..X..###
7 #..M..X..###
8 #..X..X..###
9 #..M..X..###
0 #........G##
1 ############
props: X1=X X2=X M1=M X3=X X4=X X5=X M2=M X6=X X7=X X8=X M3=M X9=X X10=X X11=X M4=M X12=X
Design a new level that fixes the complaint.
```

## Response

```
{"name":"night_market","grid":[
"############",
"#S..M..X..#",
"#..X..M..##",
"#...X..X..#",
"#..M..X..##",
"#..X..X..##",
"#..M..X..##",
"#...X..X..#",
"#..M..X..##",
"#..X..M..##",
"#...X..X..#",
"#..G..M..##",
"############"]}
PITCH: Experience the vibrant chaos of a bustling night market, from the entrance to the best food stall.
```

## Meta

```json
{
  "label": "full-b5-rev-design"
}
```
