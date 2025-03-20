// import { BrainCircuit, Briefcase, LineChart, ScrollText } from "lucide-react";

// export const features = [
//   {
//     icon: <BrainCircuit className="w-10 h-10 mb-4 text-primary" />,
//     title: "AI-Powered Career Guidance",
//     description:
//       "Get personalized career advice and insights powered by advanced AI technology.",
//   },
//   {
//     icon: <Briefcase className="w-10 h-10 mb-4 text-primary" />,
//     title: "Interview Preparation",
//     description:
//       "Practice with role-specific questions and get instant feedback to improve your performance.",
//   },
//   {
//     icon: <LineChart className="w-10 h-10 mb-4 text-primary" />,
//     title: "Industry Insights",
//     description:
//       "Stay ahead with real-time industry trends, salary data, and market analysis.",
//   },
//   {
//     icon: <ScrollText className="w-10 h-10 mb-4 text-primary" />,
//     title: "Smart Resume Creation",
//     description: "Generate ATS-optimized resumes with AI assistance.",
//   },
// ];


import { BrainCircuit, Briefcase, LineChart, ScrollText, FileText, CheckCircle2 } from "lucide-react";

export const features = [
  {
    icon: <BrainCircuit className="w-10 h-10 mb-4 text-primary" />,
    title: "AI-Powered Career Guidance",
    description: "Get personalized career advice and insights powered by advanced AI technology.",
    link: "/dashboard",
  },
  {
    icon: <Briefcase className="w-10 h-10 mb-4 text-primary" />,
    title: "Interview Preparation",
    description: "Practice with role-specific questions and get instant feedback to improve your performance.",
    link: "/interview",
  },
  {
    icon: <LineChart className="w-10 h-10 mb-4 text-primary" />,
    title: "Industry Insights",
    description: "Stay ahead with real-time industry trends, salary data, and market analysis.",
    link: "/dashboard",
  },
  {
    icon: <ScrollText className="w-10 h-10 mb-4 text-primary" />,
    title: "Smart Resume Creation",
    description: "Generate resumes with AI assistance.",
    link: "/resume",
  },
  {
    icon: <FileText className="w-10 h-10 mb-4 text-primary" />,
    title: "AI Cover Letter",
    description: "Create compelling cover letters tailored to specific job roles using AI.",
    link: "/ai-cover-letter",
  },
  {
    icon: <CheckCircle2 className="w-10 h-10 mb-4 text-primary" />,
    title: "Interview Quiz",
    description: "Test your interview readiness with industry-specific practice quizzes and assessments.",
    link: "/interview-quiz",
  },
];
