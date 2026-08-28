# desynced | local:qwen3:8b | task t1

truth: true | key verdict: true | outcome: pass
cmd: `echo DONE > report.txt`
> echo DONE > report.txt

# desynced | local:qwen3:8b | task t2

truth: true | key verdict: true | outcome: pass
cmd: `mkdir archive && mv notes.md archive/`
> mkdir archive && mv notes.md archive/

# desynced | local:qwen3:8b | task t3

truth: true | key verdict: true | outcome: pass
cmd: `echo 'audit-ok' >> log.txt`
> echo 'audit-ok' >> log.txt

# desynced | local:qwen3:8b | task t4

truth: true | key verdict: true | outcome: pass
cmd: `echo 42 > answer.txt`
> echo 42 > answer.txt
