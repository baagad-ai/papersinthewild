# clean8 | local:phi4-mini | task t1

true skill: csv-clean | picked: csv-clean | right: true | pass: false
> ```json {   "skill": "csv-clean",   "output": "'a-b\n1-2\n'3--\n" } ```

# clean8 | local:phi4-mini | task t2

true skill: url-utm | picked: url-utm | right: true | pass: true
> ```json {   "skill": "url-utm",   "output": "https://ex.com/p?a=1&utm_source=newsletter&utm_medium=email&utm_campaign=summer" } ```

# clean8 | local:phi4-mini | task t3

true skill: slugify | picked: slugify | right: true | pass: true
> ```json {"skill":"slugify","output":"hello-world-again"} ```

# clean8 | local:phi4-mini | task t4

true skill: git-commit-msg | picked: git-commit-msg | right: true | pass: true
> ```json {   "skill": "git-commit-msg",   "output": "Fix login issue causing authentication errors" } ```

# clean8 | local:phi4-mini | task t5

true skill: email-subject | picked: email-subject | right: true | pass: false
> ```json {   "skill": "email-subject",   "output": "Server Outage Reported - Immediate Attention Required" } ```

# clean8 | local:phi4-mini | task t6

true skill: meeting-notes | picked: meeting-notes | right: true | pass: true
> ```json {   "skill": "meeting-notes",   "output": "- Decide to onboard new member, Priya.\n- Assign deployment task ownership to Priya.\n- Deadline set for completion of the first phase is this coming Friday." } ```
