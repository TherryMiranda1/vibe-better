import { LucideIcon, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface FooterLinkItem {
  name: string;
  href: string;
  icon?: LucideIcon;
  isExternal?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLinkItem[];
}

export interface FooterConfig {
  logo?: ReactNode;
  description?: string;
  copyright?: string;
  showYear?: boolean;
  brandName?: string;
  columns?: FooterColumn[];
  socialLinks?: FooterLinkItem[];
  bottomLinks?: FooterLinkItem[];
  newsletterTitle?: string;
  newsletterDescription?: string;
  showNewsletter?: boolean;
}

export interface FooterProps {
  className?: string;
  config: FooterConfig;
  variant?: "default" | "simple" | "centered" | "minimal";
  bgColor?: string;
  borderTop?: boolean;
  children?: ReactNode;
}

export default function Footer({
  className,
  config,
  variant = "default",
  bgColor = "bg-background",
  borderTop = true,
  children,
}: FooterProps) {
  const {
    logo,
    description,
    copyright,
    showYear,
    brandName,
    columns,
    socialLinks,
    bottomLinks,
    newsletterTitle,
    newsletterDescription,
    showNewsletter,
  } = config;

  const renderLink = (link: FooterLinkItem) => {
    if (link.isExternal) {
      return (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {link.name}
          {!link.icon && <ExternalLink className="inline ml-1 h-3 w-3" />}
        </a>
      );
    }

    return (
      <Link
        key={link.name}
        href={link.href}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {link.name}
      </Link>
    );
  };

  const renderSocialLinks = () => (
    <div className="flex items-center space-x-4">
      {socialLinks?.map((social) => (
        <a
          key={social.href}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label={social.name}
        >
          {social.icon && <social.icon className="h-5 w-5" />}
          <span className="sr-only">{social.name}</span>
        </a>
      ))}
    </div>
  );

  const renderNewsletterForm = () => {
    if (!showNewsletter) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">{newsletterTitle}</h3>
        <p className="text-sm text-muted-foreground">{newsletterDescription}</p>
        <div className="flex max-w-md items-center space-x-2">
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            className="flex h-10 w-full rounded-card border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-card bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Suscribirse
          </button>
        </div>
      </div>
    );
  };

  const renderSimpleFooter = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          {logo && (
            <Link href="/" className="flex items-center">
              {logo}
            </Link>
          )}
          <p className="text-sm text-muted-foreground">
            © {showYear ? new Date().getFullYear() : ""} {brandName}.{" "}
            {copyright}
          </p>
        </div>

        {socialLinks && socialLinks.length > 0 && (
          <div className="flex items-center">{renderSocialLinks()}</div>
        )}
      </div>
    </div>
  );

  const renderCenteredFooter = () => (
    <div className="max-w-7xl mx-auto px-4 py-8 text-center">
      <div className="mx-auto max-w-lg space-y-6">
        {logo && (
          <div className="flex justify-center">
            <Link href="/" className="text-2xl font-bold">
              {logo}
            </Link>
          </div>
        )}

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        {socialLinks && socialLinks.length > 0 && (
          <div className="flex justify-center space-x-4">
            {renderSocialLinks()}
          </div>
        )}

        {bottomLinks && bottomLinks.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {bottomLinks.map((link) => (
              <li key={link.href} className="list-none">
                {renderLink(link)}
              </li>
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          © {showYear ? new Date().getFullYear() : ""} {brandName}. {copyright}
        </p>
      </div>
    </div>
  );

  const renderMinimalFooter = () => (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">
          © {showYear ? new Date().getFullYear() : ""} {brandName}. {copyright}
        </p>

        {bottomLinks && bottomLinks.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {bottomLinks.map((link) => (
              <li key={link.href} className="list-none text-xs">
                {renderLink(link)}
              </li>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderDefaultFooter = () => (
    <div className="max-w-7xl mx-auto p-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo y descripción */}
        <div className="lg:col-span-1 space-y-4">
          {logo && (
            <Link href="/" className="text-2xl font-bold">
              {logo}
            </Link>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex space-x-4 pt-2">{renderSocialLinks()}</div>
          )}
        </div>

        {/* Columnas de enlaces */}
        {columns?.map((column, index) => (
          <div key={index} className="space-y-4">
            <h3 className="text-sm font-semibold">{column.title}</h3>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>{renderLink(link)}</li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter */}
        {showNewsletter && (
          <div className="md:col-span-2 lg:col-span-1">
            {renderNewsletterForm()}
          </div>
        )}
      </div>

      <Separator className="my-8" />

      {/* Pie del footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">
          © {showYear ? new Date().getFullYear() : ""} {brandName}. {copyright}
        </p>

        {bottomLinks && bottomLinks.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {bottomLinks.map((link) => (
              <span key={link.href}>{renderLink(link)}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <footer
      className={cn("w-full", bgColor, borderTop && "border-t", className)}
    >
      {children
        ? children
        : variant === "simple"
          ? renderSimpleFooter()
          : variant === "centered"
            ? renderCenteredFooter()
            : variant === "minimal"
              ? renderMinimalFooter()
              : renderDefaultFooter()}
    </footer>
  );
}
