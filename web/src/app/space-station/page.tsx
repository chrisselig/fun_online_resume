import { SpaceStation } from "@/components/spacestation/SpaceStation";
import { resume } from "@/lib/resume";

export default function SpaceStationPage() {
  return <SpaceStation resume={resume} />;
}
