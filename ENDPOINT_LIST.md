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

---

## Peer Review Feedback

**Overall:** No REST convention violations found. Clean, consistent use of nouns, correct HTTP verbs, and consistent pluralization throughout.

- **Rows 2, 4, 5** — Good pattern: all three target `/reports/{caseCode}` and let the HTTP verb (GET/DELETE/PATCH) carry the action instead of inventing separate action-named paths. 
- **Row 3** — `/reports/{caseCode}/notes` nesting is appropriate (notes only exist in the context of a report) and pluralization is consistent with `/reports`.
- **Row 5 (PATCH)** — Correct choice over PUT, since this is a partial update (just the status field), not a full resource replacement.