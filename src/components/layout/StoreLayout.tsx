import { TopBar } from "./TopBar";
import { Navbar } from "./Navbar";
import { PromoBar } from "./PromoBar";
import { Footer } from "./Footer";
import { AuthSidebarProvider } from "@/contexts/AuthSidebarContext";
import { AuthSidebar } from "@/components/auth/AuthSidebar";
import { CartProvider } from "@/contexts/CartContext";
import { CartSidebar } from "@/components/cart/CartSidebar";

export function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
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
      </CartProvider>
    </AuthSidebarProvider>
  );
}
