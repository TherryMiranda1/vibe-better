import { Heading } from "@/components/seo/Heading";
import { cn } from "@/lib/utils";
import { JSX } from "react";

interface PageHeaderProps {
  title: string;
  className?: string;
  badge?: {
    label: string;
    icon?: JSX.Element;
  };
  description?: string;
}

export const PageHeader = ({
  title,
  description,
  badge,
  className,
}: PageHeaderProps) => {
  return (
    <header className={cn("flex flex-col mb-12", className)}>
      {badge && (
        <div className="inline-flex items-center gap-2 bg-secondary/30 border border-primary/40 px-4 py-1.5 rounded-full text-sm font-medium text-primary mb-4 mx-auto">
          {badge.icon}
          <span>{badge.label}</span>
        </div>
      )}
      <Heading
        level={1}
        className="text-4xl font-extrabold sm:text-center sm:text-5xl"
      >
        {title}
      </Heading>
      {description && (
        // Administra tu cuenta, productos y suscripciones
        <p className="max-w-2xl m-auto mt-3 text-lg text-muted-foreground sm:text-center">
          {description}
        </p>
      )}
    </header>
  );
};
