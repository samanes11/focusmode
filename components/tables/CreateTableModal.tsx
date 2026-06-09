"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WindowFloat from "@/components/WindowFloat";

interface CreateTableModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export default function CreateTableModal({ open, onClose, onCreate }: CreateTableModalProps) {
  const [tableName, setTableName] = useState("");

  if (!open) return null;

  const handleCreate = () => {
    if (!tableName.trim()) { toast.error("لطفا نام میز را وارد کنید."); return; }
    onCreate(tableName.trim());
    setTableName("");
  };

  return (
    <WindowFloat
      onclose={onClose}
      title="ایجاد میز جدید"
      maxWidth="320px"
      padding={20}
      contentStyle={{ background: "linear-gradient(145deg, #2a1e14, #1e140c)", border: "1px solid rgba(212,165,116,0.2)" }}
    >
      <div className="flex flex-col gap-4" dir="rtl">
        <div className="flex flex-col gap-2">
          <Label className="text-[#a0826d] text-right text-[13px]">نام میز</Label>
          <Input
            placeholder="مثلا میز درس"
            value={tableName}
            onChange={e => setTableName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleCreate()}
            className="bg-[#1a1410] border-[#4a3f35] text-[#ead8c6] text-right"
            autoFocus
          />
        </div>
        <Button onClick={handleCreate} className="w-full bg-[#d4a574] hover:bg-[#c49464] text-[#1a1410] font-bold">
          ایجاد میز
        </Button>
      </div>
    </WindowFloat>
  );
}
