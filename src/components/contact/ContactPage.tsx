import { ContactHero } from "./ContactHero";
import { ContactForm } from "./form/ContactForm";
import { ContactInfoCard } from "./info/ContactInfoCard";

export function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <ContactHero />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid items-stretch gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
          <ContactForm />
          <ContactInfoCard />
        </div>
      </div>
    </div>
  );
}
