# Blind Test Report: Week 8

**Name:** Pharell
**Date:** 14 October 2026


---

## 1. Blind test I ran

**README tested:** NyumbaHub API (house-hunting API for Kenya: listings, bookings, escrow status, students)
**Team tested:** Team 10, outside my ring partners
**How I reached the API:** Local setup only. The README gave no live URL, so I had to clone the repo and run it myself (Node 18+, MySQL 8 or MariaDB, Git).

**Result:** Success. I got a working response from their API using only their README.
**Total time:** About 54 minutes (README received around 07:41, first successful response at 08:35). Most of that was setup trouble on my machine (see the table below), not the API call itself.
**First call attempted:** `curl.exe "http://localhost:5000/listings?status=available&updatedSince=2026-01-01"`
**Response received:** Returned the two sample listings (ids `1` and `2`, `status: available`, reasons `vacated` and `newly_listed`, `updatedAt` 2026-09-21T19:54:06.000Z). It matched the README's example exactly, including the timestamps.

### What the README did well
- It had all five required parts: overview, auth, an example for every endpoint, an error reference and local run steps.
- Auth was unambiguous: it says no token is needed.
- The README includes a separate PowerShell command for POST and PUT, and warns about the `curl` vs `curl.exe` difference.
- The error section documents two different error body shapes and gives real examples.

### Where I got stuck, and whose fault it was

| # | What happened | README line involved | Docs gap or my setup? |
|---|---|---|---|
| 1 | `mysql -u root -p` failed in PowerShell: "The term 'mysql' is not recognized." | `mysql -u root -p -e "source schema.sql"` | **Docs gap.** The README assumes `mysql` is on the PATH and gives no fallback, such as using the full path to `mysql.exe` (common with XAMPP on Windows). |
| 2 | I could not remember my MySQL root password. | "open `.env` and put in your own MySQL password" | **My setup.** The README tells the reader to use their own password. It does not say that XAMPP's root account is often blank, which would have saved time (minor gap). |
| 3 | I had two installs, MySQL Server 8.0 and XAMPP's MariaDB, both on port 3306. XAMPP's MySQL would not start ("Port 3306 in use"), and the client gave `ERROR 1045 caching_sha2_password` because it was talking to the wrong server. | "MySQL 8 (or MariaDB, as bundled with XAMPP) running on port 3306" | **My setup.** The README does list both options. It does not mention port conflicts, which would be a nice-to-have addition. |
| 4 | No problems during `npm install`, the `schema.sql` import or `npm run dev` once the database was running. | | None |

I did not count the port conflict or the forgotten password against the other team. A reasonable reader with one clean install would not have hit them. The PATH issue I did count, because a reader following the README literally on Windows with XAMPP gets stuck at that line.

**Fix I used to get unstuck:** stopped the standalone MySQL service, started XAMPP's MySQL, ran `C:\xampp\mysql\bin\mysql.exe -u root` by full path, set `DB_PASSWORD=` (empty) in `server/.env`, loaded `schema.sql`, then ran `npm run dev`.

### Suggestions for the other team
1. Add a fallback for when `mysql` is not recognized (full path for XAMPP, `C:\xampp\mysql\bin\mysql.exe`).
2. Note that XAMPP's root user usually has no password, so `DB_PASSWORD=` can be left empty.
3. Mention that only one MySQL server can use port 3306 at a time.
4. Optional: host the API (or provide a shared URL) so a stranger can test without setting up a database.

---

## 2. Blind test of my README (their attempt)

**Team who tested my README:** Team 10
**Did they succeed?** - Quickstart: GET /reports/SB-88219 returned 200 with the response in your README.
- Errors: the 400 {"message": ...} and the 404 {"error": ...} both matched your examples.
- Local run: npm install, npm run db:seed and npm run server all worked.
**How long did it take?** 30 minutes
**Where did they get stuck?** 1. I couldn't test your live API and had to run it locally.
2. My first npm install left a broken package (content-type) and npm run server crashed with MODULE_NOT_FOUND. Deleting node_modules and running npm install again fixed it. A one-line troubleshooting note would save the next person.
3. The POST examples use \" escaping, which only works in cmd. In PowerShell the JSON body was mangled and the server returned invalid-JSON errors. Putting the body in a file and using -d "@body.json" worked. A PowerShell version of each POST/PATCH example would fix this.
4. Malformed JSON returns an HTML error page, not one of the two JSON error shapes in your Errors section. Either document it or add a JSON error handler.

---

## 3. What I fixed, and what I'm flagging

**Fixed in my docs:** Did: 1. ran your API locally instead. 2. Deleted node_modules, ran npm install again, and it started.
   Suggest: add a troubleshooting line: "If you get MODULE_NOT_FOUND, delete node_modules and run npm install again." 3. saved the body to body.json and used -d "@body.json", which worked. 4. Malformed JSON returned an HTML error page, not your documented JSON error shapes. Did nothing, I only noticed it.


**Lesson from testing their README:** a README can be accurate and still fail a stranger at the very first command. Part of my own README should be re-read as if I had never seen the project, especially the "run locally" section and any command that assumes a tool is on the PATH.

---

## 4. Honest summary

I followed the NyumbaHub README literally and got a working response from their API: a 200 with the two sample listings, matching the README's example exactly. It took about 54 minutes, well over the 20-minute window. Most of that was my own setup: I had forgotten my MySQL root password, and I had both MySQL 8.0 and XAMPP installed, which fought over port 3306 until I stopped one. I don't count those against the other team. The one real docs gap I hit was that their README assumes mysql is on the PATH and gives no fallback, so the import command failed in PowerShell until I used the full path to mysql.exe.

Our own README was only partly successful. The team that tested it got a working response (GET /reports/SB-88219 returned 200, and our 400 and 404 examples matched), but only by running the API locally, because our live demo URL was a placeholder. They also got stuck on a broken package after npm install and on POST examples that failed in PowerShell because of our quote escaping, and they found that malformed JSON returns an undocumented HTML error page. Those were gaps in our docs, not problems with their setup. We have not fixed them yet, and our POST, notes, PATCH and DELETE endpoints were never tested by an outsider, so I can't claim those examples work.
