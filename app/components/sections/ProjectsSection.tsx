import ProjectGallery from "@/app/components/ProjectGallery";
import Container from "../Container";
import Screen from "../Screen";

export default function Projects() {
  return (
    <Screen heading="Projects" contentClassName="justify-center">
      <Container className="fluid-shell relative z-10 pb-6">
        <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-foreground/10 bg-background">
          <ProjectGallery />
        </div>
      </Container>
    </Screen>
  );
}
