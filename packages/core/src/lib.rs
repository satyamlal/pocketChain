use bip39::Mnemonic;
use bs58;
use ed25519_dalek::{SigningKey, VerifyingKey};
use slip10::{BIP32Path, Curve, derive_key_from_path};
use std::str::FromStr;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn generate_mnemonic_phrase() -> String {
    let mnenomic = Mnemonic::generate(12).expect("Failed to generate mnemonic!");
    mnenomic.to_string()
}

#[wasm_bindgen]
pub fn derive_solana_public_key(phrase: &str, account_index: u32) -> String {
    let mnemonic = Mnemonic::from_str(&phrase).expect("Invalid seed phrase!");
    let seed = mnemonic.to_seed("");

    let path_string = format!("m'/44'/501'/{}'/0'", account_index);
    let bip32_path = BIP32Path::from_str(&path_string).expect("Invalid derive path!");

    let derived = derive_key_from_path(&seed, Curve::Ed25519, &bip32_path)
        .expect("Failed to derive slip10 key!");
    let mut key_bytes = [0u8; 32];

    key_bytes.copy_from_slice(&derived.key);

    let signing_key = SigningKey::from_bytes(&key_bytes);
    let verifying_key = VerifyingKey::from(&signing_key);

    bs58::encode(verifying_key.as_bytes()).into_string()
}
