import Hero from "@/components/sections/Hero";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import OpenSource from "@/components/sections/OpenSource";
import Writing from "@/components/sections/Writing";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Experience />
      <Projects />
      <OpenSource />
      <Writing />
      <Contact />
    </>
  );
}
