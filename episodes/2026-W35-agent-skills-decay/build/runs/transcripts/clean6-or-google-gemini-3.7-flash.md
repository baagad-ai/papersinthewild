# clean6 | or:google/gemini-3.7-flash | task t1

true skill: csv-clean | picked: csv-clean | right: true | pass: true
> {"skill":"csv-clean","output":"a,b\n1,2\n3,4"}

# clean6 | or:google/gemini-3.7-flash | task t2

true skill: url-utm | picked: (none) | right: false | pass: false
> ```json {"skill":"url-utm","output":"https://ex.com/p?a=1&utm_source=summer&utm_medium=campaign&utm

# clean6 | or:google/gemini-3.7-flash | task t3

true skill: slugify | picked: slugify | right: true | pass: true
> {"skill":"slugify","output":"hello-world-again"}

# clean6 | or:google/gemini-3.7-flash | task t4

true skill: git-commit-msg | picked: git-commit-msg | right: true | pass: true
> {"skill":"git-commit-msg","output":"Fix login bug"}

# clean6 | or:google/gemini-3.7-flash | task t5

true skill: email-subject | picked: email-subject | right: true | pass: true
> ```json {"skill":"email-subject","output":"Resolve ongoing server outage"} ```

# clean6 | or:google/gemini-3.7-flash | task t6

true skill: meeting-notes | picked: meeting-notes | right: true | pass: true
> {"skill":"meeting-notes","output":"• Decisions: Deploy scheduled\n• Owners: Priya\n• Deadlines: Friday"}
