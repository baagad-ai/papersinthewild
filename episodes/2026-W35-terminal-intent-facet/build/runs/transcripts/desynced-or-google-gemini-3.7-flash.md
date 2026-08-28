# desynced | or:google/gemini-3.7-flash | task t1

truth: true | key verdict: true | outcome: pass
cmd: `echo DONE > report.txt`
> echo DONE > report.txt

# desynced | or:google/gemini-3.7-flash | task t2

truth: true | key verdict: true | outcome: pass
cmd: `mkdir -p archive && mv notes.md archive/`
> mkdir -p archive && mv notes.md archive/

# desynced | or:google/gemini-3.7-flash | task t3

truth: true | key verdict: true | outcome: pass
cmd: `echo 'audit-ok' >> log.txt`
> echo 'audit-ok' >> log.txt

# desynced | or:google/gemini-3.7-flash | task t4

truth: true | key verdict: true | outcome: pass
cmd: `echo 42 > answer.txt`
> echo 42 > answer.txt
