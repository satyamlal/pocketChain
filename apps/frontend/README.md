# PocketChain Frontend

PocketChain is a Solana wallet-style application built as a monorepo with a Next.js frontend and a Rust backend compiled to WebAssembly. The frontend handles the UI and browser state, while the Rust package generates the mnemonic phrase and derives Solana public keys.

## Project Structure

- `apps/frontend` - Next.js application that renders the wallet UI.
- `packages/core` - Rust crate that compiles to WebAssembly and exposes wallet helpers.
- Root scripts - convenience commands for building the Rust package and running the frontend.

## Tech Stack

Frontend:

- Next.js `16.2.6`
- React `19.2.4`
- React DOM `19.2.4`
- TypeScript `5.x`
- Tailwind CSS `4.x`
- ESLint `9.x`
- UI helpers: `shadcn`, `radix-ui`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`

Backend:

- Rust `2024` edition
- `wasm-bindgen` `0.2.92`
- `bip39` `2.2.2`
- `slip10` `0.4.3`
- `bs58` `0.5.1`
- `ed25519-dalek` `2.1.1`
- `getrandom` `0.2.14` with the `js` feature for browser-compatible randomness

## How It Works

The frontend layer is built using vibe-coding and manual edits. The backend logic was coded manually in Rust and exposed to the browser through WebAssembly.

At runtime the page loads the WASM module, then calls exported Rust functions from the Next.js client component. The generated data is kept in `localStorage` so the wallet state survives refreshes.

### Frontend And Backend Connection

The connection happens through the generated package in `packages/core/pkg/core.js`. The frontend imports the WASM initializer and the exported Rust helpers directly:

```ts
import init, {generate_mnemonic_phrase, derive_solana_public_key} from "../../../../packages/core/pkg/core.js";
```

The Rust side exposes those functions with `wasm_bindgen`:

```rust
#[wasm_bindgen]
pub fn generate_mnemonic_phrase() -> String {
	let mnenomic = Mnemonic::generate(12).expect("Failed to generate mnemonic!");
	mnenomic.to_string()
}

#[wasm_bindgen]
pub fn derive_solana_public_key(phrase: &str, account_index: u32) -> String {...}
```

The frontend initializes the WASM module before using those helpers:

```ts
await init();
setIsReady(true);
```

## How To Contribute

```bash
git clone <your-repo-url>
cd pocketChain
```

After cloning, install dependencies using the package manager you use in this workspace, then build the WASM package and start the frontend.

## Local Development

From the repository root:

```bash
bun run build:core
bun run dev:frontend
```

`bun run build:core` rebuilds the Rust WASM package after backend changes.
`bun run dev:frontend` starts the Next.js app in development mode.

You can also work directly inside the frontend app:

```bash
cd apps/frontend
bun run dev
```

## Contributing Workflow

1. Start from a clean main branch.
2. Create a branch per issue, fix, or feature.
3. Keep the branch name descriptive and short.
4. Make your changes in the smallest useful slice.
5. Rebuild the backend WASM package when Rust code changes.
6. Run the frontend locally and verify the UI still works.
7. Open a pull request from the feature branch.

Example branch names:

```bash
git checkout -b feature/add-wallet-actions
git checkout -b fix/derive-key-validation
git checkout -b chore/readme-update
```

Suggested branch flow:

```bash
git checkout main
git pull origin main
git checkout -b feature/your-change
```

## Notes

- The frontend is intentionally lightweight and focused on the wallet experience.
- The Rust backend is the source of truth for mnemonic generation and Solana key derivation.
- If you change anything inside `packages/core`, rebuild the WASM package before testing the UI.
