"use client";

import {useState, useEffect} from "react";
import init, {generate_mnemonic_phrase, derive_solana_public_key} from "../../../../packages/core/pkg/core.js";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default function PocketChainWallet() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [publicKeys, setPublicKeys] = useState<string[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    async function loadWasmAndData() {
      try {
        await init();
        setIsReady(true);

        const savedMnemonic = localStorage.getItem("pocket_mnemonic");
        const savedKeys = localStorage.getItem("pocket_keys");

        if (savedMnemonic){
          setMnemonic(savedMnemonic);
        }

        if (savedKeys){
          setPublicKeys(JSON.parse(savedKeys));
        }
      } catch (error) {
        console.error("WASM intialization Failed: ", error);
      }
    }
    loadWasmAndData()
  }, []);

  const handleGenerateMnemonic = () => {
    if (!isReady) return;

    const securePhrase = generate_mnemonic_phrase();

    setMnemonic(securePhrase);
    setPublicKeys([]);

    localStorage.setItem("pocket_mnemonic", securePhrase);
    localStorage.removeItem("pocket_keys");
  };

  const handleAddWallet = () => {
    if (!isReady || !mnemonic) return;

    const currentIndex = publicKeys.length;
    const newPublicKeys = derive_solana_public_key(mnemonic, currentIndex);

    const updatedKeys = [...publicKeys, newPublicKeys];

    setPublicKeys(updatedKeys);
    localStorage.setItem("pocket_keys", JSON.stringify(updatedKeys));
  };

  return (
    <div className="app-root">
      <Card>
        <CardHeader>
          <CardTitle>PocketChain - A web based Solana Wallet</CardTitle>
        </CardHeader>
        <CardContent>

          <div className="label-block">
            <p className="label">Seed Phrase</p>
            <div className="controls">
              <Input 
                readOnly 
                value={mnemonic} 
                placeholder="Click generate to create phrase..."
              />
              <Button 
                onClick={handleGenerateMnemonic} 
                disabled={!isReady}
              >
                Generate New Phrase
              </Button>
            </div>
          </div>

          {mnemonic && (
            <div className="actions-block">
              <Button 
                onClick={handleAddWallet} 
                disabled={!isReady}
              >
                Add SOL Wallet
              </Button>

              <div className="accounts">
                {publicKeys.map((pubKey, index) => (
                  <div key={pubKey} className="account-row">
                    <span className="account-index">Account {index}</span>
                    <span className="account-key">{pubKey}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
