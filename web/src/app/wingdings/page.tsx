import { WingdingsResume } from "@/components/wingdings/WingdingsResume";
import { resume } from "@/lib/resume";

export default function WingdingsPage() {
  return <WingdingsResume resume={resume} />;
}
