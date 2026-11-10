# Project Retrospective: ShieldBox API & Integration

## 1. The Hardest Part of the Lifecycle
Out of all the stages in the API development lifecycle, the **Build**, **Test**, and **Integrate** phases were by far the most challenging for our team[cite: 4]. The primary driver behind this difficulty was a combination of strict, non-negotiable time constraints, a steep initial learning curve when converting theoretical architectural specifications into robust, production-ready backend code, and real-world communication hurdles with partner teams[cite: 4]. 

Because our application relied on multiple moving pieces—ranging from underlying SQLite database table setup and custom Express middleware, to resilient fetch wrappers equipped with exponential backoff retries and complex partner route adapters—debugging runtime errors under tight deadlines proved demanding. Writing unit and integration test suites alongside rapid feature iterations required continuous readjustment[cite: 4]. Furthermore, cross-team integration was especially difficult due to communication challenges with Team 7 and Team 9, as our testing workflows depended entirely on their physical laptops being powered on and connected to local Cloudflare tunnels for us to query their live endpoints[cite: 1, 4]. Ensuring that edge cases were properly handled, such as managing connection timeouts, handling empty or malformed JSON payloads, and managing fallback state logic when partner machines went offline, made testing and integration far more complex than initially anticipated[cite: 4].

## 2. One Real Cross-Team Issue
A major cross-team integration challenge occurred during our integration work with our downstream partner, Team 7, when they updated their API security implementation by locking down their `/api/bookings` route behind a mandatory `X-API-Key` authentication header[cite: 1, 4].

When our backend proxy attempted to query their server without this expected header, the connection failed immediately with an HTTP `401 Unauthorized` status code[cite: 4]. We first caught the breakage during live end-to-end testing when our frontend failed to render active booking data[cite: 4]. Resolving this issue took roughly one hour of concerted troubleshooting:
1. We coordinated with Team 7 to obtain their designated authorization token (`6bf2ce03adb328e53b04a4355c7b70e4ae8b26d579e6e904`)[cite: 1].
2. We updated our environment configuration file (`.env`) by adding the secret variable `TEAM7_API_KEY`[cite: 1].
3. We manually verified the key's validity using a targeted `curl` command directly against their live Cloudflare tunnel:
   `curl -i -H "X-API-Key: 6bf2ce03adb328e53b04a4355c7b70e4ae8b26d579e6e904" https://night-ratio-driven-pee.trycloudflare.com/api/bookings`[cite: 1]

Once the request returned a clear HTTP `200 OK` status with valid JSON objects, the upstream dependency was fully restored[cite: 1, 4].

## 3. What I Would Design Differently
If we were to restart this project from Week 1 with our current knowledge, I would enforce two core architectural practices right from the beginning[cite: 4]:
1. **Lock Down Authentication and Contract Headers Early:** Standardizing header requirements, API keys, and client tags during the initial planning phase would eliminate unexpected breaking changes during late-stage integrations[cite: 4].
2. **Implement Versioning and Partner Adapters on Day One:** Instead of retrofitting partner translation layers (`server/partner.js`) and versioning adapters in later weeks, establishing an isolated adapter layer early would decouple core business logic from breaking upstream changes and unexpected schema shifts[cite: 4].

## 4. My Contribution
I evaluate my individual performance on this project at a solid **7 out of 10**[cite: 4]. 

My primary responsibilities centered around core implementation, integration debugging, and live endpoint verification[cite: 4]. I directly configured runtime environments (`.env`), set up and debugged partner version adapters to maintain backwards compatibility, and conducted end-to-end `curl` testing to verify cross-team connectivity over external Cloudflare tunnels[cite: 1, 4]. While I collaborated closely with my teammates during initial high-level system design sessions, code reviews, and planning meetings, I took strong personal ownership during hands-on troubleshooting, integration validation, and pre-flight check executions[cite: 4].