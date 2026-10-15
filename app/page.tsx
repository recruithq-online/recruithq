import { ExperienceProvider } from "@/components/experience-provider";
import { Navbar, Footer, Team } from "@/components/site-sections";
import { Hero } from "@/components/hero";
import { ExpertDirectory } from "@/components/expert-directory";

export default function Home() {
  return (
    <ExperienceProvider>
      <Navbar />
      <Hero />
      <ExpertDirectory />
      <Team />
      <Footer />
    </ExperienceProvider>
  );
}
