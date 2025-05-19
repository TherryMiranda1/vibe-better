import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TechniqueData {
  id: string;
  name: string;
  complexity: number;
  effectiveness: number;
  tokenUsage: number;
  implementation: number;
  bestFor: string[];
}

const techniques: TechniqueData[] = [
  {
    id: "chain-of-thought",
    name: "Chain-of-Thought",
    complexity: 2,
    effectiveness: 4,
    tokenUsage: 3,
    implementation: 2,
    bestFor: [
      "Math problems",
      "Step-by-step reasoning",
      "Detailed explanations",
    ],
  },
  {
    id: "few-shot",
    name: "Few-Shot Prompting",
    complexity: 2,
    effectiveness: 3,
    tokenUsage: 4,
    implementation: 1,
    bestFor: [
      "Classification",
      "Tasks with few examples available",
      "Rapid learning",
    ],
  },
  {
    id: "rag",
    name: "Retrieval Augmented Generation",
    complexity: 5,
    effectiveness: 5,
    tokenUsage: 4,
    implementation: 5,
    bestFor: [
      "Access to up-to-date information",
      "Fact-based answers",
      "Hallucination reduction",
    ],
  },
  {
    id: "zero-shot",
    name: "Zero-Shot Prompting",
    complexity: 1,
    effectiveness: 2,
    tokenUsage: 1,
    implementation: 1,
    bestFor: [
      "Simple tasks",
      "Quick interactions",
      "When no examples are available",
    ],
  },
  {
    id: "self-consistency",
    name: "Self-Consistency Prompting",
    complexity: 4,
    effectiveness: 4,
    tokenUsage: 5,
    implementation: 3,
    bestFor: [
      "Complex reasoning tasks",
      "Answer verification",
      "Advanced math problems",
    ],
  },
  {
    id: "tree-of-thoughts",
    name: "Tree-of-Thoughts",
    complexity: 5,
    effectiveness: 5,
    tokenUsage: 5,
    implementation: 4,
    bestFor: [
      "Multi-step problems",
      "Planning",
      "Exploring alternative solutions",
    ],
  },
  {
    id: "auto-prompting",
    name: "Auto-Prompting",
    complexity: 4,
    effectiveness: 3,
    tokenUsage: 4,
    implementation: 5,
    bestFor: [
      "Prompt optimization",
      "Automation",
      "Large-scale experimentation",
    ],
  },
];

const TechniqueComparison = () => {
  const [sortBy, setSortBy] = useState("name");

  const getSortedTechniques = () => {
    switch (sortBy) {
      case "name":
        return [...techniques].sort((a, b) => a.name.localeCompare(b.name));
      case "complexity":
        return [...techniques].sort((a, b) => a.complexity - b.complexity);
      case "complexity-desc":
        return [...techniques].sort((a, b) => b.complexity - a.complexity);
      case "effectiveness":
        return [...techniques].sort(
          (a, b) => b.effectiveness - a.effectiveness
        );
      case "tokenUsage":
        return [...techniques].sort((a, b) => a.tokenUsage - b.tokenUsage);
      default:
        return techniques;
    }
  };

  const renderRating = (value: number, max: number = 5) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-8 mx-0.5 rounded-sm ${
              i < value ? "bg-primary" : "bg-card"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="glass-card max-w-7xl mx-auto rounded-xl p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-2xl font-bold text-cyan">
          Technique Comparison
        </h3>
      </div>

      <div className="overflow-x-auto border rounded-lg ">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-cyan w-[180px]">Technique</TableHead>
              <TableHead className="text-cyan">Complexity</TableHead>
              <TableHead className="text-cyan">Effectiveness</TableHead>
              <TableHead className="text-cyan">Token Usage</TableHead>
              <TableHead className="text-cyan">Implementation</TableHead>
              <TableHead className="text-cyan">Best for</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getSortedTechniques().map((technique) => (
              <TableRow
                key={technique.id}
                className="border-white/10 hover:bg-white/5 transition-colors"
              >
                <TableCell className="font-medium">
                  <a
                    href={`#${technique.id}`}
                    className="hover:text-cyan transition-colors"
                  >
                    {technique.name}
                  </a>
                </TableCell>
                <TableCell>{renderRating(technique.complexity)}</TableCell>
                <TableCell>{renderRating(technique.effectiveness)}</TableCell>
                <TableCell>{renderRating(technique.tokenUsage)}</TableCell>
                <TableCell>{renderRating(technique.implementation)}</TableCell>
                <TableCell className="text-sm text-gray-300">
                  <ul className="list-disc pl-4">
                    {technique.bestFor.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TechniqueComparison;
