import { TopBar } from "./TopBar";
import { Navbar } from "./Navbar";
import { PromoBar } from "./PromoBar";
import { Footer } from "./Footer";

export function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Navbar />
      <PromoBar />
      <main className="flex-1 overflow-x-hidden bg-slate-50">
        <div className="w-full px-4 pb-0 pt-8 sm:px-6 lg:px-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
