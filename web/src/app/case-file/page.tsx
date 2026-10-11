import { CaseFile } from "@/components/casefile/CaseFile";
import { resume } from "@/lib/resume";

export default function CaseFilePage() {
  return <CaseFile resume={resume} />;
}
