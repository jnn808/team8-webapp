# Upstream Contract Review: HandyNear API (Team 7)

### Question 1: Ambiguous `serviceCategory` Format & Validation
* **Endpoint:** `GET /api/handymen`
* **Field / Component:** `parameters.serviceCategory` & `schemas.Handyman.properties.serviceCategory`
* **Issue / Question:** The query parameter and schema field `serviceCategory` are both typed as arbitrary strings without an `enum` restriction or predefined taxonomy. What exact categories are supported by the backend (e.g., `"Plumbing"`, `"Electrical"`, `"Carpentry"`), and will passing an unrecognized category return an empty array `[]` or a `400 Bad Request` with `ErrorResponse`?

### Question 2: Inconsistency Between Schema and Required Fields for Availability
* **Endpoint:** `GET /api/handymen`
* **Field / Component:** `schemas.Handyman.properties` (`isAvailable` vs. `available`)
* **Issue / Question:** In the query parameters for `GET /api/handymen`, the filter parameter is named `available`, but the returned `Handyman` object schema defines the boolean property as `isAvailable`. Additionally, does setting `available=false` in the query return unavailable handymen, or does the endpoint strictly omit them regardless of the query flag?

### Question 3: Missing Conflict / Validation Responses on Overlapping Bookings
* **Endpoint:** `POST /api/bookings`
* **Field / Component:** `responses`
* **Issue / Question:** The endpoint documents a `201 Created` and a generic `400 Bad Request`, but does not define behavior for scheduling conflicts. If a client attempts to book a handyman who is already marked `isAvailable: false` or who already has a confirmed booking at the requested `scheduledTime`, does the API return a `409 Conflict`, or does it return a `400 Bad Request`? If so, what is the expected error `code` in the `ErrorResponse` payload?