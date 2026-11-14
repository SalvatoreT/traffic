#[test]
fn fingerprint_is_32_hex_characters() {
    let f = traffic_sim::FINGERPRINT;
    assert_eq!(f.len(), 32);
    assert!(f.chars().all(|c| c.is_ascii_hexdigit()));
}
