# clean8 | local:gemma3:12b | task t1

true skill: csv-clean | picked: csv-clean | right: true | pass: true
> ```json {"skill":"csv-clean","output":"a,b\n1,2\n3,4"} ```

# clean8 | local:gemma3:12b | task t2

true skill: url-utm | picked: url-utm | right: true | pass: true
> ```json {"skill":"url-utm","output":"https://ex.com/p?a=1&utm_source=internal&utm_medium=email&utm_campaign=summer"} ```

# clean8 | local:gemma3:12b | task t3

true skill: slugify | picked: slugify | right: true | pass: true
> {"skill":"slugify","output":"hello-world-again"}

# clean8 | local:gemma3:12b | task t4

true skill: git-commit-msg | picked: git-commit-msg | right: true | pass: true
> {"skill":"git-commit-msg","output":"Fix: Resolve login authentication error"}

# clean8 | local:gemma3:12b | task t5

true skill: email-subject | picked: email-subject | right: true | pass: true
> {"skill":"email-subject","output":"Server Outage: Immediate Action Required"}

# clean8 | local:gemma3:12b | task t6

true skill: meeting-notes | picked: meeting-notes | right: true | pass: true
> {"skill":"meeting-notes","output":"- Decisions: Priya owns deploy.\n- Owners: Priya\n- Deadlines: Friday"}
