# clean6 | local:qwen3:8b | task t1

true skill: csv-clean | picked: csv-clean | right: true | pass: true
> {"skill":"csv-clean","output":"a,b\n1,2\n3,4"}

# clean6 | local:qwen3:8b | task t2

true skill: url-utm | picked: (none) | right: false | pass: false
> 

# clean6 | local:qwen3:8b | task t3

true skill: slugify | picked: slugify | right: true | pass: false
> {"skill":"slugify","output":"hello-world-again-"}

# clean6 | local:qwen3:8b | task t4

true skill: git-commit-msg | picked: git-commit-msg | right: true | pass: true
> {"skill":"git-commit-msg","output":"Fix login bug"}

# clean6 | local:qwen3:8b | task t5

true skill: email-subject | picked: email-subject | right: true | pass: true
> {"skill":"email-subject","output":"Server Outage: Urgent Resolution Needed"}

# clean6 | local:qwen3:8b | task t6

true skill: meeting-notes | picked: meeting-notes | right: true | pass: true
> {"skill":"meeting-notes","output":"- Decision: Priya owns deploy by Friday\n- Owner: Priya\n- Deadline: Friday"}
