import { Terminal } from "@/components/terminal/Terminal";
import { resume } from "@/lib/resume";

export default function TerminalPage() {
  return <Terminal resume={resume} />;
}
