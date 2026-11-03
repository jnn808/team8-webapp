# Resilience Notes

## Baseline
- Normal response time: 0.012 seconds

## Test Table
| Failure Mode | What the user saw | What the log said |
| :--- | :--- | :--- |
| Slow (10s) | The page just hung and spun for 10 seconds before loading. | `partner call failed: timeout` |
| Flaky (503s) | Saw a red "Partner data is unavailable right now" error twice before succeeding. | `partner returned status 503` |
## Numbers & Reasoning
- **Timeout:** 1500 ms. Normal response is ~12 ms, so 1.5 seconds leaves plenty of room for slight delays while still cutting off frozen connections quickly.

- **Retries & Delay:** 2 max retries, doubling delay (200ms, 400ms).
- **Worst-case wait:** 5100 ms. (3 total attempts * 1500ms timeout) + 200ms delay + 400ms delay. This is an acceptable maximum wait time before gracefully failing.
## User Impact Without Resilience
Without this resilience code, a user clicking on the Repair Help screen would experience a terrible interface when the partner API struggles. If the partner was slow, the page would freeze on a loading state for 10 or more seconds. The user would likely assume the app was broken and abandon the page. If the partner was flaky, the user would see confusing red error messages randomly flash on the screen. By adding timeouts and retries, we hide these minor network hiccups, and the fallback cache ensures the user still gets useful contact information even during a complete outage.

## Future Improvements
What we did not build: A circuit breaker is a switch that stops calling a partner that has been failing for a while, and tests it occasionally; ours still tries every request three times even during a total outage.