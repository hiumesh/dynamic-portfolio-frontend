import { z } from "zod";

const alphaRegex = /^[a-zA-Z\s]+$/;
const alphaNumericRegex = /^[a-zA-Z0-9\s\-,.]+$/;
const currentYear = new Date().getFullYear();

export const educationFormSchema = z
  .object({
    type: z.enum(["SCHOOL", "COLLEGE"], {
      message: "Education type must be either 'school' or 'college'",
    }),
    institute_name: z
      .string()
      .trim()
      .min(6, { message: "Institute name must be at least 6 characters long" })
      .max(50, { message: "Institute name must be at most 50 characters long" })
      .regex(alphaRegex, {
        message:
          "Institute name must only contain alphabetic characters and spaces",
      }),
    grade: z
      .string()
      .trim()
      .min(1, { message: "Grade is required" })
      .max(10, { message: "Grade must be valid" }),

    field_of_study: z
      .string()
      .trim()
      .min(8, { message: "Field of Study must be at least 8 characters long" })
      .max(100, {
        message: "Field of Study name must be at most 100 characters long",
      })
      .regex(alphaNumericRegex, {
        message:
          "Field of Study name must only contain letters, numbers, spaces, and basic punctuation (e.g., hyphens, commas, periods)",
      }),
    degree: z
      .string()
      .trim()
      .min(2, { message: "Degree must be at least 2 characters long" })
      .max(100, { message: "Degree must be at most 100 characters long" })
      .regex(alphaNumericRegex, {
        message:
          "Field of Study name must only contain letters, numbers, spaces, and basic punctuation (e.g., hyphens, commas, periods)",
      }),
    start_year: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) =>
          !value ||
          (!isNaN(Number(value)) &&
            Number(value) >= 1900 &&
            Number(value) <= currentYear),
        {
          message: `Start year must be a valid year between 1900 and ${currentYear}`,
        }
      ),
    end_year: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) =>
          !value ||
          (!isNaN(Number(value)) &&
            Number(value) >= 1900 &&
            Number(value) <= currentYear + 6),
        {
          message: `End year must be a valid year between 1900 and ${
            currentYear + 6
          }`,
        }
      ),
    class: z
      .enum(["X", "XII", ""], { message: "Class must be either 'X' or 'XII'" })
      .optional(),
    passing_year: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) =>
          !value ||
          (!isNaN(Number(value)) &&
            Number(value) >= 1900 &&
            Number(value) <= currentYear + 6),
        {
          message: `Passing year must be a valid year between 1900 and ${
            currentYear + 6
          }`,
        }
      ),
  })
  .superRefine((data, ctx) => {
    if (data.type === "COLLEGE") {
      if (!data.field_of_study) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["field_of_study"],
          message: "Field of Study is required for college",
        });
      }
      if (!data.degree) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,

          path: ["degree"],
          message: "Degree is required for college",
        });
      }
      if (!data.start_year) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,

          path: ["start_year"],
          message: "Start year is required for college",
        });
      }
      if (!data.end_year) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,

          path: ["end_year"],
          message: "End year is required for college",
        });
      }
    } else if (data.type === "SCHOOL") {
      if (!data.class) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,

          path: ["class"],
          message: "Class is required for school",
        });
      }
      if (!data.passing_year) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,

          path: ["passing_year"],
          message: "Passing year is required for school",
        });
      }
    }
  });

export const profileSetupFormSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(6, { message: "Full name must be at least 6 characters long" })
      .max(50, { message: "Full name must be at most 50 characters long" })
      .regex(alphaRegex, {
        message: "Full name must only contain alphabetic characters and spaces",
      }),
    college: z
      .string()
      .trim()
      .min(8, { message: "College name must be at least 8 characters long" })
      .max(100, { message: "College name must be at most 100 characters long" })
      .regex(alphaNumericRegex, {
        message:
          "College name must only contain letters, numbers, spaces, and basic punctuation (e.g., hyphens, commas, periods)",
      }),
    graduation_year: z
      .string()
      .trim()
      .refine(
        (value) =>
          !isNaN(Number(value)) &&
          Number(value) >= 1900 &&
          Number(value) <= currentYear + 6,
        {
          message: `Graduation year must be an integer between 1900 and ${
            currentYear + 6
          }`,
        }
      ),
    work_domains: z
      .array(
        z.string().trim().regex(alphaNumericRegex, {
          message:
            "Work domain must only contain letters, numbers, spaces, and basic punctuation",
        })
      )
      .min(1, { message: "At least one work domain is required" })
      .max(3, { message: "You can specify up to 3 work domains" }),
  })
  .strict();

export const profileFormSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(6, { message: "Full name must be at least 6 characters long" })
      .max(50, { message: "Full name must be at most 50 characters long" })
      .regex(alphaRegex, {
        message: "Full name must only contain alphabetic characters and spaces",
      }),
    college: z
      .string()
      .trim()
      .min(8, { message: "College name must be at least 8 characters long" })
      .max(100, { message: "College name must be at most 100 characters long" })
      .regex(alphaNumericRegex, {
        message:
          "College name must only contain letters, numbers, spaces, and basic punctuation (e.g., hyphens, commas, periods)",
      }),
    graduation_year: z
      .string()
      .trim()
      .refine(
        (value) =>
          !isNaN(Number(value)) &&
          Number(value) >= 1900 &&
          Number(value) <= currentYear + 6,
        {
          message: `Graduation year must be an integer between 1900 and ${
            currentYear + 6
          }`,
        }
      ),
    about: z.string().trim().min(10, { message: "About is required" }),
    tagline: z.string().trim().min(10, { message: "Tagline is required" }),
    work_domains: z
      .array(
        z.string().trim().regex(alphaNumericRegex, {
          message:
            "Work domain must only contain letters, numbers, spaces, and basic punctuation",
        })
      )
      .min(1, { message: "At least one work domain is required" })
      .max(3, { message: "You can specify up to 3 work domains" }),

    profile_picture: z
      .object({
        file_name: z.string(),
        key: z.string(),
        url: z.string().trim().url({
          message: "Profile picture must be a valid URL",
        }),
      })
      .optional(),
    social_profiles: z
      .array(
        z.object({
          platform: z.string().optional(),
          url: z
            .string()
            .trim()
            .optional()
            .refine(
              (value) => !value || z.string().url().safeParse(value).success,
              {
                message: "URL must be a valid URL",
              }
            ),
        })
      )
      .optional()
      .refine(
        (profiles) => {
          if (!profiles) return true;
          const platforms = profiles
            .filter((profile) => profile?.platform && profile?.url)
            .map((profile) => profile?.platform?.toLowerCase());
          return new Set(platforms).size === platforms.length;
        },
        {
          message: "Platform names must be unique",
        }
      ),
    location: z
      .object({
        country: z.string().trim().min(2, { message: "Country is required" }),
        state: z.string().trim().min(2, { message: "State is required" }),
      })
      .optional(),
  })
  .strict();

export const workExperienceFormSchema = z
  .object({
    company_name: z
      .string()
      .trim()
      .min(6, { message: "Company name must be at least 6 characters long" })
      .max(50, { message: "Company name must be at most 50 characters long" })
      .regex(alphaNumericRegex, {
        message:
          "Company name must only contain letters, numbers, spaces, and basic punctuation (e.g., hyphens, commas, periods)",
      }),
    company_url: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || z.string().url().safeParse(value).success,
        {
          message: "Company URL must be a valid URL",
        }
      )
      .transform((url) => (url === "" ? undefined : url))
      .optional(),
    job_type: z.enum(["FULL_TIME", "PART_TIME", "SEMI_FULL_TIME", "INTERN"], {
      message:
        "Work type must be either 'Full Time', 'Part Time' or 'Semi-full Time'",
    }),
    job_title: z
      .string()
      .trim()
      .min(6, { message: "Job title must be at least 6 characters long" })
      .max(50, { message: "Job title must be at most 50 characters long" })
      .regex(alphaNumericRegex, {
        message:
          "Job title must only contain letters, numbers, spaces, and basic punctuation (e.g., hyphens, commas, periods)",
      }),
    location: z.string().trim().min(5, { message: "Location is required" }),
    start_date: z
      .string()
      .trim()
      .refine((value) => !isNaN(Date.parse(value)), {
        message: "Start date must be a valid ISO date",
      })
      .refine(
        (value) => {
          const date = new Date(value);
          const currentYear = new Date().getFullYear();
          return (
            date.getFullYear() >= 1900 && date.getFullYear() <= currentYear + 6
          );
        },
        {
          message: `Start date must be between the year 1900 and ${
            new Date().getFullYear() + 6
          }`,
        }
      ),
    end_date: z
      .string()
      .trim()
      .refine(
        (value) => !value || !isNaN(Date.parse(value)), // Allow empty value (optional field)
        {
          message: "End date must be a valid ISO date",
        }
      )
      .refine(
        (value) => {
          if (!value) return true; // Skip further checks if the value is empty
          const date = new Date(value);
          const currentYear = new Date().getFullYear();
          return (
            date.getFullYear() >= 1900 && date.getFullYear() <= currentYear + 6
          );
        },
        {
          message: `End date must be between the year 1900 and ${
            new Date().getFullYear() + 6
          }`,
        }
      )
      .optional(),
    currently_working: z.boolean().optional(),
    description: z
      .string()
      .trim()
      .min(10, { message: "Description is required" }),
    skills_used: z
      .array(z.string().trim().min(1, { message: "Skill is required" }))
      .min(3, { message: "At least three skills is required" }),
    certificate_link: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || z.string().url().safeParse(value).success,
        {
          message: "Certificate link must be a valid URL",
        }
      )
      .transform((url) => (url === "" ? undefined : url))
      .optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (!data.end_date && !data.currently_working) {
      ctx.addIssue({
        path: ["end_date"],
        code: z.ZodIssueCode.custom,
        message: "End date is required",
      });
    }
  });

export const certificateFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(6, { message: "Title must be at least 6 characters long" })
      .max(50, { message: "Title must be at most 50 characters long" })
      .regex(alphaNumericRegex, {
        message:
          "Title must only contain letters, numbers, spaces, and basic punctuation (e.g., hyphens, commas, periods)",
      }),

    description: z
      .string()
      .trim()
      .min(10, { message: "Description is required" }),

    completion_date: z
      .string()
      .trim()
      .refine((value) => !isNaN(Date.parse(value)), {
        message: "Start date must be a valid ISO date",
      })
      .refine(
        (value) => {
          const date = new Date(value);
          const currentYear = new Date().getFullYear();
          return (
            date.getFullYear() >= 1900 && date.getFullYear() <= currentYear + 6
          );
        },
        {
          message: `Start date must be between the year 1900 and ${
            new Date().getFullYear() + 6
          }`,
        }
      ),
    skills_used: z
      .array(z.string().trim().min(1, { message: "Skill is required" }))
      .min(3, { message: "At least three skills is required" }),
    certificate_link: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || z.string().url().safeParse(value).success,
        {
          message: "Certificate link must be a valid URL",
        }
      )
      .transform((url) => (url === "" ? undefined : url))
      .optional(),
  })
  .strict();

export const skillsFormSchema = z
  .object({
    skills: z
      .array(z.string().trim().min(1, { message: "Skill is required" }))
      .min(3, { message: "At least three skills is required" }),
  })
  .strict();

export const hackathonFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(6, { message: "Company name must be at least 6 characters long" })
      .max(50, { message: "Company name must be at most 50 characters long" })
      .regex(alphaNumericRegex, {
        message:
          "Company name must only contain letters, numbers, spaces, and basic punctuation (e.g., hyphens, commas, periods)",
      }),
    avatar: z
      .object({
        file_name: z.string(),
        key: z.string(),
        url: z.string().trim().url({
          message: "Avatar must be a valid URL",
        }),
      })
      .optional(),
    location: z.string().trim().min(5, { message: "Location is required" }),
    start_date: z
      .string()
      .trim()
      .refine((value) => !isNaN(Date.parse(value)), {
        message: "Start date must be a valid ISO date",
      })
      .refine(
        (value) => {
          const date = new Date(value);
          const currentYear = new Date().getFullYear();
          return (
            date.getFullYear() >= 1900 && date.getFullYear() <= currentYear + 6
          );
        },
        {
          message: `Start date must be between the year 1900 and ${
            new Date().getFullYear() + 6
          }`,
        }
      ),
    end_date: z
      .string()
      .trim()
      .refine((value) => !isNaN(Date.parse(value)), {
        message: "End date must be a valid ISO date",
      })
      .refine(
        (value) => {
          const date = new Date(value);
          const currentYear = new Date().getFullYear();
          return (
            date.getFullYear() >= 1900 && date.getFullYear() <= currentYear + 6
          );
        },
        {
          message: `End date must be between the year 1900 and ${
            new Date().getFullYear() + 6
          }`,
        }
      ),
    description: z
      .string()
      .trim()
      .min(10, { message: "Description is required" }),
    certificate_link: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || z.string().url().safeParse(value).success,
        {
          message: "Certificate link must be a valid URL",
        }
      )
      .transform((url) => (url === "" ? undefined : url))
      .optional(),
    links: z
      .array(
        z.object({
          platform: z.string().optional(),
          label: z
            .string()
            .optional()
            .refine(
              (value) =>
                !value ||
                z
                  .string()
                  .min(1, { message: "Label is required" })
                  .safeParse(value).success,
              {
                message: "Label is required",
              }
            ),
          url: z
            .string()
            .trim()
            .optional()
            .refine(
              (value) => !value || z.string().url().safeParse(value).success,
              {
                message: "URL must be a valid URL",
              }
            ),
        })
      )
      .optional(),
  })
  .strict();

export const hackathonMetadataFormSchema = z
  .object({
    heading: z
      .string()
      .trim()
      .min(3, { message: "Heading is required" })
      .max(100)
      .optional(),
    description: z
      .string()
      .trim()
      .min(3, { message: "Description is required" })
      .max(1000)
      .optional(),
  })
  .strict();

export const techProjectFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(6, { message: "Project name must be at least 6 characters long" })
      .max(50, { message: "Project name must be at most 50 characters long" })
      .regex(alphaNumericRegex, {
        message:
          "Project name must only contain letters, numbers, spaces, and basic punctuation (e.g., hyphens, commas, periods)",
      }),
    start_date: z
      .string()
      .trim()
      .refine((value) => !isNaN(Date.parse(value)), {
        message: "Start date must be a valid ISO date",
      })
      .refine(
        (value) => {
          const date = new Date(value);
          const currentYear = new Date().getFullYear();
          return (
            date.getFullYear() >= 1900 && date.getFullYear() <= currentYear + 6
          );
        },
        {
          message: `Start date must be between the year 1900 and ${
            new Date().getFullYear() + 6
          }`,
        }
      ),
    end_date: z
      .string()
      .trim()
      .refine(
        (value) => !value || !isNaN(Date.parse(value)), // Allow empty value (optional field)
        {
          message: "End date must be a valid ISO date",
        }
      )
      .refine(
        (value) => {
          if (!value) return true; // Skip further checks if the value is empty
          const date = new Date(value);
          const currentYear = new Date().getFullYear();
          return (
            date.getFullYear() >= 1900 && date.getFullYear() <= currentYear + 6
          );
        },
        {
          message: `End date must be between the year 1900 and ${
            new Date().getFullYear() + 6
          }`,
        }
      )
      .optional(),
    currently_working: z.boolean().optional(),
    description: z
      .string()
      .trim()
      .min(10, { message: "Description is required" }),
    skills_used: z
      .array(z.string().trim().min(1, { message: "Skill is required" }))
      .min(3, { message: "At least three skills is required" }),
    links: z
      .array(
        z.object({
          platform: z.string().optional(),
          label: z
            .string()
            .optional()
            .refine(
              (value) =>
                !value ||
                z
                  .string()
                  .min(1, { message: "Label is required" })
                  .safeParse(value).success,
              {
                message: "Label is required",
              }
            ),
          url: z
            .string()
            .trim()
            .optional()
            .refine(
              (value) => !value || z.string().url().safeParse(value).success,
              {
                message: "URL must be a valid URL",
              }
            ),
        })
      )
      .optional(),
    attachments: z
      .array(
        z.object({
          name: z.string(),
          type: z.string(),
          size: z.number(),
          url: z
            .string()
            .trim()
            .url({
              message: "Avatar must be a valid URL",
            })
            .optional(),
        })
      )
      .optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (!data.end_date && !data.currently_working) {
      ctx.addIssue({
        path: ["end_date"],
        code: z.ZodIssueCode.custom,
        message: "End date is required",
      });
    }
  });

export const workGalleryMetadataFormSchema = z
  .object({
    heading: z
      .string()
      .trim()
      .min(3, { message: "Heading is required" })
      .max(100)
      .optional(),
    description: z
      .string()
      .trim()
      .min(3, { message: "Description is required" })
      .max(1000)
      .optional(),
  })
  .strict();

export const workExperienceMetadataFormSchema = z
  .object({
    heading: z
      .string()
      .trim()
      .min(3, { message: "Heading is required" })
      .max(100)
      .optional(),
    description: z
      .string()
      .trim()
      .min(3, { message: "Description is required" })
      .max(1000)
      .optional(),
  })
  .strict();

export const educationMetadataFormSchema = z
  .object({
    heading: z
      .string()
      .trim()
      .min(3, { message: "Heading is required" })
      .max(100)
      .optional(),
    description: z
      .string()
      .trim()
      .min(3, { message: "Description is required" })
      .max(1000)
      .optional(),
  })
  .strict();

export const certificationMetadataFormSchema = z
  .object({
    heading: z
      .string()
      .trim()
      .min(3, { message: "Heading is required" })
      .max(100)
      .optional(),
    description: z
      .string()
      .trim()
      .min(3, { message: "Description is required" })
      .max(1000)
      .optional(),
  })
  .strict();

export const blogFormSchema = z
  .object({
    cover_image: z
      .string()
      .trim()
      .transform((value) => (value === "" ? undefined : value))
      .refine((value) => !value || z.string().url().safeParse(value).success, {
        message: "Must be a valid URL",
      })
      .optional(),

    tags: z.array(z.string().trim().min(1, { message: "Tag is required" })),
    title: z.string().trim().min(3, { message: "Title is required" }).max(100),
    body: z
      .string()
      .trim()
      .max(10000)
      .transform((value) => (value === "" ? undefined : value))
      .optional()
      .refine(
        (value) =>
          value === undefined || (value.length >= 3 && value.length <= 10000),
        {
          message: "Body must be between 3 and 10000 characters long",
        }
      ),
    attachments: z
      .array(
        z.object({
          name: z.string(),
          type: z.string(),
          size: z.number(),
          url: z
            .string()
            .trim()
            .url({
              message: "Avatar must be a valid URL",
            })
            .optional(),
        })
      )
      .optional(),
  })
  .strict();
