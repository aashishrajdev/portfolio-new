import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({
  children,
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-[calc(75%)] max-w-full h-[calc(100%)] max-h-[calc(100%)] px-4 md:px-8 ${className}`}
    >
      {children}
    </div>
  );
}
