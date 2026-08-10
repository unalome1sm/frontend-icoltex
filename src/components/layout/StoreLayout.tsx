import { TopBar } from "./store/TopBar";
import { Navbar } from "./store/Navbar";
import { PromoBar } from "./store/PromoBar";
import { Footer } from "./store/Footer";
import { AuthSidebarProvider } from "@/contexts/AuthSidebarContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthSidebar } from "@/components/auth/AuthSidebar";
import { GoogleAuthProvider } from "@/components/auth/google/GoogleAuthProvider";
import { CartProvider } from "@/contexts/CartContext";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { WhatsAppFab } from "@/components/chat";

export function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <GoogleAuthProvider>
    <AuthProvider>
    <AuthSidebarProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <TopBar />
          <Navbar />
          <PromoBar />
          <main className="flex-1 overflow-x-hidden bg-slate-50">
            <div className="w-full px-4 pb-0 pt-8 sm:px-6 lg:px-8">{children}</div>
          </main>
          <Footer />
        </div>
        <AuthSidebar />
        <CartSidebar />
        <WhatsAppFab />
      </CartProvider>
    </AuthSidebarProvider>
    </AuthProvider>
    </GoogleAuthProvider>
  );
}
