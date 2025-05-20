import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { BannerSection } from "@/components/home/banner-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CTASection } from "@/components/home/cta-section";

const Index = () => {
  return (
    <div className="h-screen flex flex-col relative">
      <Header />
      <main className="flex-1 overflow-y-auto pt-[72px] mb-[11rem] relative z-0">
        <BannerSection />
        <FeaturesSection />
        <HowItWorks />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
