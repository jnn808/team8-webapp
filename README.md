# ShieldBox Incident Reporting API

ShieldBox is a small REST API that lets gym members anonymously submit,
track, and manage incident, maintenance, harassment, and safety reports.
It is built for the GymBuddy app: a member files a report, gets back a
**case code** (like `SB-88219`), and uses that code to check progress, add
follow-up notes, mark it resolved, or withdraw it. There is no way to list
all reports, by design: you can only look up a report if you hold its code.

- **Base URL (local):** `http://localhost:3001`
- **Live demo URL (for testers):** `http://<FILL IN YOUR IP>:3001`
- **Format:** every request and response body is JSON.
- **Full reference docs:** open `docs/index.html` in a browser.

## Authentication

None yet. You do **not** need a token or API key: send requests as shown
below. Real authentication is planned for Week 9; this section will change
then.

## Quickstart (one command)

Make sure the API is running (see [Run it locally](#run-it-locally)), then
open a terminal and run:

```
curl http://localhost:3001/reports/SB-88219
```

> **Windows PowerShell users:** type `curl.exe` instead of `curl`
> (plain `curl` is a different command in PowerShell). Do this for every
> example below.

You should get back `200` and:

```json
{
  "caseCode": "SB-88219",
  "category": "maintenance",
  "description": "Cable crossover machine pulley is frayed and slipping under load.",
  "status": "In Review",
  "createdAt": "2026-09-09T05:30:00.000Z",
  "notes": [
    {
      "noteId": "not-17",
      "message": "Staff has cordoned off the area around the machine.",
      "createdAt": "2026-09-09T06:00:00.000Z"
    }
  ]
}
```

(`SB-88219` is sample data created by `npm run db:seed`. Timestamps and
`noteId` numbers may differ slightly on your machine.)

## Endpoints

### 1. Create a report: `POST /reports`

Body fields (both required): `category` (one of `incident`, `maintenance`,
`harassment`, `safety`) and `description` (non-empty text).

```
curl -X POST http://localhost:3001/reports -H "Content-Type: application/json" -d "{\"category\":\"maintenance\",\"description\":\"Treadmill belt slipping\"}"
```

Response: `201 Created`

```json
{
  "caseCode": "SB-54697",
  "category": "maintenance",
  "description": "Treadmill belt slipping",
  "status": "Pending",
  "createdAt": "2026-10-13T11:30:44.000Z"
}
```

Save the `caseCode`: you need it for every other call. (Yours will be
different.)

### 2. Read a report: `GET /reports/{caseCode}`

```
curl http://localhost:3001/reports/SB-54697
```

Response: `200 OK`. Same shape as the quickstart above, with `notes` as an
empty list `[]` if nobody has added a note yet.

### 3. Add a follow-up note: `POST /reports/{caseCode}/notes`

Body field (required): `message` (non-empty text).

```
curl -X POST http://localhost:3001/reports/SB-54697/notes -H "Content-Type: application/json" -d "{\"message\":\"Cable snapped completely\"}"
```

Response: `201 Created`

```json
{
  "noteId": "not-20",
  "caseCode": "SB-54697",
  "message": "Cable snapped completely",
  "createdAt": "2026-10-13T11:34:57.000Z"
}
```

### 4. Mark a report resolved: `PATCH /reports/{caseCode}`

Body field (required): `status`, and the only allowed value is `"Resolved"`.
Sending it twice is safe: you end up in the same state both times.

```
curl -X PATCH http://localhost:3001/reports/SB-54697 -H "Content-Type: application/json" -d "{\"status\":\"Resolved\"}"
```

Response: `200 OK`

```json
{
  "caseCode": "SB-54697",
  "status": "Resolved",
  "updatedAt": "2026-10-13T11:37:37.000Z"
}
```

### 5. Withdraw (delete) a report: `DELETE /reports/{caseCode}`

```
curl -i -X DELETE http://localhost:3001/reports/SB-54697
```

Response: `204 No Content` (nothing in the body: that means it worked).
Asking for that case code afterwards returns `404`.

## Errors

Failed requests use a normal HTTP error status plus a small JSON body.
There are **two shapes**, depending on the kind of failure:

| Status | Meaning | Body shape |
|---|---|---|
| `400 Bad Request` | You sent a missing, wrong, or empty field | `{ "message": "..." }` |
| `404 Not Found` | That `caseCode` does not exist | `{ "error": "..." }` |

Real examples:

`POST /reports` with no `category` → `400`
```json
{ "message": "category is required." }
```

`POST /reports` with `"category":"banana"` → `400`
```json
{ "message": "category must be one of: incident, maintenance, harassment, safety." }
```

`PATCH /reports/SB-88219` with `{"status":"Closed"}` → `400`
```json
{ "message": "status must be exactly \"Resolved\"." }
```

`GET /reports/SB-00000` → `404`
```json
{ "error": "No report found with caseCode \"SB-00000\"." }
```

Tip: a `message` key means *you* sent something wrong; an `error` key means
the thing you asked for was not found.

## Run it locally

Starting from a completely clean computer, you need:

1. **Node.js 20 or newer** (check with `node -v`).
2. **MySQL running on port 3306** with user `root` and no password. The
   easiest way is XAMPP: open the XAMPP Control Panel and click **Start**
   next to **MySQL** only (Apache is not needed).
3. **Git.**

Then run these commands one at a time:

```
git clone https://github.com/jnn808/team8-webapp.git
cd team8-webapp
npm install
npm run db:seed
npm run server
```

- `npm run db:seed` creates the `shieldbox` database and 3 sample reports
  (`SB-88219`, `SB-71042`, `SB-30087`). Re-run it any time to reset the data.
- `npm run server` starts the API. Leave that terminal open. You should see:
  `ShieldBox API listening at http://localhost:3001`
- Check it's alive: open <http://localhost:3001> in a browser. You should
  see `ShieldBox API is running.`

Different MySQL password or port? Set `DB_PASSWORD`, `DB_PORT`, `DB_USER`,
or `DB_HOST` as environment variables before `npm run server`.
## Authentication
All API endpoints require a valid API key passed in the `X-API-Key` header.
**Example Request:**
`curl -H "X-API-Key: <your-api-key>" http://localhost:3001/reports`

**Error Responses:**
- `401 Unauthorized`: Returned if the key is missing or invalid.
- `429 Too Many Requests`: Returned if you exceed the rate limit[cite: 7].

## Rate Limiting
This API limits consumers to **100 requests per minute**[cite: 7]. If you exceed this, you will receive a `429` status code and a `Retry-After` header indicating how many seconds to wait[cite: 7].