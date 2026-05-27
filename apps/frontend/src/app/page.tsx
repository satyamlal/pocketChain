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
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-2xl bg-zinc-900 text-zinc-100 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">PocketChain Wallet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-2">
            <p className="text-sm text-zinc-400 font-medium">Secret Recovery Phrase</p>
            <div className="flex gap-2">
              <Input 
                readOnly 
                value={mnemonic} 
                placeholder="Click generate to create phrase..."
                className="bg-zinc-950 border-zinc-800 text-zinc-300 placeholder:text-zinc-700"
              />
              <Button 
                onClick={handleGenerateMnemonic} 
                disabled={!isReady}
                className="bg-red-600 text-white hover:bg-red-700 whitespace-nowrap"
              >
                Generate New
              </Button>
            </div>
          </div>

          {mnemonic && (
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <Button 
                onClick={handleAddWallet} 
                disabled={!isReady}
                className="w-full bg-white text-black hover:bg-zinc-200"
              >
                Add Solana Wallet
              </Button>

              <div className="space-y-2">
                {publicKeys.map((pubKey, index) => (
                  <div key={pubKey} className="p-3 bg-zinc-950 rounded-md border border-zinc-800 flex justify-between items-center">
                    <span className="text-xs text-zinc-500 font-mono">Account {index}</span>
                    <span className="text-sm text-zinc-300 font-mono">{pubKey}</span>
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
