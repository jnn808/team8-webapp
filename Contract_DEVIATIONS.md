# Contract Deviations week 5 

No deviations.

The only change made to `openapi.yaml` was adding a `servers:` entry 
pointing to `http://localhost:3001`, so Swagger UI/Editor knows where 
to send "Try it out" requests during local development. This is 
metadata for testing, not a change to any endpoint, field name, type, 
or status code — the schema itself matches Week 4 exactly.

GET /reports/{caseCode} was implemented against the existing contract 
with no modifications needed. Verified in Swagger UI: a valid case 
code returns 200 with the exact contract shape, and an unknown case 
code returns 404.


# Contract Deviations — Week 6

## Status: No deviations this week.

All Week 6 write endpoints (`POST /reports`, `PATCH /reports/{caseCode}`,
`DELETE /reports/{caseCode}`, `POST /reports/{caseCode}/notes`) were
implemented exactly as specified in `openapi.yaml`:

- Required fields, enums, and response shapes match the contract's schemas.
- Status codes match the contract's documented responses (201 / 200 / 204 /
  400 / 404) for every endpoint.
- Internal database column names (`desc_text`, `current_status`,
  `date_created`) intentionally differ from the contract's field names
  (`description`, `status`, `createdAt`) — this is expected, not a
  deviation. `server/db.js` and `server/routes/reports.js` perform the
  mapping step so the API response always matches the contract regardless
  of internal storage naming.

## Minor polish note (non-blocking)
`noteId` is generated as `not-{auto-increment id}` (e.g. `not-14`), which
doesn't zero-pad to match the contract's example format (`not-001`). The
contract does not specify a `pattern` or `format` constraint on `noteId`
beyond `type: string`, so this is schema-valid — flagged here only for
visual consistency with the example, not a functional deviation.

---
*Last confirmed accurate: Week 6 submission.*