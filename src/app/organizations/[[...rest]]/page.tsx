import { OrganizationProfile, OrganizationSwitcher } from "@clerk/nextjs";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/seo/PageHeader";

export default async function Organizations() {
  const { orgId, userId } = await auth();

  if (!userId) {
    return redirect("/");
  }
  return (
    <div className=" max-w-7xl mx-auto flex flex-col min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Organizaciones", href: "/organizations" },
        ]}
      />
      <PageHeader
        title="Organizations"
        description="Manage your organizations and invite members"
      />
      <section className="mx-auto border rounded-xl overflow-hidden border-primary/50 mb-8">
        <OrganizationSwitcher hidePersonal />
      </section>
      {orgId && (
        <section className="mx-auto border rounded-xl overflow-hidden border-primary/50">
          <OrganizationProfile />
        </section>
      )}
    </div>
  );
}
