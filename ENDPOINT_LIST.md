| Method | Path | Purpose | Maps to Need |
|---|---|---|---|
| POST | `/reports` | Create a new report with the category, description, and timestamp so gym members can submit incident or maintenance issues from the GymBuddy app in real time. | Need 1 — Create a new report |
| GET | `/reports/{caseCode}` | Read the status of a single report using its unique case code so GymBuddy can display report progress (Pending / In Review / Resolved) in "My Reports". | Need 2 — Read the status of a single case |
| POST | `/reports/{caseCode}/notes` | Add a follow-up note or additional detail to an existing report so members can provide context if an issue worsens or changes. | Need 4 — Append additional details or follow-up notes |
| DELETE | `/reports/{caseCode}` | Withdraw a report that was submitted by accident. | Need 5 — Withdraw a submitted report |
| PATCH | `/reports/{caseCode}` | Mark an existing report as resolved on the member's end. | Need 5 — Close a submitted report |

**Note on scope:** No general listing endpoint (e.g. `GET /reports`) exists. Access 
is scoped strictly to individual case lookups by code, per ShieldBox's anonymity 
model this was confirmed during the Week 2 partner interview and further discussion after today's class
