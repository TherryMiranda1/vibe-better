"use client";

import { useEffect, useState } from "react";
import { getUserFeedback, FeedbackResult } from "@/lib/services/client/feedback.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./star-rating";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

export function UserFeedbackHistory() {
  const [feedbacks, setFeedbacks] = useState<FeedbackResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        const data = await getUserFeedback();
        setFeedbacks(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Failed to load your feedback history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-destructive/10 rounded-lg">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center p-6 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">You haven't submitted any feedback yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Your Feedback History</h3>
      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <Card key={feedback.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    <Badge variant="outline" className="mr-2">
                      {feedback.category}
                    </Badge>
                    {feedback.name ? feedback.name : "Anonymous"}
                  </CardTitle>
                  <CardDescription>
                    {formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}
                  </CardDescription>
                </div>
                <StarRating value={feedback.rating} onChange={() => {}} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">{feedback.message}</p>
              {feedback.allowPublic && (
                <Badge variant="secondary" className="mt-2">
                  Shared Publicly
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
