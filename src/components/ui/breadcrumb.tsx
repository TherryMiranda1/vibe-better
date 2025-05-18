import { FC } from "react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex items-center space-x-2 p-1 mb-4">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <span className="mx-1 text-muted-foreground" aria-hidden="true">
                /
              </span>
            )}
            {index === items.length - 1 ? (
              <span className="text-muted-foreground line-clamp-1">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <p className="line-clamp-1">{item.label}</p>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
