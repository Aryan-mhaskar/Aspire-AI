"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
  UserCog,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const DashboardView = ({ insights }) => {
  // Transform salary data for the chart
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  // Format dates using date-fns
  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  return (
    <div className="space-y-8 p-4 bg-gradient-to-b from-blue-50/50 to-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-white py-2 px-4 text-sm font-medium border-blue-200">
            Last updated: {lastUpdatedDate}
          </Badge>
          <Link href="/profile">
            <Button variant="outline" 
              className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <UserCog className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600">Edit Profile</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Market Outlook
            </CardTitle>
            <OutlookIcon className={`h-5 w-5 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {insights.marketOutlook}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Next update {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Industry Growth
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress 
              value={insights.growthRate} 
              className="mt-2 bg-green-100 [&>[role=progressbar]]:bg-gradient-to-r [&>[role=progressbar]]:from-green-500 [&>[role=progressbar]]:to-emerald-500" 
            />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Demand Level
            </CardTitle>
            <BriefcaseIcon className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {insights.demandLevel}
            </div>
            <div className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(insights.demandLevel)} bg-opacity-80`} />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Top Skills
            </CardTitle>
            <Brain className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.topSkills.map((skill) => (
                <Badge key={skill} variant="secondary" 
                  className="bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors duration-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Ranges Chart */}
      <Card className="col-span-4 hover:shadow-lg transition-all duration-300 border-gray-100">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-xl font-semibold text-gray-700">Salary Ranges by Role</CardTitle>
          <CardDescription className="text-gray-500">
            Displaying minimum, median, and maximum salaries (in thousands)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis dataKey="name" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border rounded-lg p-3 shadow-lg">
                          <p className="font-medium text-gray-700 mb-2">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm text-gray-600">
                              {item.name}: <span className="font-semibold">${item.value}K</span>
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="max" fill="#475569" name="Max Salary (K)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Industry Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-gray-100">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-xl font-semibold text-gray-700">Key Industry Trends</CardTitle>
            <CardDescription className="text-gray-500">
              Current trends shaping the industry
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-3 group">
                  <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 group-hover:bg-blue-600 transition-colors duration-200" />
                  <span className="text-gray-600 group-hover:text-gray-900 transition-colors duration-200">{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-gray-100">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-xl font-semibold text-gray-700">Recommended Skills</CardTitle>
            <CardDescription className="text-gray-500">Skills to consider developing</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => (
                <Badge key={skill} variant="outline" 
                  className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 transition-colors duration-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;