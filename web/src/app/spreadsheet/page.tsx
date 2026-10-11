import { SpreadsheetResume } from "@/components/spreadsheet/SpreadsheetResume";
import { resume } from "@/lib/resume";

export default function SpreadsheetPage() {
  return <SpreadsheetResume resume={resume} />;
}
