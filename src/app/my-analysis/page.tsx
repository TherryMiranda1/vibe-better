import { Metadata } from "next";
import MyAnalysis from "@/features/my-analysis/MyAnalysis";

export const metadata: Metadata = {
  title: "My Analysis | Vibe Code Better",
  description: "View your saved prompt analysis history",
};

export default function MyAnalysisRoute() {
  return <MyAnalysis />;
}
