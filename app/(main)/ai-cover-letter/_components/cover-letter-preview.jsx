"use client";

import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Edit, Save, Download, Loader2 } from "lucide-react";
import { saveCoverLetterContent } from "@/actions/cover-letter";
import { toast } from "sonner";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";

const CoverLetterPreview = ({ content, coverId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveCoverLetterContent(coverId, editedContent);
      toast.success("Cover letter saved successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to save cover letter");
    } finally {
      setIsSaving(false);
    }
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById("cover-letter-pdf");
      const opt = {
        margin: [15, 15],
        filename: "cover-letter.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="py-4 space-y-4">
      <div className="flex justify-end gap-2">
        <Button
          onClick={generatePDF}
          variant="outline"
          className="gap-2"
          disabled={isGenerating}
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
        <Button
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          variant="outline"
          className="gap-2"
          disabled={isSaving}
        >
          {isEditing ? (
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
      </div>
      <MDEditor
        value={editedContent}
        onChange={setEditedContent}
        preview={isEditing ? "edit" : "preview"}
        height={700}
      />
      <div className="hidden">
        <div id="cover-letter-pdf">
          <MDEditor.Markdown
            source={editedContent}
            style={{
              background: "white",
              color: "black",
              padding: "20px",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPreview;