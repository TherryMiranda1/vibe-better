import { FC, ReactNode } from "react";

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
  id?: string;
}

const headingStyles = {
  1: "text-4xl md:text-5xl font-bold",
  2: "text-3xl md:text-4xl font-semibold",
  3: "text-2xl md:text-3xl font-semibold",
  4: "text-xl md:text-2xl font-medium",
  5: "text-lg md:text-xl font-medium",
  6: "text-base md:text-lg font-medium",
};

export const Heading: FC<HeadingProps> = ({
  level,
  children,
  className = "",
  id,
}) => {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
  const baseStyles = headingStyles[level];

  return (
    <Tag id={id} className={`${baseStyles} ${className}`}>
      {children}
    </Tag>
  );
};
