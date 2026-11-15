#!/usr/bin/env node
// Test stand-in for target/release/fingerprint.
console.log(process.env.STUB_FINGERPRINT ?? 'f'.repeat(32));
