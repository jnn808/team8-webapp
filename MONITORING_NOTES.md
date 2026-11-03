# Monitoring Notes

## Part A: Predictions
1. **Which endpoint will be the slowest?** 
   - I predict `/api/partner/handymen` will be the slowest because it has to make a full network fetch to Team 7's external API before it can respond to the user.
2. **Which endpoint will produce the most errors?** 
   - I predict `/reports` (POST) will produce the most errors because users could submit invalid data formats, or attackers might trigger 401s or 429s while trying to spam it.

   ## Part E: Real Data vs Predictions
1. **Predictions vs Reality:** 
   - I predicted `/api/partner/handymen` would be the slowest, and I was right. It averaged 889.3 ms, which is massively slower than local routes like `/stats` (1.3 ms).
   - I predicted `/reports` would produce the most errors. I was partially right (it had 14 client errors between the POST and GET routes), but `/api/partner/handymen` actually had the most *server* errors (21 total 502s).
2. **Real Pattern:** `GET /api/partner/handymen` averaged 889.3 ms, but its worst-case request took 1386.5 ms, resulting in 21 server errors. 
3. **Hypothesis:** Because the max time (1386.5 ms) is right near our 1.5-second timeout, these 502 errors are happening because the Team 7 partner API is currently slow or unreachable, triggering our timeout logic. I would look at the `requests.log` file to confirm it says "timeout".
4. **Production Alert:** I would set a monitoring alert to page me if `errorRatePercent` goes above 10% for more than 5 minutes. While I investigate the issue, the Week 11 fallback cache would automatically serve saved data so users don't see a broken page.