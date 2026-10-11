import { C64Baseball } from "@/components/baseball/C64Baseball";
import { resume } from "@/lib/resume";

export default function BaseballPage() {
  return <C64Baseball resume={resume} />;
}
