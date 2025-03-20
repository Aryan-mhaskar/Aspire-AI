// app/resume/_components/entry-form.jsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  experienceEntrySchema, 
  educationEntrySchema, 
  projectEntrySchema 
} from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Pencil, Save, Loader2 } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

const getSchemaForType = (type) => {
  switch (type) {
    case "Experience":
      return experienceEntrySchema;
    case "Education":
      return educationEntrySchema;
    case "Project":
      return projectEntrySchema;
    default:
      return experienceEntrySchema;
  }
};

const getPlaceholders = (type) => {
  switch (type) {
    case "Experience":
      return {
        title: "Job Title/Position",
        organization: "Company",
        description: "Describe your role, responsibilities, and achievements (minimum 50 characters)..."
      };
    case "Education":
      return {
        title: "Degree/Certification",
        organization: "Institution/University",
        description: "Describe your academic achievements, coursework, or research (minimum 10 characters)..."
      };
    case "Project":
      return {
        title: "Project Name",
        organization: "Technologies/Tools Used",
        description: "Describe the project, your role, and outcomes (minimum 30 characters)..."
      };
    default:
      return {
        title: "",
        organization: "",
        description: ""
      };
  }
};

export function EntryForm({ type, entries, onChange }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const placeholders = getPlaceholders(type);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(getSchemaForType(type)),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");
  const description = watch("description");

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    onChange([...entries, formattedEntry]);
    reset();
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  const handleImproveDescription = async () => {
    if (!description) return;
    
    setIsImproving(true);
    try {
      const improved = await improveWithAI({
        current: description,
        type: type,
      });
      setValue("description", improved);
      toast.success("Description improved!");
    } catch (error) {
      toast.error(error.message || "Failed to improve description");
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {entries.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title} @ {item.organization}
              </CardTitle>
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => handleDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.current
                  ? `${item.startDate} - Present`
                  : `${item.startDate} - ${item.endDate}`}
              </p>
              <p className="mt-2 text-sm whitespace-pre-wrap">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {type === "Experience" ? "Job Title/Position" :
                   type === "Education" ? "Degree/Certification" :
                   "Project Name"} <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder={placeholders.title}
                  {...register("title")}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 animate-pulse">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {type === "Experience" ? "Company" :
                   type === "Education" ? "Institution/University" :
                   "Technologies/Tools"} <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder={placeholders.organization}
                  {...register("organization")}
                  className={errors.organization ? "border-red-500" : ""}
                />
                {errors.organization && (
                  <p className="text-sm text-red-500 animate-pulse">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="month"
                  {...register("startDate")}
                  className={errors.startDate ? "border-red-500" : ""}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500 animate-pulse">{errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  End Date {!current && <span className="text-red-500">*</span>}
                </label>
                <Input
                  type="month"
                  {...register("endDate")}
                  disabled={current}
                  className={errors.endDate ? "border-red-500" : ""}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500 animate-pulse">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="current"
                {...register("current")}
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) {
                    setValue("endDate", "");
                  }
                }}
              />
              <label htmlFor="current">
                {type === "Experience" 
                  ? "Current Job"
                  : type === "Education"
                  ? "Currently Studying"
                  : "Ongoing Project"}
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder={placeholders.description}
                className={`h-32 ${errors.description ? "border-red-500" : ""}`}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500 animate-pulse">{errors.description.message}</p>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleImproveDescription}
              disabled={isImproving || !description}
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Improve with AI
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
}
