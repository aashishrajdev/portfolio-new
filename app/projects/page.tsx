import ProjectGallery from "@/app/components/ProjectGallery";
import Container from "../components/Container";

export default function Projects() {
  return (
    <section className="min-h-screen pt-28 pb-(--fluid-page-padding-y) bg-background">
      <Container className="fluid-shell">
        <h1 className="font-serif fluid-fs-title mb-8 tracking-tight text-center leading-none">
          Projects
        </h1>
        <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-foreground/10 bg-background">
          <ProjectGallery />
        </div>
      </Container>
    </section>
  );
}
