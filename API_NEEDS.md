# API Needs Statements

## Needs Statements
1. Team 8 needs to read a member's list of exercises for the current workout day, in order to display their daily workout split (add/remove/complete status).

   - Freshness: Real-time
   - Volume: Low (~once per page load, plus on each add/remove/complete action)
   - Auth: Authenticated

2. Team 8 needs to send a target weight to the barbell load calculator and receive the plate distribution, in order to show members exactly which plates to load.

   - Freshness: Real-time
   - Volume: Medium (called each time a member enters a new target weight)
   - Auth: Authenticated

3. Team 8 needs to read a member's stored account and membership details, in order to pre-fill the account settings page and let members view/edit their info.

   - Freshness: Cached hourly
   - Volume: Low (~once per settings-page load)
   - Auth: Authenticated (sensitive — name, email, phone)

4. Team 8 needs to read the list of available memberships with pricing, discounts, and benefits, in order to display membership options during signup and account changes.

   - Freshness: Cached hourly
   - Volume: Low (~once per signup or settings-page load)
   - Auth: Public

5. Team 8 needs to read coach availability and create a new appointment, in order to let members book personal training sessions without double-booking.

   - Freshness: Real-time
   - Volume: Medium (read on page load, write on booking submit)
   - Auth: Authenticated

## Reflection
[Write 1 paragraph detailing a specific surprise or challenged assumption from your interviews with your ring partners.]
