import { getAssessments } from "@/actions/interview";
// import StatsCards from "./_components/stats-cards";
// import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";
import PerformanceChart from "./_components/performance-chart";
import StatsCards from "./_components/stats-card";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-4xl mt-10 font-bold">
          Interview Preparation
        </h1>
      </div>
      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}