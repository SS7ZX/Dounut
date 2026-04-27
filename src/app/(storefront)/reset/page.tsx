"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { RefreshCcw, Trash2, AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResetPage() {
  const { clearCart } = useCartStore();
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleFullReset = () => {
    setIsResetting(true);
    
    // 1. Clear Zustand Store
    clearCart();
    
    // 2. Clear all browser storage
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }

    // 3. Simulated delay for "Premium" feel
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-none shadow-2xl overflow-hidden">
        <div className="h-2 bg-red-500" />
        <CardHeader className="text-center pt-8">
          <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">System Reset</CardTitle>
          <p className="text-slate-500 text-sm mt-2">
            This will clear your cart, session data, and local preferences.
          </p>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          <div className="bg-slate-100 rounded-xl p-4 text-xs text-slate-600 font-mono">
            {">"} Executing: store.clear()<br />
            {">"} Executing: localStorage.purge()<br />
            {">"} Status: Ready to reset
          </div>

          <Button 
            disabled={isResetting}
            onClick={handleFullReset}
            className="w-full py-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all"
          >
            {isResetting ? (
              <RefreshCcw className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Trash2 className="w-5 h-5 mr-2" />
            )}
            {isResetting ? "Resetting Session..." : "Confirm Full Reset"}
          </Button>

          <Button 
            variant="ghost"
            onClick={() => router.push("/")}
            className="w-full text-slate-500 hover:text-slate-900"
          >
            <Home className="w-4 h-4 mr-2" /> Cancel and Go Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}