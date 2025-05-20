import { Metadata } from "next";
import { FeedbackForm } from "@/components/feedback-form";
import { UserFeedbackHistory } from "@/components/user-feedback-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@clerk/nextjs/server";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/seo/PageHeader";

export const metadata: Metadata = {
  title: "Feedback | Vibe Code Better",
  description: "Share your feedback and help us improve Vibe Code Better",
};

export default async function FeedbackPage() {
  const session = await auth();
  const userId = session?.userId;

  return (
    <main className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Feedback", href: "/feedback" },
        ]}
      />
      <PageHeader
        title="Feedback"
        description="We value your input! Your feedback helps us improve Vibe Code Better and deliver a better experience for prompt optimization."
      />

      <Tabs defaultValue="submit" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
          <TabsTrigger value="history" disabled={!userId}>
            Your Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submit" className="mt-0">
          <FeedbackForm />
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          {userId ? (
            <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl border shadow-sm">
              <UserFeedbackHistory />
            </div>
          ) : (
            <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl border shadow-sm text-center">
              <p className="text-muted-foreground">
                Please sign in to view your feedback history.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
