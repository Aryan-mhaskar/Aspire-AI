import { getIndustryInsights } from "@/actions/dashboard";
// import DashboardView from "./_component/dashboard-view";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import DashboardView from "./_components/dashboard-view";
// import { Button } from "@/components/ui/button";
// import { Link, UserCog } from "lucide-react";

export default async function DashboardPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  // If not onboarded, redirect to onboarding page
  // Skip this check if already on the onboarding page
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const insights = await getIndustryInsights();

  return (
    <div className="container mx-auto">
      {/* <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/profile">
          <Button variant="outline" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            Edit Profile
          </Button>
        </Link>
      </div> */}
      <DashboardView insights={insights} />
    </div>

    
  );
  

}