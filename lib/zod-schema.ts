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
