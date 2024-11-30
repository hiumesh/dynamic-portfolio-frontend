import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { degreeOptions } from "@/lib/select-options";
import { educationFormSchema } from "@/lib/zod-schema";
import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Switch,
} from "@nextui-org/react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface PropTypes {
  form: UseFormReturn<z.infer<typeof educationFormSchema>>;
}

export default function EducationFormFields({ form }: PropTypes) {
  const type = form.watch("type");

  return (
    <div className="space-y-6">
      <div>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5 flex-1">
              <FormControl>
                <div className="flex gap-3 justify-center">
                  <span className="inline-block mr-2">Collage</span>
                  <Switch
                    aria-label="Type"
                    checked={field.value === "SCHOOL"}
                    onChange={(e) =>
                      field.onChange(e.target.checked ? "SCHOOL" : "COLLEGE")
                    }
                  />
                  <span>School</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {type === "SCHOOL" && (
        <div className="space-y-6">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="institute_name"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5 flex-1">
                  <FormLabel className="font-normal">School Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Enter School Name"
                      aria-label="School Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5 flex-1">
                  <FormLabel className="font-normal">Class</FormLabel>
                  <Autocomplete
                    placeholder="Choose Class"
                    aria-label="Class"
                    selectedKey={field.value || ""}
                    onSelectionChange={(key) => {
                      if (key === null) field.onChange(undefined);
                      else field.onChange(key);
                    }}
                  >
                    <AutocompleteItem key={"X"} value={"X"}>
                      Class X
                    </AutocompleteItem>
                    <AutocompleteItem key={"XII"} value={"XII"}>
                      Class XII
                    </AutocompleteItem>
                  </Autocomplete>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="passing_year"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5 flex-1">
                  <FormLabel className="font-normal">
                    Select Passing Year
                  </FormLabel>
                  <Autocomplete
                    placeholder="Choose End Year"
                    aria-label="Passing Year"
                    selectedKey={field.value || ""}
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
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5 flex-1">
                  <FormLabel className="font-normal">
                    Final GPA (out of 10)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      type="number"
                      placeholder="Enter Grade"
                      aria-label="Grade"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
      {type === "COLLEGE" && (
        <div className="space-y-6">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="institute_name"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5 flex-1">
                  <FormLabel className="font-normal">University Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Type Collage Name"
                      aria-label="University Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="field_of_study"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5 flex-1">
                  <FormLabel className="font-normal">Field of Study</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Type Field of Study"
                      aria-label="Field of Study"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5 flex-1">
                  <FormLabel className="font-normal">Degree</FormLabel>
                  <Autocomplete
                    placeholder="Choose your Degree"
                    aria-label="Degree"
                    selectedKey={field.value || ""}
                    onSelectionChange={(key) => {
                      if (key === null) field.onChange(undefined);
                      else field.onChange(key);
                    }}
                  >
                    {degreeOptions.map((degree) => (
                      <AutocompleteItem key={degree.value} value={degree.value}>
                        {degree.label}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5 flex-1">
                  <FormLabel className="font-normal">
                    Grade (out of 10)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Enter Grade(cgpa)"
                      aria-label="Grade"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="start_year"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5 flex-1">
                  <FormLabel className="font-normal">Start Year</FormLabel>
                  <Autocomplete
                    placeholder="Choose Starting Year"
                    aria-label="Start Year"
                    selectedKey={field.value || ""}
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
            <FormField
              control={form.control}
              name="end_year"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5 flex-1">
                  <FormLabel className="font-normal">End Year</FormLabel>
                  <Autocomplete
                    placeholder="Choose Ending Year"
                    aria-label="End Year"
                    selectedKey={field.value || ""}
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
        </div>
      )}
    </div>
  );
}
