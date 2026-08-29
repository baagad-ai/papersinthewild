# clean6 | local:phi4-mini | task t1

true skill: csv-clean | picked: csv-clean | right: true | pass: false
> ```json {"skill":"csv-clean","output":"a,b\n1,2\na-b\tc-d"} ``` Note that the cleaned CSV text still contains non-alphanumeric characters (' ', '\t') which are not typically part of a standard alphanumerical character set for slugs. If you 

# clean6 | local:phi4-mini | task t2

true skill: url-utm | picked: url-utm | right: true | pass: true
> ```json {   "skill": "url-utm",   "output": "https://ex.com/p?a=1&utm_source=email&utm_medium=newsletter&utm_campaign=summer" } ```

# clean6 | local:phi4-mini | task t3

true skill: slugify | picked: slugify | right: true | pass: true
> ```json {"skill":"slugify","output":"hello-world-again"} ```

# clean6 | local:phi4-mini | task t4

true skill: git-commit-msg | picked: git-commit-msg | right: true | pass: true
> ```json {"skill":"git-commit-msg","output":"Fix critical authentication failure causing user lockout"} ```

# clean6 | local:phi4-mini | task t5

true skill: email-subject | picked: email-subject | right: true | pass: true
> ```json {   "skill": "email-subject",   "output": "Urgent Server Outage Alert" } ```

# clean6 | local:phi4-mini | task t6

true skill: meeting-notes | picked: meeting-notes | right: true | pass: true
> ```json {   "skill": "meeting-notes",   "output": "- Decided to assign deployment ownership to Priya \n- Ownership assigned for the task of deploying is now with Priya \n- Deadline set as this week, end by next week's start." } ```
