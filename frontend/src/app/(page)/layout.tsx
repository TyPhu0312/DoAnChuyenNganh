import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import { CartProvider } from "@/components/features/cartContext";
import Footer from "@/components/features/footer";
import Navbar from "@/components/features/navbar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <CartProvider> {/* Di chuyển CartProvider ở đây */}
        <html lang="en">
          <body
            className={cn(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.variable
            )}
          >
            <Navbar/>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Footer/>
            </ThemeProvider>
          </body>
        </html>
      </CartProvider>
    </ClerkProvider>
  );
}
