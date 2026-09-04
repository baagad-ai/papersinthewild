# fuzzy-b4-a3-design

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
Your previous level concept got this consultant note:
"The concept fits the brief by clearly establishing the flower shop setting with buckets and a counter, but it could be more engaging by emphasizing the urgency and chaos of collecting flowers under time pressure. The idea sounds fun with its action-packed premise, but adding specific mechanics like timed collection or obstacles would enhance the gameplay loop."
Design a new, better level now.
```

## Response

```
{"name":"Floral Rush","grid":[
"############",
"#S..F.F.F.#",
"#..C..#..#",
"#..F..#..#",
"#..#..#..#",
"#..F..#..#",
"#..#..#..#",
"#..F..#..#",
"#..#..#..#",
"#..F..#..#",
"#..C..#..#",
"#.......G.#",
"############"
]}
PITCH: Rush through a chaotic flower shop, collecting blooms and racing to the bouquet counter before time runs out!
```

## Meta

```json
{
  "label": "fuzzy-b4-a3-design"
}
```
