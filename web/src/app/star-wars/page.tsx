import { StarWarsCrawl } from "@/components/starwars/StarWarsCrawl";
import { resume } from "@/lib/resume";

export default function StarWarsPage() {
  return <StarWarsCrawl resume={resume} />;
}
