import Container from "../components/Container";
import CrowdCanvas from "../components/CrowdCanvas";

export default function Contact() {
  return (
    <section className="min-h-screen pt-32 md:pt-40 flex flex-col relative overflow-hidden">
      <Container className="max-w-4xl z-10">
        <h1 className="font-serif text-5xl md:text-8xl mb-8 tracking-tighter leading-none">
          LET'S WORK <br /> <span className="text-foreground/30">TOGETHER</span>
        </h1>

        <div className="mt-12 space-y-8">
          <div>
            <p className="text-foreground/60 text-lg mb-2 font-mono">Mail</p>
            <a
              href="mailto:rajaashish.dev@gmail.com"
              className="text-2xl md:text-3xl hover:text-foreground/70 transition-colors border-b border-foreground/20 pb-1"
            >
              rajaashish.dev@gmail.com
            </a>
          </div>
        </div>
      </Container>

      {/* Crowd Animation Section */}
      <div className="absolute bottom-0 left-0 w-full h-[50vh] md:h-[60vh] z-0 pointer-events-none">
        <div className="relative h-full w-full bg-background overflow-hidden transition-colors duration-500">
          <CrowdCanvas className="absolute bottom-0 w-full h-full" />
        </div>
      </div>
    </section>
  );
}
