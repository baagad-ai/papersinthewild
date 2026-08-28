# desynced | local:phi4-mini | task t1

truth: true | key verdict: true | outcome: pass
cmd: `touch report.txt && echo "DONE" > report.txt`
> touch report.txt && echo "DONE" > report.txt

# desynced | local:phi4-mini | task t2

truth: true | key verdict: true | outcome: pass
cmd: `mkdir archive && mv notes.md archive/`
> mkdir archive && mv notes.md archive/

# desynced | local:phi4-mini | task t3

truth: true | key verdict: true | outcome: pass
cmd: `cat > log.txt <<-EOF
audit-ok
EOF`
> cat > log.txt <<-EOF audit-ok EOF

# desynced | local:phi4-mini | task t4

truth: true | key verdict: true | outcome: pass
cmd: `echo "42" > answer.txt`
> echo "42" > answer.txt
