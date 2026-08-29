# clean8 | local:qwen3:8b | task t1

true skill: csv-clean | picked: csv-clean | right: true | pass: true
> {"skill":"csv-clean","output":"a,b\n1,2\n3,4"}

# clean8 | local:qwen3:8b | task t2

true skill: url-utm | picked: url-utm | right: true | pass: true
> {"skill":"url-utm","output":"https://ex.com/p?a=1&utm_source=ex&utm_medium=campaign&utm_campaign=summer"}

# clean8 | local:qwen3:8b | task t3

true skill: slugify | picked: (none) | right: false | pass: false
> 

# clean8 | local:qwen3:8b | task t4

true skill: git-commit-msg | picked: git-commit-msg | right: true | pass: true
> {"skill":"git-commit-msg","output":"Fix login bug"}

# clean8 | local:qwen3:8b | task t5

true skill: email-subject | picked: email-subject | right: true | pass: true
> {"skill":"email-subject","output":"Server Outage: Investigating"}

# clean8 | local:qwen3:8b | task t6

true skill: meeting-notes | picked: meeting-notes | right: true | pass: true
> {"skill":"meeting-notes","output":"- Decision: Priya owns deploy\n- Owner: Priya\n- Deadline: Friday"}
