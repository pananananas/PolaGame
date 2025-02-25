import "~/styles/globals.css";
import "~/styles/game.css";
import { Toaster } from "~/components/ui/sonner";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Flappy Game",
  description: "A fun Flappy Bird clone game with customizable pets!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#4b5563',
              border: '2px solid #d1d5db',
              padding: '6px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              fontWeight: '500',
              fontSize: '1rem',
            },
            duration: 3000,
            className: 'game-toast h-16',
            descriptionClassName: 'text-gray-600 mt-1',
          }}
        />
      </body>
    </html>
  );
}
