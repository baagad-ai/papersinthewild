# clean6 | local:phi4-mini | task t1

true skill: csv-clean | picked: csv-clean | right: true | pass: false
> ```json {   "skill": "csv-clean",   "output": "a,b\n1,2\na-b,c-d" } ``` Note that the provided CSV was not cleaned correctly as there were missing data and incorrect formatting. The correct output should have been: ``` a,b 1,2 3,,4  ```

# clean6 | local:phi4-mini | task t2

true skill: url-utm | picked: url-utm | right: true | pass: true
> ```json {   "skill": "url-utm",   "output": "https://ex.com/p?a=1&utm_source=newsletter&utm_medium=email&utm_campaign=summer-ad" } ```

# clean6 | local:phi4-mini | task t3

true skill: slugify | picked: slugify | right: true | pass: true
> ```json {"skill":"slugify","output":"hello-world-again"} ```

# clean6 | local:phi4-mini | task t4

true skill: git-commit-msg | picked: git-commit-msg | right: true | pass: true
> ```json {"skill":"git-commit-msg","output":"Fix resolved login issue causing session timeouts"} ```

# clean6 | local:phi4-mini | task t5

true skill: email-subject | picked: email-subject | right: true | pass: true
> ```json {   "skill": "email-subject",   "output": "Urgent Server Outage Notification" } ```

# clean6 | local:phi4-mini | task t6

true skill: meeting-notes | picked: meeting-notes | right: true | pass: true
> { "skill":"meeting-notes", "output": "- Decided on the deployment process.\n- Ownership assigned to Priya for deploying.\n- Deployment deadline set for this coming Friday." }
