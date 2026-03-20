# धर्मा Mart

## Current State
Admin panel has login via Internet Identity, but after login shows "Access Denied" because no admin has been assigned in the backend AccessControl system. The `isCallerAdmin()` returns false for all users since no one has been granted admin role.

## Requested Changes (Diff)

### Add
- Backend: `claimAdminIfNoneExists` function that grants admin role to caller if no admin exists yet
- Frontend: Auto-call `claimAdminIfNoneExists` after login so first user becomes admin automatically

### Modify
- AdminPage.tsx: After login detected, call claimAdminIfNoneExists before checking isAdmin

### Remove
- Nothing removed

## Implementation Plan
1. Add `claimAdminIfNoneExists` to backend main.mo
2. Update frontend AdminPage.tsx to call this function after identity is set
3. Also add a manual "Claim Admin" button as fallback
