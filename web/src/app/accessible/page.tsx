import { AccessibleResume } from "@/components/accessible/AccessibleResume";
import { resume } from "@/lib/resume";

export default function AccessiblePage() {
  return <AccessibleResume resume={resume} />;
}
