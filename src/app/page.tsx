import { Hero, SampleGallery, Features, HowItWorks, Footer } from "@/components/landing";
import { Toaster } from "@/components/ui/Toaster";

export default function Home() {
  return (
    <>
      <main className="min-h-screen">
        <Hero />
        <SampleGallery />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
      <Toaster />
    </>
  );
}
