import { industries } from "@/data/industries";
import ProfileForm from "./_components/profile-form";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

async function getUserData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      experience: true,
      bio: true,
      skills: true,
    },
  });

  return user;
}

export default async function ProfilePage() {
  // Check if user is onboarded
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    redirect("/onboarding");
  }

  // Get user data
  const userData = await getUserData();

  return (
    <main className="container mx-auto py-8">
      <ProfileForm industries={industries} userData={userData} />
    </main>
  );
} 