"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/cart/cart-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <CartProvider>
            {children}
            <Toaster richColors position="top-center" />
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
