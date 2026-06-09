import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coffee Focus",
  description: "تایمر مطالعه با قهوه",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body
        style={{
          fontFamily: "vr, 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
          backgroundImage: "url('/bg2.webp')",
          backgroundSize: "auto",
          backgroundAttachment: "fixed",
          backgroundPosition: "center top",
          backgroundColor: "#1a1410",
          margin: 0,
          padding: 0,
        }}
      >
        {children}
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: {
              fontFamily: "vr, Segoe UI, sans-serif",
              fontSize: "14px",
              direction: "rtl",
            },
          }}
        />
      </body>
    </html>
  );
}
