# Security Audit

## What was checked, found, and fixed

1. **Sensitive fields:** Checked response payloads. No passwords, internal flags, or unnecessary personal data are exposed to the API consumer[cite: 6]. 
2. **Other people's data:** Verified that users cannot access isolated data or records they shouldn't see[cite: 6].
3. **Error messages:** Checked error responses. The API returns safe, generic JSON error messages (e.g., "Too many requests", "Missing or invalid API key") rather than raw stack traces or database queries[cite: 6].
4. **Write endpoints:** Verified that POST routes do not blindly save all incoming payload fields (preventing attackers from sending extra fields like `isAdmin`)[cite: 6].
5. **Keys in the wrong place:** Confirmed that `.env` is listed in `.gitignore` and has not been committed to the repository history. Checked `README.md` to ensure only placeholder keys are used[cite: 6, 8].

## Rate Limit
- **Threshold:** 100 requests per 60,000ms (1 minute)[cite: 6].
- **Justification:** 100 requests per minute is a reasonable default that allows normal downstream consumer traffic while effectively preventing runaway scripts, infinite loops, or malicious spam[cite: 6].