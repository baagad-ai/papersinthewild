# intact | local:qwen3:8b | task t1

truth: false | key verdict: false | outcome: loud_fail
cmd: ``
> 

# intact | local:qwen3:8b | task t2

truth: true | key verdict: true | outcome: pass
cmd: `mkdir archive && mv notes.md archive/`
> mkdir archive && mv notes.md archive/

# intact | local:qwen3:8b | task t3

truth: true | key verdict: true | outcome: pass
cmd: `echo "audit-ok" >> log.txt`
> echo "audit-ok" >> log.txt

# intact | local:qwen3:8b | task t4

truth: true | key verdict: true | outcome: pass
cmd: `echo 42 > answer.txt`
> echo 42 > answer.txt
