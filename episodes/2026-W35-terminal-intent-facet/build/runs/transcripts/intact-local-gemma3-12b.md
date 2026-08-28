# intact | local:gemma3:12b | task t1

truth: true | key verdict: true | outcome: pass
cmd: `ell
echo "DONE" > report.txt`
> ```shell echo "DONE" > report.txt ```

# intact | local:gemma3:12b | task t2

truth: false | key verdict: false | outcome: loud_fail
cmd: `tar -czvf archive.tar.gz notes.md && mv notes.md archive/`
> ```bash tar -czvf archive.tar.gz notes.md && mv notes.md archive/ ``` 

# intact | local:gemma3:12b | task t3

truth: true | key verdict: true | outcome: pass
cmd: `echo "audit-ok" >> log.txt`
> echo "audit-ok" >> log.txt 

# intact | local:gemma3:12b | task t4

truth: true | key verdict: true | outcome: pass
cmd: `echo 42 > answer.txt`
> echo 42 > answer.txt 
