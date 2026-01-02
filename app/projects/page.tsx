import ProjectGallery from "@/app/components/ProjectGallery";
import Container from "../components/Container";

export default function Projects() {
  return (
    <section className="min-h-screen py-32 md:py-40 flex items-center justify-center bg-background">
      <Container className="max-w-6xl ">
        <h1 className="font-serif text-4xl md:text-6xl mb-8 tracking-tight text-center">
          Projects
        </h1>
        <div className="relative w-full h-auto min-h-[600px] lg:h-[70vh] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-foreground/10">
          <ProjectGallery />
        </div>
      </Container>
    </section>
  );
}
