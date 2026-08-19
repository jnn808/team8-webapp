# Team Charter: ShieldBox

## 1. Team Name and Members
* **Team Name:** Team 8 (ShieldBox)
* **[Pharell]** — Lead Developer / Project Lead
* **[Timothy]** — Backend Developer / API Engineer
* **[Joy]** — Frontend Developer / UI/UX
* **[Brianna]** — QA / Database Specialist

---

## 2. App Summary
ShieldBox is a secure, anonymous whistleblower reporting platform designed to allow individuals to safely report fraud, corruption, harassment, and workplace misconduct. Built for employees, organizations, and compliance administrators, the application provides an encrypted channel for submitting reports, uploading supporting evidence, and tracking investigation pipelines through unique case identifiers while strictly protecting whistleblower identity and maintaining accountability.

---

## 3. Part B Audit — ShieldBox API Audit

### Resources (Data Models)
| Resource | Description |
| :--- | :--- |
| **Report** | A whistleblower submission |
| **Case** | The tracked status of a report through the investigation pipeline |
| **Category** | The type of concern (e.g., Fraud, Corruption, Harassment) |
| **Evidence** | Files or documents attached to a report |
| **Status Update** | A timestamped update on a case's progress |

### Actions (User Capabilities)
* **Report**
  * Create a report
  * View a report
  * Edit a report
  * Delete a report
* **Case**
  * View case status
  * Track case progress
  * Filter cases by status
  * Search cases by case code
* **Category**
  * View category list
  * Select category for report
* **Evidence**
  * Upload evidence files
  * View attached evidence
  * Remove evidence
* **Status Update**
  * Add case status update
  * View timeline of updates

---

## 4. Ring Position

* **Consumes From:** 
  [TEAM 7]

* **Consumed By:** 
  [TEAM 9]