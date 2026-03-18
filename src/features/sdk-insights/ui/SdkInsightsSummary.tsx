import type { SummarySection } from "../model/types";
import { Value } from "./Value";

interface SdkInsightsSummaryProps {
  sections: SummarySection[];
}

export function SdkInsightsSummary({ sections }: SdkInsightsSummaryProps) {
  if (sections.length === 0) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sections.map((section) => (
        <div key={section.title} className="space-y-1">
          <h4 className="font-medium">{section.title}</h4>
          {section.rows.map((row) => (
            <div key={row.label}>
              {row.label}: <Value value={row.value} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
