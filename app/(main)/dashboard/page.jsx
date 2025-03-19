import { getIndustryInsights } from "@/actions/dashboard";
// import DashboardView from "./_component/dashboard-view";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import DashboardView from "./_components/dashboard-view";
import { Button } from "@/components/ui/button";
import { Link, UserCog } from "lucide-react";
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
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Your personalized career insights and recommendations
            
          </p>
        </div>
        <div className="z-50">
          <Link href="/profile" className="inline-block">
            <Button 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md hover:shadow-lg transition-all duration-200"
              size="lg"
            >
              <UserCog className="h-5 w-5" />
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>
      <DashboardView insights={insights} />
    </div>
  );
}