import Container from "../components/Container";

export default function Projects() {
  const projects = [
    {
      title: "Ethereal Canvas",
      description: "A collaborative real-time digital whiteboard application.",
      tech: ["Next.js", "Socket.io", "Canvas API"],
      link: "#",
    },
    {
      title: "Nebula OS",
      description: "Web-based operating system concept with window management.",
      tech: ["React", "TypeScript", "Framer Motion"],
      link: "#",
    },
    {
      title: "Audio Phonic",
      description: "High-fidelity audio streaming platform with spatial audio.",
      tech: ["WebAudio API", "Node.js", "GraphQL"],
      link: "#",
    },
    {
      title: "Crypto Sentinel",
      description:
        "Real-time cryptocurrency tracking and algorithmic trading bot analytics.",
      tech: ["Python", "Vue.js", "D3.js"],
      link: "#",
    },
  ];

  return (
    <section className="min-h-screen py-32 md:py-40">
      <Container className="max-w-6xl">
        <h1 className="font-serif text-4xl md:text-6xl mb-16 tracking-tight text-center">
          Projects
        </h1>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.link}
              className="group block p-6 border border-foreground/5 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-serif text-2xl mb-2">{project.title}</h3>
                <span className="text-foreground/30 text-xs group-hover:text-foreground transition-colors">
                  ↗
                </span>
              </div>

              <p className="text-foreground/70 mb-6 min-h-[3rem]">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono text-foreground/40 border border-foreground/10 px-2 py-1 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
