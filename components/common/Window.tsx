import React from "react";

interface WindowProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  contentbgcolor?: string;
  className?: string;
}

export default function Window({ children, style, contentStyle, contentbgcolor, className = "" }: WindowProps) {
  const mergedStyle: React.CSSProperties = {
    backgroundColor: contentbgcolor || undefined,
    borderRadius: 16,
    border: "1px solid rgba(74,63,53,0.6)",
    overflow: "hidden",
    ...contentStyle,
    ...style,
  };
  return (
    <div className={`w-full ${className}`} style={mergedStyle}>
      {children}
    </div>
  );
}
