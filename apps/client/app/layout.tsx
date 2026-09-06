import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, Show, UserButton, SignOutButton } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./components/theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAG Assistant",
  description: "Ask questions about your uploaded documents.",
};

// Applies the saved theme while the browser parses the HTML, before first
// paint, so a dark-mode user never sees a flash of the light theme.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="dark"&&t!=="light"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex h-full flex-col overflow-hidden bg-background">
        <ClerkProvider>
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card/70 px-3 backdrop-blur-sm sm:px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-semibold">RAG Assistant</p>
                <p className="hidden truncate text-xs text-muted-foreground sm:block">
                  Answers grounded in your documents
                </p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <ThemeToggle />
              <Show when="signed-in">
                <UserButton />
                <SignOutButton redirectUrl="/sign-in">
                  <Button variant="outline" size="sm">
                    Sign out
                  </Button>
                </SignOutButton>
              </Show>
            </div>
          </header>

          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
