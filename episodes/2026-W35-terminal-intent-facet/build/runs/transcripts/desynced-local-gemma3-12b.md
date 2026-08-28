# desynced | local:gemma3:12b | task t1

truth: true | key verdict: true | outcome: pass
cmd: `echo "DONE" > report.txt`
> echo "DONE" > report.txt 

# desynced | local:gemma3:12b | task t2

truth: false | key verdict: false | outcome: loud_fail
cmd: ``tar -czvf archive.tar.gz notes.md && mv notes.md archive/``
> `tar -czvf archive.tar.gz notes.md && mv notes.md archive/` 

# desynced | local:gemma3:12b | task t3

truth: true | key verdict: true | outcome: pass
cmd: `echo "audit-ok" >> log.txt`
> echo "audit-ok" >> log.txt 

# desynced | local:gemma3:12b | task t4

truth: true | key verdict: true | outcome: pass
cmd: `echo 42 > answer.txt`
> echo 42 > answer.txt 
