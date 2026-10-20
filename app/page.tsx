import { ExperienceProvider } from "@/components/experience-provider";
import { Navbar, Footer, Team } from "@/components/site-sections";
import { Hero } from "@/components/hero";
import { ExpertDirectory } from "@/components/expert-directory";
import { Roadmap } from "@/components/roadmap";

export default function Home() {
  return (
    <ExperienceProvider>
      <Navbar />
      <Hero />
      <ExpertDirectory />
      <Roadmap />
      <Team />
      <Footer />
    </ExperienceProvider>
  );
}
