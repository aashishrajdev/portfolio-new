import Container from "../components/Container";

export default function Works() {
  const experiences = [
    {
      company: "Tech Innovators Inc.",
      role: "Senior Full Stack Engineer",
      year: "2023 - Present",
      description:
        "Leading the development of next-generation cloud architectures and microservices.",
    },
    {
      company: "Creative Studio",
      role: "Creative Developer",
      year: "2021 - 2023",
      description: "Built award-winning web experiences with WebGL and React.",
    },
    {
      company: "StartUp X",
      role: "Frontend Developer",
      year: "2019 - 2021",
      description:
        "Implemented responsive UI layouts and optimized performance for high-traffic applications.",
    },
  ];

  return (
    <section className="min-h-screen py-32 md:py-40">
      <Container className="max-w-4xl">
        <h1 className="font-serif text-4xl md:text-6xl mb-16 tracking-tight text-center">
          Work History
        </h1>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="group border-t border-foreground/10 pt-8 transition-colors hover:border-foreground/30"
            >
              <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4">
                <h2 className="text-2xl font-serif text-foreground group-hover:text-foreground transition-colors">
                  {exp.company}
                </h2>
                <span className="font-mono text-xs text-foreground/40 mt-1 md:mt-0">
                  {exp.year}
                </span>
              </div>
              <div className="md:grid md:grid-cols-4">
                <p className="font-mono text-sm text-foreground/60 mb-2 md:mb-0">
                  {exp.role}
                </p>
                <p className="md:col-span-3 text-foreground/70 max-w-xl">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
