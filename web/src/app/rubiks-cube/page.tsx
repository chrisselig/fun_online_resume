import { RubiksCube } from "@/components/rubiks/RubiksCube";
import { resume } from "@/lib/resume";

export default function RubiksCubePage() {
  return <RubiksCube resume={resume} />;
}
