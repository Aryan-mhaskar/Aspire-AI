"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveResume } from "@/actions/resume";
import { EntryForm } from "./entry-form";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState("preview");
  const [isDirectEditing, setIsDirectEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  // Watch form fields for preview updates
  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  // Update preview content when form values change
  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab]);

  // Handle save result
  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user?.fullName || 'Your Name'}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById("resume-pdf");
      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formattedContent = previewContent
        .replace(/\n/g, "\n") // Normalize newlines
        .replace(/\n\s*\n/g, "\n\n") // Normalize multiple newlines to double newlines
        .trim();

      console.log(previewContent, formattedContent);
      await saveResumeFn(previewContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleDirectEdit = async () => {
    try {
      await saveResumeFn(previewContent);
      setIsDirectEditing(false);
      toast.success("Resume saved successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to save resume");
    }
  };

  // Parse markdown content to form values
  const parseMarkdownToForm = (content) => {
    try {
      const formData = {
        contactInfo: {},
        summary: "",
        skills: "",
        experience: [],
        education: [],
        projects: [],
      };

      const sections = content.split(/^##\s+/m).filter(Boolean);
      
      sections.forEach(section => {
        const [title, ...contentLines] = section.trim().split('\n');
        const sectionContent = contentLines.join('\n').trim();

        if (title.includes('Professional Summary')) {
          formData.summary = sectionContent;
        } else if (title.includes('Skills')) {
          formData.skills = sectionContent;
        } else if (title.includes('Work Experience')) {
          // Parse experience entries
          const entries = sectionContent.split(/^###\s+/m).filter(Boolean);
          formData.experience = entries.map(entry => {
            const [titleLine, dateLine, ...description] = entry.trim().split('\n');
            const [title, organization] = titleLine.split(' @ ');
            const [startDate, endDate] = dateLine.split(' - ');
            return {
              title,
              organization,
              startDate,
              endDate: endDate === 'Present' ? '' : endDate,
              current: endDate === 'Present',
              description: description.join('\n').trim()
            };
          });
        } else if (title.includes('Education')) {
          // Parse education entries
          const entries = sectionContent.split(/^###\s+/m).filter(Boolean);
          formData.education = entries.map(entry => {
            const [titleLine, dateLine, ...description] = entry.trim().split('\n');
            const [title, organization] = titleLine.split(' @ ');
            const [startDate, endDate] = dateLine.split(' - ');
            return {
              title,
              organization,
              startDate,
              endDate: endDate === 'Present' ? '' : endDate,
              current: endDate === 'Present',
              description: description.join('\n').trim()
            };
          });
        } else if (title.includes('Projects')) {
          // Parse project entries
          const entries = sectionContent.split(/^###\s+/m).filter(Boolean);
          formData.projects = entries.map(entry => {
            const [titleLine, dateLine, ...description] = entry.trim().split('\n');
            const [title, organization] = titleLine.split(' @ ');
            const [startDate, endDate] = dateLine.split(' - ');
            return {
              title,
              organization,
              startDate,
              endDate: endDate === 'Present' ? '' : endDate,
              current: endDate === 'Present',
              description: description.join('\n').trim()
            };
          });
        } else if (title.includes('<div align="center">')) {
          // Parse contact info from the content between <div align="center"> tags
          const contactSection = sectionContent.match(/<div align="center">\n\n(.*?)\n\n<\/div>/s);
          if (contactSection && contactSection[1]) {
            const contactParts = contactSection[1].split(' | ');
            contactParts.forEach(part => {
              if (part.includes('📧')) {
                formData.contactInfo.email = part.replace('📧', '').trim();
              } else if (part.includes('📱')) {
                formData.contactInfo.mobile = part.replace('📱', '').trim();
              } else if (part.includes('💼')) {
                const match = part.match(/\[LinkedIn\]\((.*?)\)/);
                if (match) formData.contactInfo.linkedin = match[1];
              } else if (part.includes('🐦')) {
                const match = part.match(/\[Twitter\]\((.*?)\)/);
                if (match) formData.contactInfo.twitter = match[1];
              }
            });
          }
        }
      });

      return formData;
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return null;
    }
  };

  // Update form when markdown content changes
  const handleMarkdownChange = (newContent) => {
    setPreviewContent(newContent);
    if (isDirectEditing) {
      const formData = parseMarkdownToForm(newContent);
      if (formData) {
        reset(formData);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Resume Builder</h1>
        <div className="flex gap-2">
          <Button
            onClick={generatePDF}
            disabled={isGenerating}
            variant="outline"
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
          {activeTab === "preview" && (
            <Button
              onClick={() => {
                if (isDirectEditing) {
                  handleDirectEdit();
                } else {
                  setIsDirectEditing(true);
                  setResumeMode("edit");
                }
              }}
              variant="outline"
              className="gap-2"
              disabled={isSaving}
            >
              {isDirectEditing ? (
                isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save
                  </>
                )
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Edit
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => {
          setActiveTab(value);
          if (value === "preview") {
            setIsDirectEditing(false);
            setResumeMode("preview");
          }
        }}
        className="border rounded-xl p-4 bg-white shadow-lg"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger 
            value="edit"
            className="text-lg font-medium transition-all duration-300"
          >
            Form
          </TabsTrigger>
          <TabsTrigger 
            value="preview"
            className="text-lg font-medium transition-all duration-300"
          >
            Markdown
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Information */}
            <div className="space-y-4 transition-all duration-300 hover:shadow-lg rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
                  <Input
                    {...register("contactInfo.email")}
                    type="email"
                    placeholder="your@gmail.com"
                    className={errors.contactInfo?.email ? "border-red-500" : ""}
                  />
                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-500 animate-pulse">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type="tel"
                    placeholder="+91 1234567890"
                    className={errors.contactInfo?.mobile ? "border-red-500" : ""}
                  />
                  {errors.contactInfo?.mobile && (
                    <p className="text-sm text-red-500 animate-pulse">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn URL</label>
                  <Input
                    {...register("contactInfo.linkedin")}
                    type="url"
                    placeholder="https://linkedin.com/in/your-profile"
                    className={errors.contactInfo?.linkedin ? "border-red-500" : ""}
                  />
                  {errors.contactInfo?.linkedin && (
                    <p className="text-sm text-red-500 animate-pulse">
                      {errors.contactInfo.linkedin.message}
                    </p>
                  )}
                </div>
                {/* <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Twitter/X Profile
                  </label>
                  <Input
                    {...register("contactInfo.twitter")}
                    type="url"
                    placeholder="https://twitter.com/your-handle"
                  />
                  {errors.contactInfo?.twitter && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.twitter.message}
                    </p>
                  )}
                </div> */}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4 p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Professional Summary <span className="text-red-500">*</span>
              </h3>
              <div className="space-y-2">
                <Controller
                  name="summary"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className={`h-32 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                        errors.summary ? "border-red-500" : ""
                      }`}
                      placeholder="Write a compelling professional summary (minimum 50 characters)..."
                    />
                  )}
                />
                {errors.summary && (
                  <p className="text-sm text-red-500 animate-pulse">{errors.summary.message}</p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4 p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Skills <span className="text-red-500">*</span>
              </h3>
              <div className="space-y-2">
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className={`h-32 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                        errors.skills ? "border-red-500" : ""
                      }`}
                      placeholder="List your key skills (comma-separated, minimum 3 skills)..."
                    />
                  )}
                />
                {errors.skills && (
                  <p className="text-sm text-red-500 animate-pulse">{errors.skills.message}</p>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-4 p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Work Experience
              </h3>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <div className="transform transition-all duration-300 hover:scale-[1.01]">
                    <EntryForm
                      type="Experience"
                      entries={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                )}
              />
              {errors.experience && (
                <p className="text-sm text-red-500 animate-pulse">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Education */}
            <div className="space-y-4 p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Education"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.education && (
                <p className="text-sm text-red-500">
                  {errors.education.message}
                </p>
              )}
            </div>

            {/* Projects */}
            <div className="space-y-4 p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Project"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.projects && (
                <p className="text-sm text-red-500">
                  {errors.projects.message}
                </p>
              )}
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preview">
          {activeTab === "preview" && !isDirectEditing && resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You will lose edited markdown if you update the form data.
              </span>
            </div>
          )}
          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={handleMarkdownChange}
              height={800}
              preview={resumeMode}
              readOnly={!isDirectEditing}
            />
          </div>
          <div className="hidden">
            <div id="resume-pdf">
              <MDEditor.Markdown
                source={previewContent}
                style={{
                  background: "white",
                  color: "black",
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}