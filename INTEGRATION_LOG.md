# Week 10 Integration Log

| What broke | Root cause | Fix | Whose code, and who fixed it |
| :--- | :--- | :--- | :--- |
| `curl` to live partner API failed with `curl: (56) schannel: server closed abruptly` | Ngrok tunnel was blocking automated requests with a browser warning screen. | Added `ngrok-skip-browser-warning: true` header to the fetch request to bypass the screen. | Partner (Ngrok config), fixed by Us (added header) |
| Server crash test: Pointed `PARTNER_URL` to `localhost:9999` | Simulated partner API outage. Backend fetch failed (ECONNREFUSED). | Frontend caught the 502 response and safely displayed "Partner data is unavailable right now" without a blank page or crash. | Us, fixed by Us |
| Downstream partner integration | N/A | Monitored routes for 401s/404s. Downstream partner successfully consumed the API with no bugs reported. | N/A |