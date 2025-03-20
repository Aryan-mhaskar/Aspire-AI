// import { z } from "zod";

// export const onboardingSchema = z.object({
//   industry: z.string({
//     required_error: "Please select an industry",
//   }),
//   subIndustry: z.string({
//     required_error: "Please select a specialization",
//   }),
//   bio: z.string().max(500).optional(),
//   experience: z
//     .string()
//     .transform((val) => {
//       const parsed = parseFloat(val);
//       return isNaN(parsed) ? undefined : Number(parsed.toFixed(1));
//     })
//     .pipe(
//       z
//         .number()
//         .min(0, "Experience must be at least 0 years")
//         .max(50, "Experience cannot exceed 50 years")
//     ),
//   skills: z.string().transform((val) =>
//     val
//       ? val
//           .split(",")
//           .map((skill) => skill.trim())
//           .filter(Boolean)
//       : undefined
//   ),
// });

// export const contactSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   mobile: z.string().optional(),
//   linkedin: z.string().optional(),
//   twitter: z.string().optional(),
// });

// export const entrySchema = z
//   .object({
//     title: z.string().min(1, "Title is required"),
//     organization: z.string().min(1, "Organization is required"),
//     startDate: z.string().min(1, "Start date is required"),
//     endDate: z.string().optional(),
//     description: z.string().min(1, "Description is required"),
//     current: z.boolean().default(false),
//   })
//   .refine(
//     (data) => {
//       if (!data.current && !data.endDate) {
//         return false;
//       }
//       return true;
//     },
//     {
//       message: "End date is required unless this is your current position",
//       path: ["endDate"],
//     }
//   );

// export const resumeSchema = z.object({
//   contactInfo: contactSchema,
//   summary: z.string().min(1, "Professional summary is required"),
//   skills: z.string().min(1, "Skills are required"),
//   experience: z.array(entrySchema),
//   education: z.array(entrySchema),
//   projects: z.array(entrySchema),
// });

// export const coverLetterSchema = z.object({
//   companyName: z.string().min(1, "Company name is required"),
//   jobTitle: z.string().min(1, "Job title is required"),
//   jobDescription: z.string().min(1, "Job description is required"),
// });



import { z } from "zod";

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export const contactSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email is too long"),
  mobile: z
    .string()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, "Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .regex(URL_REGEX, "Please enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  twitter: z
    .string()
    .regex(URL_REGEX, "Please enter a valid Twitter URL")
    .optional()
    .or(z.literal("")),
});

export const entrySchema = z
  .object({
    title: z
      .string()
      .min(2, "Title must be at least 2 characters")
      .max(100, "Title must be less than 100 characters")
      .regex(/^[a-zA-Z0-9\s\-_./&()]+$/, "Title contains invalid characters"),
    organization: z
      .string()
      .min(2, "Organization must be at least 2 characters")
      .max(100, "Organization must be less than 100 characters")
      .regex(/^[a-zA-Z0-9\s\-_./&()]+$/, "Organization contains invalid characters"),
    startDate: z
      .string()
      .min(1, "Start date is required")
      .regex(/^\d{4}-\d{2}$/, "Invalid date format"),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}$/, "Invalid date format")
      .optional()
      .or(z.literal("")),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(2000, "Description must be less than 2000 characters"),
    current: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless this is your current position",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (!data.endDate) return true;
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

const validateDates = (data) => {
  if (data.current) return true;
  if (!data.startDate || !data.endDate) return true;
  
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return endDate >= startDate;
};

export const experienceEntrySchema = z
  .object({
    title: z.string().min(2, "Job title must be at least 2 characters"),
    organization: z.string()
      .min(2, "Company name must be at least 2 characters")
      .regex(/^[a-zA-Z0-9\s\-&.,()]+$/, "Company name contains invalid characters"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(50, "Description must be at least 50 characters to properly detail your work experience"),
    current: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless this is your current position",
      path: ["endDate"],
    }
  )
  .refine(
    validateDates,
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export const educationEntrySchema = z
  .object({
    title: z.string().min(2, "Degree/Certification must be at least 2 characters"),
    organization: z.string()
      .min(2, "Institution name must be at least 2 characters")
      .regex(/^[a-zA-Z0-9\s\-&.,()]+$/, "Institution name contains invalid characters"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    current: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless you are currently studying",
      path: ["endDate"],
    }
  )
  .refine(
    validateDates,
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export const projectEntrySchema = z
  .object({
    title: z.string().min(2, "Project name must be at least 2 characters"),
    organization: z.string()
      .min(2, "Technologies/Tools must be at least 2 characters")
      .regex(/^[a-zA-Z0-9\s\-&.,()#+]+$/, "Technologies/Tools contains invalid characters"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(30, "Description must be at least 30 characters to properly explain your project"),
    current: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless this is an ongoing project",
      path: ["endDate"],
    }
  )
  .refine(
    validateDates,
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export const resumeSchema = z.object({
  contactInfo: contactSchema,
  summary: z
    .string()
    .min(50, "Professional summary must be at least 50 characters")
    .max(2000, "Professional summary must be less than 2000 characters"),
  skills: z
    .string()
    .min(5, "Skills section must be at least 5 characters")
    .max(1000, "Skills section must be less than 1000 characters")
    .refine(
      (val) => val.split(",").filter(Boolean).length >= 3,
      "Please enter at least 3 skills"
    ),
  experience: z
    .array(experienceEntrySchema)
    .min(1, "Please add at least one work experience entry")
    .max(10, "Maximum 10 work experiences allowed"),
  education: z
    .array(educationEntrySchema)
    .min(1, "Please add at least one education entry")
    .max(5, "Maximum 5 education entries allowed"),
  projects: z
    .array(projectEntrySchema)
    .max(8, "Maximum 8 projects allowed"),
});

export const onboardingSchema = z.object({
  industry: z
    .string({
      required_error: "Please select an industry",
    })
    .min(1, "Please select an industry"),
  subIndustry: z
    .string({
      required_error: "Please select a specialization",
    })
    .min(1, "Please select a specialization"),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  experience: z
    .string()
    .transform((val) => {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? undefined : Number(parsed.toFixed(1));
    })
    .pipe(
      z
        .number()
        .min(0, "Experience must be at least 0 years")
        .max(50, "Experience cannot exceed 50 years")
    ),
  skills: z
    .string()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : undefined
    )
    .refine(
      (val) => !val || val.length >= 3,
      "Please enter at least 3 skills"
    ),
});

export const coverLetterSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});