# API Testing Log

This document contains the complete log of manual API tests executed via Swagger UI for the Reports microservice API.

---

## 1. Endpoint: `POST /reports`

| Row | Scenario / Description | Expected Status | Actual Status | Actual Response Body |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Create a valid report | `201 Created` | `201 Created` | `{"caseCode": "SB-55434", "category": "maintenance", "description": "Treadmill belt slipping", "status": "Pending", "createdAt": "2026-09-22T18:01:44.000Z", "notes": []}` |
| **2** | Missing required `category` field | `400 Bad Request` | `400 Bad Request` | `{"message": "category is required."}` |
| **3** | Missing required `description` field | `400 Bad Request` | `400 Bad Request` | `{"message": "description is required."}` |
| **4** | Invalid `category` enum value | `400 Bad Request` | `400 Bad Request` | `{"message": "category must be one of: incident, maintenance, harassment, safety."}` |
| **5** | Empty `description` string | `400 Bad Request` | `400 Bad Request` | `{"message": "description is required."}` |
| **6** | Verify created report state | `200 OK` | `200 OK` | `{"caseCode": "SB-55434", "category": "maintenance", "description": "Treadmill belt slipping", "status": "Pending", "createdAt": "2026-09-22T18:01:44.000Z", "notes": []}` |

---

## 2. Endpoint: `GET /reports/{caseCode}`

| Row | Scenario / Description | Expected Status | Actual Status | Actual Response Body |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Fetch existing report (`SB-55434`) | `200 OK` | `200 OK` | `{"caseCode": "SB-55434", "category": "maintenance", "description": "Treadmill belt slipping", "status": "Pending", "createdAt": "2026-09-22T18:01:44.000Z", "notes": []}` |
| **2** | Nonexistent `caseCode` (`SB-00000`) | `404 Not Found` | `404 Not Found` | `{"error": "No report found with caseCode \"SB-00000\"."}` |

---

## 3. Endpoint: `PATCH /reports/{caseCode}`

| Row | Scenario / Description | Expected Status | Actual Status | Actual Response Body |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Update status to `Resolved` | `200 OK` | `200 OK` | `{"caseCode": "SB-55434", "status": "Resolved", "updatedAt": "2026-09-22T18:40:04.000Z"}` |
| **2** | Idempotency test (repeat update) | `200 OK` | `200 OK` | `{"caseCode": "SB-55434", "status": "Resolved", "updatedAt": "2026-09-22T18:42:55.000Z"}` |
| **3** | Missing `status` field | `400 Bad Request` | `400 Bad Request` | `{"message": "status is required."}` |
| **4** | Invalid `status` enum (`Closed`) | `400 Bad Request` | `400 Bad Request` | `{"message": "status must be exactly \"Resolved\"."}` |
| **5** | Nonexistent `caseCode` (`SB-00000`) | `404 Not Found` | `404 Not Found` | `{"error": "No report found with caseCode \"SB-00000\"."}` |

---

## 4. Endpoint: `POST /reports/{caseCode}/notes`

| Row | Scenario / Description | Expected Status | Actual Status | Actual Response Body |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Add valid note to existing report | `201 Created` | `201 Created` | `{"noteId": "not-7", "caseCode": "SB-55434", "message": "Cable snapped completely", "createdAt": "2026-09-22T18:52:26.000Z"}` |
| **2** | Missing `message` field | `400 Bad Request` | `400 Bad Request` | `{"message": "message is required."}` |
| **3** | Nonexistent `caseCode` (`SB-00000`) | `404 Not Found` | `404 Not Found` | `{"error": "No report found with caseCode \"SB-00000\"."}` |

---

## 5. Endpoint: `DELETE /reports/{caseCode}`

| Row | Scenario / Description | Expected Status | Actual Status | Actual Response Body |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Delete existing report (`SB-55434`) | `204 No Content` | `204 No Content` | *(Empty response body)* |
| **2** | Delete nonexistent / already deleted report | `404 Not Found` | `404 Not Found` | `{"error": "No report found with caseCode \"SB-55434\"."}` |