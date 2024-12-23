import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import Footer from "@/components/features/footer";
import Navbar from "@/components/features/navbar";
import { CartProvider } from "@/components/features/cartContext";
import { ToastProvider } from "@/components/features/toastContext";
import { UserProvider } from "@/components/features/userContext"; // Import UserProvider
import 'react-toastify/dist/ReactToastify.css';

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
        <ToastProvider>
          <CartProvider>
            <Navbar/>
            <UserProvider> {/* Bọc toàn bộ layout với UserProvider */}
              <html lang="en">
                <body
                  className={cn(
                    "min-h-screen bg-background font-sans antialiased",
                    fontSans.variable
                  )}
                >
                  <ThemeProvider
                  
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                  >
                    
                    {children}
                    <Footer />
                  </ThemeProvider>
                </body>
              </html>
            </UserProvider>
          </CartProvider>
        </ToastProvider>
    </ClerkProvider>
  );
}
