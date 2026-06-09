"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WindowFloat from "@/components/WindowFloat";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  onSuccess: () => void;
}

export default function AuthModal({ onSuccess }: AuthModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode]         = useState<"login" | "register">("login");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy]         = useState(false);

  const handleSubmit = async () => {
    if (!userName.trim() || !password) return;
    setBusy(true);
    const ok =
      mode === "login"
        ? await login(userName.trim(), password)
        : await register(userName.trim(), password);
    setBusy(false);
    if (ok) {
      if (mode === "register") {
        // After register switch to login
        setMode("login");
        setPassword("");
        return;
      }
      onSuccess();
    }
  };

  return (
    <WindowFloat
      onclose={() => {}}
      title={mode === "login" ? "ورود" : "ثبت‌ نام"}
      maxWidth="340px"
      padding={24}
      contentStyle={{
        background: "linear-gradient(145deg, #2a1e14, #1e140c)",
        border: "1px solid rgba(212,165,116,0.25)",
      }}
    >
      <div className="flex flex-col gap-5" dir="rtl">
        {/* Toggle */}
        <div className="flex rounded-xl overflow-hidden border border-[#4a3f35]">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-2 text-[13px] font-bold transition-colors"
              style={{
                background: mode === m ? "#d4a574" : "transparent",
                color: mode === m ? "#1a1410" : "#a0826d",
              }}
            >
              {m === "login" ? "ورود" : "ثبت‌نام"}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[#a0826d] text-[13px]">نام کاربری</Label>
            <Input
              placeholder="مثلاً: ali_coffee"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="bg-[#1a1410] border-[#4a3f35] text-[#ead8c6] text-right"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-[#a0826d] text-[13px]">رمز عبور</Label>
            <Input
              type="password"
              placeholder="حداقل ۶ کاراکتر"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="bg-[#1a1410] border-[#4a3f35] text-[#ead8c6] text-right"
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={busy}
          className="w-full bg-[#d4a574] hover:bg-[#c49464] text-[#1a1410] font-bold"
        >
          {busy ? "..." : mode === "login" ? "ورود" : "ثبت‌نام"}
        </Button>
      </div>
    </WindowFloat>
  );
}
