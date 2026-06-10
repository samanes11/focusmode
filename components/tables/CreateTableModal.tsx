"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WindowFloat from "@/components/WindowFloat";
import { Icon } from "@iconify/react";

interface CreateTableModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export default function CreateTableModal({
  open,
  onClose,
  onCreate,
}: CreateTableModalProps) {
  const [tableName, setTableName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleCreate = async () => {
    if (!tableName.trim()) {
      toast.error("لطفا نام میز را وارد کنید.");
      return;
    }

    setIsSubmitting(true);
    try {
      onCreate(tableName.trim());
      setTableName("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WindowFloat
      onclose={onClose}
      title="ایجاد میز جدید"
      maxWidth="360px"
      padding={24}
      contentStyle={{
        background:
          "linear-gradient(135deg, rgba(42, 30, 20, 0.95) 0%, rgba(26, 20, 16, 0.95) 100%)",
        border: "1px solid rgba(212, 165, 116, 0.25)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex flex-col gap-6" dir="rtl">
        {/* Description */}
        <div className="text-center">
          <h2 className="text-[18px] font-bold text-[#f0c892] mb-1">
            میز جدید بسازید
          </h2>
          <p className="text-[13px] text-[#a0826d]">
            یک میز مطالعه جدید برای خود و دوستانتان ایجاد کنید
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label className="text-[#a0826d] text-[13px] font-semibold">
              نام میز
            </Label>
            <div className="relative">
              <Icon
                icon="mdi:account-group"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a0826d] pointer-events-none"
              />
              <Input
                placeholder="مثلاً: میز درس شبانه"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !isSubmitting && handleCreate()
                }
                disabled={isSubmitting}
                className="bg-[#1a1410] border-[#4a3f35] text-[#ead8c6] text-right pr-10 focus:ring-[#d4a574] placeholder-[#8a7561] transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Tips */}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleCreate}
            disabled={isSubmitting || !tableName.trim()}
            className="flex-1 bg-gradient-to-r from-[#d4a574] to-[#c49464] hover:from-[#e0b584] hover:to-[#d0a474] disabled:opacity-50 disabled:cursor-not-allowed text-[#1a1410] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {isSubmitting ? (
              <>
                <Icon
                  icon="mdi:loading"
                  className="w-4 h-4 ml-2 animate-spin"
                />
                ایجاد...
              </>
            ) : (
              <>
                <Icon icon="mdi:plus" className="w-4 h-4 ml-2" />
                ایجاد میز
              </>
            )}
          </Button>
        </div>
      </div>
    </WindowFloat>
  );
}
