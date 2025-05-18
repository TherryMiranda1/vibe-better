import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { CreateOrganization } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
    return (
      <div className=" max-w-7xl mx-auto flex flex-col min-h-screen py-16">
        <Breadcrumbs items={[{ label: "Inicio", href: "/" }]} />
        <section className="mx-auto border rounded-xl overflow-hidden border-primary/50">
          <CreateOrganization />
        </section>
      </div>
    );
}
