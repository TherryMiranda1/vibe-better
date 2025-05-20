import { FooterProps } from "@/components/footer/Footer";
import Image from "next/image";
import { Linkedin, Twitter, Youtube } from "lucide-react";

export const footerData: FooterProps = {
  config: {
    logo: (
      <Image
        src="https://res.cloudinary.com/dtlaxm8gi/image/upload/v1747421226/vibeBetter-16-9_xd9dwe.png"
        alt="Vibe Better"
        width={80}
        height={46}
      />
    ),
    description: "Optimize your coding prompts with AI analysis.",
    copyright: "All rights reserved",
    showYear: true,
    brandName: "Vibe Better",
    columns: [
      {
        title: "",
        links: [
          { name: "Analyze", href: "/#analyze" },
          { name: "Pricing", href: "/pricing" },
        ],
      },
      {
        title: "Resources",
        links: [
          { name: "Prompts", href: "/prompts" },
          { name: "Tags", href: "/tags" },
          { name: "Prompt Guide", href: "/prompt-guide" },
        ],
      },
    ],
    socialLinks: [
      {
        name: "Linkedin",
        href: "https://www.linkedin.com/company/10x-develpment",
        icon: Linkedin,
        isExternal: true,
      },
      {
        name: "Twitter",
        href: "https://x.com/x10development",
        icon: Twitter,
        isExternal: true,
      },
      {
        name: "YouTube",
        href: "https://www.youtube.com/@10xdevelopment",
        icon: Youtube,
        isExternal: true,
      },
    ],
    bottomLinks: [
      {
        name: "Give Feedback",
        href: "/feedback",
        highLight: true,
      },
    ],
    newsletterTitle: "Subscribe to our newsletter",
    newsletterDescription:
      "Get the latest updates and resources in your inbox.",
    showNewsletter: false,
  },
};
