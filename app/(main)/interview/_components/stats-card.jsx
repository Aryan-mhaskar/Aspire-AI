import { Brain, Target, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsCards({ assessments }) {
  const getAverageScore = () => {
    if (!assessments?.length) return 0;
    const total = assessments.reduce(
      (sum, assessment) => sum + assessment.quizScore,
      0
    );
    return (total / assessments.length).toFixed(1);
  };

  const getLatestAssessment = () => {
    if (!assessments?.length) return null;
    return assessments[0];
  };

  const getTotalQuestions = () => {
    if (!assessments?.length) return 0;
    return assessments.reduce(
      (sum, assessment) => sum + assessment.questions.length,
      0
    );
  };

  return (
    // <div className="grid gap-4 md:grid-cols-3">
    //   <Card>
    //     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //       <CardTitle className="text-sm font-medium">Average Score</CardTitle>
    //       <Trophy className="h-4 w-4 text-muted-foreground" />
    //     </CardHeader>
    //     <CardContent>
    //       <div className="text-2xl font-bold">{getAverageScore()}%</div>
    //       <p className="text-xs text-muted-foreground">
    //         Across all assessments
    //       </p>
    //     </CardContent>
    //   </Card>

    //   <Card>
    //     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //       <CardTitle className="text-sm font-medium">
    //         Questions Practiced
    //       </CardTitle>
    //       <Brain className="h-4 w-4 text-muted-foreground" />
    //     </CardHeader>
    //     <CardContent>
    //       <div className="text-2xl font-bold">{getTotalQuestions()}</div>
    //       <p className="text-xs text-muted-foreground">Total questions</p>
    //     </CardContent>
    //   </Card>

    //   <Card>
    //     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //       <CardTitle className="text-sm font-medium">Latest Score</CardTitle>
    //       <Target className="h-4 w-4 text-muted-foreground" />
    //     </CardHeader>
    //     <CardContent>
    //       <div className="text-2xl font-bold">
    //         {getLatestAssessment()?.quizScore.toFixed(1) || 0}%
    //       </div>
    //       <p className="text-xs text-muted-foreground">Most recent quiz</p>
    //     </CardContent>
    //   </Card>
    // </div>
    <div className="grid gap-4 md:grid-cols-3">
  <Card className="transition-all duration-300 hover:shadow-lg hover:bg-gray-100">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-blue-600">
        Average Score
      </CardTitle>
      <Trophy className="h-4 w-4 text-yellow-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-blue-700">{getAverageScore()}%</div>
      <p className="text-xs text-gray-500">Across all assessments</p>
    </CardContent>
  </Card>

  <Card className="transition-all duration-300 hover:shadow-lg hover:bg-gray-100">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-green-600">
        Questions Practiced
      </CardTitle>
      <Brain className="h-4 w-4 text-green-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-green-700">{getTotalQuestions()}</div>
      <p className="text-xs text-gray-500">Total questions</p>
    </CardContent>
  </Card>

  <Card className="transition-all duration-300 hover:shadow-lg hover:bg-gray-100">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-red-600">
        Latest Score
      </CardTitle>
      <Target className="h-4 w-4 text-red-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-red-700">
        {getLatestAssessment()?.quizScore.toFixed(1) || 0}%
      </div>
      <p className="text-xs text-gray-500">Most recent quiz</p>
    </CardContent>
  </Card>
</div>

  );
}