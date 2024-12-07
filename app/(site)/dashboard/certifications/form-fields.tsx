import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { certificateFormSchema } from "@/lib/zod-schema";
import { getSkills } from "@/services/skills-api";
import { parseDate } from "@internationalized/date";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  DatePicker,
  Input,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import _ from "lodash";
import { X } from "lucide-react";
import { useCallback } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface PropTypes {
  form: UseFormReturn<z.infer<typeof certificateFormSchema>>;
}

export default function CertificateFormFields({ form }: PropTypes) {
  const descriptionFormField = useFieldArray({
    control: form.control,
    name: "description",
  });

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

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-start">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5 flex-1">
              <FormLabel className="font-normal">Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                  placeholder="Enter the name of certification..."
                  aria-label="Certification Title"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-2">
        {descriptionFormField.fields.map((f, index) => (
          <div key={f.id}>
            <FormField
              control={form.control}
              name={`description.${index}.item`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Description (Answer below questions to describe your work
                    properly)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(e.target.value || undefined)
                      }
                      placeholder="Description..."
                      endContent={
                        index < 3 ? undefined : (
                          <Button
                            isIconOnly
                            variant="light"
                            className="min-w-min w-5 h-5"
                            onClick={() => {
                              descriptionFormField.remove(index);
                            }}
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </Button>
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
        <FormMessage>
          {form?.formState?.errors?.description?.root?.message}
        </FormMessage>
        <Button
          type="button"
          variant="bordered"
          onClick={() => descriptionFormField.append({ item: undefined })}
        >
          Add Items
        </Button>
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
                  <AutocompleteItem key={skill.value} value={skill.value}>
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
          name="completion_date"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5 flex-1">
              <FormLabel className="font-normal">
                When you completed this certification/course?
              </FormLabel>
              <FormControl>
                <DatePicker
                  aria-label="Completion Date"
                  value={field.value ? parseDate(field.value) : null}
                  onChange={(value) => field.onChange(value.toString())}
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