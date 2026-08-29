# twins8 | local:gemma3:12b | task t1

true skill: csv-clean | picked: csv-clean | right: true | pass: true
> ```json {"skill":"csv-clean","output":"a,b\n1,2\n3,4"} ```

# twins8 | local:gemma3:12b | task t2

true skill: url-utm | picked: utm-builder-like | right: false | pass: false
> ```json {"skill":"utm-builder-like","output":"https://ex.com/p?a=1&utm_source=summer&utm_medium=campaign&utm_term=summer"} ```

# twins8 | local:gemma3:12b | task t3

true skill: slugify | picked: slugify | right: true | pass: true
> ```json {"skill":"slugify","output":"hello-world-again"} ```

# twins8 | local:gemma3:12b | task t4

true skill: git-commit-msg | picked: git-commit-msg | right: true | pass: true
> {"skill":"git-commit-msg","output":"Fix: Resolve login failure issue"}

# twins8 | local:gemma3:12b | task t5

true skill: email-subject | picked: email-subject | right: true | pass: true
> ```json {"skill":"email-subject","output":"Server Outage: Immediate Action Required"} ```

# twins8 | local:gemma3:12b | task t6

true skill: meeting-notes | picked: meeting-notes | right: true | pass: true
> {"skill":"meeting-notes","output": "- Decisions: Priya owns deploy.\n- Owners: Priya\n- Deadlines: Friday"}
