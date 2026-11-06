import { ExperienceProvider } from "@/components/experience-provider";
import { Navbar, Team } from "@/components/site-sections";
import { Footer } from "@/components/footer";
import { HomeExperience } from "@/components/home";
import { Roadmap } from "@/components/roadmap";

export default function Home() {
  return (
    <ExperienceProvider>
      <Navbar />
      <main id="main-content" className="v3-home">
        <HomeExperience />
        <Roadmap />
        <Team />
      </main>
      <Footer />
    </ExperienceProvider>
  );
}
