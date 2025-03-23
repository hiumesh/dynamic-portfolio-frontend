import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { jobTypeOptions } from "@/lib/select-options";
import { workExperienceFormSchema } from "@/lib/zod-schema";
import { getSkills } from "@/services/skills-api";
import { parseDate } from "@internationalized/date";
import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  Chip,
  DatePicker,
  Input,
  Textarea,
} from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import _ from "lodash";
import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface PropTypes {
  form: UseFormReturn<z.infer<typeof workExperienceFormSchema>>;
}

export default function EducationFormFields({ form }: PropTypes) {
  const skillsList = useAsyncList<string>({
    async load({ signal, filterText }) {
      const items = await getSkills({ q: filterText });
      return {
        items,
      };
    },
  });

  const handleSkillsInputChange = useCallback(
    _.debounce((q) => {
      skillsList.setFilterText(q);
    }, 300),
    []
  );

  const currentlyWorkingHereCheck = form.watch("currently_working");

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-start">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5 flex-1">
              <FormLabel className="font-normal">Company Name?</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                  placeholder="Company Name..."
                  aria-label="Company Name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="job_type"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5 flex-1">
              <FormLabel className="font-normal">Job Type ?</FormLabel>
              <Autocomplete
                placeholder="Job Type..."
                aria-label="Job Type"
                selectedKey={field.value || ""}
                onSelectionChange={(key) => {
                  if (key === null) field.onChange(undefined);
                  else field.onChange(key);
                }}
              >
                {jobTypeOptions.map((t) => (
                  <AutocompleteItem key={t.value}>{t.label}</AutocompleteItem>
                ))}
              </Autocomplete>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <FormField
          control={form.control}
          name="company_url"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5 flex-1">
              <FormLabel className="font-normal">
                Company Website / LinkedIn
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                  placeholder="Company Url..."
                  aria-label="Company URL"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-4 items-start">
        <FormField
          control={form.control}
          name="job_title"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5 flex-1">
              <FormLabel className="font-normal">Job Title?</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                  placeholder="Job Title..."
                  aria-label="Job Title"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5 flex-1">
              <FormLabel className="font-normal">Job Location?</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                  placeholder="Job Location..."
                  aria-label="Job Location"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-4 items-start">
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5 flex-1">
              <FormLabel className="font-normal">Start Date?</FormLabel>
              <FormControl>
                <DatePicker
                  aria-label="Start Date"
                  value={field.value ? parseDate(field.value) : null}
                  onChange={(value) => field.onChange(value?.toString())}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col space-y-1.5 flex-1">
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-1.5 flex-1">
                <FormLabel className="font-normal">End Date?</FormLabel>
                <FormControl>
                  <DatePicker
                    isDisabled={currentlyWorkingHereCheck}
                    aria-label="End Date"
                    value={field.value ? parseDate(field.value) : null}
                    onChange={(value) => field.onChange(value?.toString())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currently_working"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={currentlyWorkingHereCheck || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        form.setValue("end_date", undefined);
                      }
                      field.onChange(e.target.checked);
                    }}
                  >
                    Currently Working Here?
                  </Checkbox>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5 flex-1">
              <FormLabel className="font-normal">Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ""}
                  minRows={4}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                  placeholder="Description..."
                  aria-label="Description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-4 items-start">
        <FormField
          control={form.control}
          name="skills_used"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5 flex-1">
              <FormLabel className="font-normal">
                Skills Used (min 3 skills)
              </FormLabel>

              <Autocomplete
                placeholder="Type Skills Used..."
                aria-label="Skills Used"
                selectedKey={null}
                // inputValue={skillsList.filterText}
                isLoading={skillsList.isLoading}
                items={skillsList.items.map((item) => ({
                  value: item,
                  label: item,
                }))}
                disableSelectorIconRotation={true}
                disableAnimation={true}
                scrollShadowProps={{
                  isEnabled: false,
                }}
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

                  domainSet.add(key);
                  field.onChange(Array.from(domainSet));
                }}
                onInputChange={handleSkillsInputChange}
              >
                {(skill) => (
                  <AutocompleteItem key={skill.value}>
                    {skill.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <FormMessage />
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
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="certificate_link"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5 flex-1">
              <FormLabel className="font-normal">
                Certificate Link (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                  placeholder="Certificate/ LOR link..."
                  aria-label="Certificate Link"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormMessage>{form.formState.errors.root?.message}</FormMessage>
    </div>
  );
}
