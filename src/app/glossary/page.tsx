import type { Metadata } from "next";
import { technicalTags, type TechnicalTag } from "@/config/technical-tags";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/seo/PageHeader";

interface CategorizedTags {
  [category: string]: TechnicalTag[];
}

export const metadata: Metadata = {
  title: "Glossary of Technical Tags - Vibe Code Better",
  description:
    "Consult the meaning of the technical tags used for prompt analysis.",
};

export default function GlossaryPage() {
  const categorizedTags = technicalTags.reduce((acc, tag) => {
    const category = tag.category || "Others";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tag);
    return acc;
  }, {} as CategorizedTags);

  const categories = Object.keys(categorizedTags).sort();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Glossary", href: "/glossary" },
          ]}
        />
        <PageHeader
          title="Glossary of Technical Tags"
          description="Consult the meaning of the technical tags used for prompt analysis."
        />
        <Card className="shadow-xl">
          <CardContent className="py-4">
            {categories.length === 0 ? (
              <p className="text-muted-foreground text-center">
                The glossary of tags is empty.
              </p>
            ) : (
              <Accordion type="multiple" className="w-full space-y-3">
                {categories.map((category) => (
                  <AccordionItem
                    key={category}
                    value={category}
                    className="border rounded-lg shadow-sm bg-card"
                  >
                    <AccordionTrigger className="p-4 text-lg font-medium hover:no-underline hover:bg-accent/10 transition-colors">
                      {category} ({categorizedTags[category].length} tags)
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <ul className="space-y-3 divide-y divide-border/50">
                        {categorizedTags[category].map((tag) => (
                          <li key={tag.id} className="pt-3 first:pt-0">
                            <p className="font-semibold text-base text-primary">
                              {tag.name}
                            </p>
                            <p className="text-sm text-foreground/80 mt-1">
                              {tag.description}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
