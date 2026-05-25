use bip39::Mnemonic;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn generate_mnemonic_phrase() -> String {
    let mnenomic = Mnemonic::generate(12).expect("Failed to generate mnemonic!");
    mnenomic.to_string()
}
