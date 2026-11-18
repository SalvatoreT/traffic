## 1. Redirect routes
- [x] 1.1 Reproduce with a traced p1 run and find the cause
- [x] 1.2 Keep the stretch between the first and last local link in `localPart`
- [x] 1.3 Split drawn lines at non-adjacent links in `ProposalMap`
- [x] 1.4 Fail the generator on a disconnected route or a missing street
- [x] 1.5 Bump the stored method to `displacement-2`
- [x] 1.6 Tests in `redistribution.test.ts` and `stored-redistribution.test.ts`

## 2. Block names
- [x] 2.1 Follow the same street past a node with no other street in `naming.ts`
- [x] 2.2 Same rule in `naming.rs`
- [x] 2.3 Add a looped street to the link fixture and tests in both languages
- [x] 2.4 Record the block names that change in the Rockridge network

## 3. Close
- [x] 3.1 `npm test` and `npx tsc --noEmit`
- [x] 3.2 Confirm the simulator fingerprint is unchanged
