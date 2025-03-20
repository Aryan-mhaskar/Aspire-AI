"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { z } from "zod";
import { updateUser } from "@/actions/user";
import { useUser } from "@clerk/nextjs";

// Create a new schema for profile form where all fields are optional
const profileSchema = z.object({
  industry: z.string().optional(),
  subIndustry: z.string().optional(),
  bio: z.string().max(500).optional(),
  experience: z.string()
    .transform((val) => {
      if (!val) return undefined;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? undefined : Number(parsed.toFixed(1));
    })
    .pipe(
      z.number()
        .min(0, "Experience must be at least 0 years")
        .max(50, "Experience cannot exceed 50 years")
        .optional()
    )
    .optional(),
  skills: z.string()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : undefined
    )
    .optional(),
});

const ProfileForm = ({ industries, userData }) => {
  const router = useRouter();
  const { user } = useUser();
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);

  // Parse the industry and subIndustry from userData
  const getIndustryData = () => {
    if (!userData?.industry) return { industry: "", subIndustry: "" };
    const [industry, ...subIndustryParts] = userData.industry.split("-");
    return {
      industry,
      subIndustry: subIndustryParts.join(" ").replace(/-/g, " "),
    };
  };

  const { industry, subIndustry } = getIndustryData();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      industry: industry || "",
      subIndustry: subIndustry || "",
      experience: userData?.experience || "",
      skills: userData?.skills?.join(", ") || "",
      bio: userData?.bio || "",
    },
  });

  // Set initial industry selection
  useEffect(() => {
    if (industry) {
      const industryData = industries.find((ind) => ind.id === industry);
      setSelectedIndustry(industryData);
    }
  }, [industry, industries]);

  const onSubmit = async (values) => {
    try {
      // Only format industry if both industry and subIndustry are provided
      const formattedIndustry = values.industry && values.subIndustry
        ? `${values.industry}-${values.subIndustry.toLowerCase().replace(/ /g, "-")}`
        : values.industry;

      await updateUserFn({
        ...values,
        industry: formattedIndustry,
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile updated successfully!");
      router.refresh();
      router.push("/dashboard");
    }
  }, [updateResult, updateLoading, router]);

  const watchIndustry = watch("industry");

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-b from-blue-50/50 to-white p-6">
      <Card className="w-full max-w-lg border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="space-y-1 border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Your Profile
          </CardTitle>
          <CardDescription className="text-gray-500 text-base">
            Update your professional information to get personalized career insights
            and recommendations. All fields are optional.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-gray-700 font-medium">Industry</Label>
              <Select
                defaultValue={industry}
                onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectedIndustry(
                    industries.find((ind) => ind.id === value)
                  );
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id="industry" className="bg-white border-gray-200 hover:border-blue-300 transition-colors">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-blue-600">Industries</SelectLabel>
                    {industries.map((ind) => (
                      <SelectItem key={ind.id} value={ind.id} className="hover:bg-blue-50">
                        {ind.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {watchIndustry && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry" className="text-gray-700 font-medium">Specialization</Label>
                <Select
                  defaultValue={subIndustry}
                  onValueChange={(value) => setValue("subIndustry", value)}
                >
                  <SelectTrigger id="subIndustry" className="bg-white border-gray-200 hover:border-blue-300 transition-colors">
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="text-blue-600">Specializations</SelectLabel>
                      {selectedIndustry?.subIndustries.map((sub) => (
                        <SelectItem key={sub} value={sub} className="hover:bg-blue-50">
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-500">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-gray-700 font-medium">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                step="0.1"
                placeholder="Enter years of experience (e.g., 2.5)"
                className="bg-white border-gray-200 hover:border-blue-300 transition-colors focus:border-blue-500"
                {...register("experience")}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills" className="text-gray-700 font-medium">Skills</Label>
              <Input
                id="skills"
                placeholder="e.g., Python, JavaScript, Project Management"
                className="bg-white border-gray-200 hover:border-blue-300 transition-colors focus:border-blue-500"
                {...register("skills")}
              />
              <p className="text-sm text-gray-500">
                Separate multiple skills with commas
              </p>
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-700 font-medium">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background..."
                className="h-32 bg-white border-gray-200 hover:border-blue-300 transition-colors focus:border-blue-500 resize-none"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileForm; 