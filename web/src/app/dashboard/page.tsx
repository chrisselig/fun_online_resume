import { Dashboard } from "@/components/dashboard/Dashboard";
import { resume } from "@/lib/resume";

export default function DashboardPage() {
  return <Dashboard resume={resume} />;
}
