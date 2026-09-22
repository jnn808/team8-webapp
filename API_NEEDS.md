# API Needs Statements
# API Needs Statements — Week 2
Part D — API Needs Statements

1. GymBuddy needs to create a new report (category, description, timestamp)

   in ShieldBox, in order to let gym members submit incident and

   maintenance issues (e.g. broken equipment, safety concerns) directly

   from the GymBuddy app in real time.

2. GymBuddy needs to read the status of a single case using its unique

   case code, in order to display report progress (Pending / In Review /

   Resolved) in the member's "My Reports" tab on page load.

3. GymBuddy needs read access to be scoped strictly to individual case

   lookups by code, in order to respect ShieldBox's anonymity model — a

   general list of all reports is not needed or available, since an

   earlier assumption about a public "Maintenance Board" was ruled out

   during the partner interview.

4. GymBuddy needs to append additional details or follow-up notes to an existing report using  its case code, in order to allow members to provide extra context if an issue worsens or changes.

5. GymBuddy needs to withdraw or close a submitted report using its case code, in order to let members cancel an accidental submission or mark an issue resolved on their end.




## Reflection
Going into the interview, we'd assumed ShieldBox would expose something like a general "Maintenance Board" — a list view where GymBuddy could pull all open reports at once, similar to browsing any typical resource collection. That assumption was ruled out during the interview: ShieldBox's anonymity model means there's no general listing endpoint at all. Access is scoped strictly to individual case lookups by unique case code, so a member can only ever check the status of a report they already have the code for — never browse or discover others. This reframed the "My Reports" feature from something we could build as a simple list-and-filter view into something that has to work case-by-case, and it surfaced a question we hadn't resolved: whether the case code alone is sufficient access control, or whether an additional auth token is required per read. That's something we still need to close out with ShieldBox before finalizing the endpoint design.

