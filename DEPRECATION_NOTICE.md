# Deprecation Notice: ShieldBox Reports API v1

To: Team 7
From: Team 8 (ShieldBox)
Date: November 10, 2026

## Summary
v1 of `/reports` is now deprecated. v2 is live. v1 will officially sunset on Fri, 13 Nov 2026 00:00:00 GMT. 

## What is changing in v2
1. The `caseCode` property is renamed to `reportId`.
2. The `createdAt` property is renamed to `submittedAt`.

## Migration Steps
1. Target `/v2/reports` instead of `/reports`.
2. Update your frontend components to read `.reportId` and `.submittedAt` when rendering our data.