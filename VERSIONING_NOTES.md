# 1. The Change
We are wrapping the handymen/witness response array in `{ data: [...], count: N }` and renaming the `serviceCategory` field to `service`.

# 2. Why it is worth a break
Wrapping the array lets us add pagination and metadata (like total counts) later without needing another breaking change. Renaming the field makes the naming convention cleaner.

# 3. Prediction
Any line in our partner's code that loops over the bare array (e.g., `res.map`) will fail with a "not a function" error, and any code reading `serviceCategory` will get `undefined`.