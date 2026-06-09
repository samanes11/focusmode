import { Icon } from "@iconify/react";

export default function UserAvatar({ width = 30 }: { width?: number }) {
  return (
    <div
      className="rounded-full bg-[#d4a574]/20 border border-[#d4a574]/40 flex items-center justify-center shrink-0"
      style={{ width, height: width }}
    >
      <Icon icon="mdi:account" style={{ width: width * 0.6, height: width * 0.6, color: "#d4a574" }} />
    </div>
  );
}
