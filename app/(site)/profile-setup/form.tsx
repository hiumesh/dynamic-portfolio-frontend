"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { workDomainOptions } from "@/lib/select-options";
import { useAppContext } from "@/providers/app-context";
import { profileSetup } from "@/services/api/users";
import { CheckIcon } from "@/lib/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem, Chip, Input } from "@nextui-org/react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { showErrorToast } from "@/lib/client-utils";

const alphaRegex = /^[a-zA-Z\s]+$/; // Allows only letters and spaces
const alphaNumericRegex = /^[a-zA-Z0-9\s\-,.]+$/; // Allows letters, numbers, spaces, hyphens, commas, and periods
const currentYear = new Date().getFullYear();

const formSchema = z
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

export default function ProfileSetupForm() {
  const [loading, setLoading] = useState(false);
  const { refreshProfile } = useAppContext();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      full_name: "",
      college: "",
      graduation_year: "",
      work_domains: [],
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await profileSetup(data);
      if (response.error) {
        throw new Error(response.error.message);
      }
      await refreshProfile();
      // setLoading(false);
    } catch (error: any) {
      setLoading(false);
      showErrorToast(error);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5 flex-1">
                  <FormLabel className="font-normal">Your Full Name?</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Name..."
                      aria-label="Full Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="work_domains"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel className="font-normal">
                      Which domain are you interested in working? (add upto 3)
                    </FormLabel>
                    <div className="flex gap-2 flex-wrap empty:hidden py-2">
                      {field.value?.map((wd) => (
                        <Chip
                          key={wd}
                          onClose={() => {
                            const domainSet = new Set(field?.value);
                            domainSet.delete(wd);
                            field.onChange(Array.from(domainSet));
                          }}
                          variant="bordered"
                        >
                          {wd}
                        </Chip>
                      ))}
                    </div>
                    <Autocomplete
                      placeholder="Type Domain..."
                      aria-label="Work Domain"
                      selectedKey={null}
                      onSelectionChange={(key) => {
                        if (key === null) return;
                        key = key + "";
                        const domainSet = new Set(
                          field?.value ? [...field?.value] : []
                        );
                        if (domainSet.has(key)) {
                          domainSet.delete(key);
                          field.onChange(Array.from(domainSet));
                          return;
                        }
                        if (domainSet.size >= 3) return;
                        domainSet.add(key);
                        field.onChange(Array.from(domainSet));
                      }}
                    >
                      {workDomainOptions.map((wd) => (
                        <AutocompleteItem
                          key={wd.value}
                          value={wd.value}
                          endContent={
                            field?.value?.includes(wd.value) ? (
                              <CheckIcon className="text-2xl text-black" />
                            ) : undefined
                          }
                        >
                          {wd.label}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="flex gap-4 items-start">
            <FormField
              control={form.control}
              name="college"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5 flex-1">
                  <FormLabel className="font-normal">
                    Collage / University name?
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Collage..."
                      aria-label="Collage"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="graduation_year"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5 flex-1">
                  <FormLabel className="font-normal">
                    Year of graduation ?
                  </FormLabel>
                  <Autocomplete
                    placeholder="Select Year..."
                    aria-label="Graduation Year"
                    selectedKey={field.value}
                    onSelectionChange={(key) => {
                      if (key === null) field.onChange(undefined);
                      else field.onChange(key);
                    }}
                  >
                    {Array.from(
                      {
                        length:
                          new Date().getFullYear() +
                          5 -
                          (new Date().getFullYear() - 30) +
                          1,
                      },
                      (_, i) => new Date().getFullYear() - 30 + i + ""
                    ).map((year) => (
                      <AutocompleteItem key={year} value={year}>
                        {year}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
