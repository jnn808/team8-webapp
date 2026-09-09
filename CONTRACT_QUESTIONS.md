# Partner Contract Review Questions

### Question 1: Ambiguous Field Format
* **Endpoint:** `POST /reports` (replace with their endpoint)
* **Field / Component:** `dueDate` or status field
* **Issue / Question:** The field `dueDate` is typed as a generic `string` without an explicit `format` or regex pattern. Will this field accept an ISO 8601 UTC timestamp (e.g., `YYYY-MM-DDTHH:MM:SSZ`), or does your server expect a different format?

### Question 2: Missing Error Scenarios
* **Endpoint:** `GET /reports/{id}` (replace with their endpoint)
* **Field / Component:** `responses`
* **Issue / Question:** The specification documents the `200 OK` success response, but omits a `404 Not Found` response schema. If a consumer queries an ID that does not exist, what status code and JSON error schema will the API return?

### Question 3: Data Type / Enum Constraints
* **Endpoint:** `PATCH /reports/{id}` (replace with their endpoint)
* **Field / Component:** `requestBody.status`
* **Issue / Question:** The `status` property in the request payload is listed as `type: string`, but does not define an `enum` list of allowed values. What exact string literals are valid transitions for this field?