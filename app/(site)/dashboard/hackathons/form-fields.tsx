import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploader, SingleImageInput } from "@/components/upload/uploader";
import { linksOptions } from "@/lib/select-options";
import { cn } from "@/lib/utils";
import { hackathonFormSchema } from "@/lib/zod-schema";
import { parseDate } from "@internationalized/date";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Input,
  Textarea,
} from "@heroui/react";
import _ from "lodash";
import { X } from "lucide-react";
import { DropzoneOptions } from "react-dropzone";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface PropTypes {
  form: UseFormReturn<z.infer<typeof hackathonFormSchema>>;
}

export default function HackathonFormFields({ form }: PropTypes) {
  const dropZoneConfig: DropzoneOptions = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  };

  const linksForm = useFieldArray({
    name: "links",
    control: form.control,
  });

  return (
    <div className="space-y-6">
      <div>
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FileUploader
                  value={field.value ? [field.value] : []}
                  onValueChange={(value) =>
                    field.onChange(
                      value?.length && value?.length > 0 ? value[0] : null
                    )
                  }
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                >
                  <SingleImageInput
                    id="fileInput"
                    className="mx-auto"
                    files={field.value ? [field.value] : []}
                  />
                </FileUploader>
              </FormControl>
              <FormDescription>
                <div className="text-center">
                  <p>Upload a nice picture if any.</p>
                </div>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-4 items-center flex-row-reverse">
        <div className="space-y-4 flex-1">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-1.5 flex-1">
                <FormLabel className="font-normal">Title?</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(e.target.value || undefined)
                    }
                    placeholder="Title..."
                    aria-label="Title"
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
                <FormLabel className="font-normal">Location?</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(e.target.value || undefined)
                    }
                    placeholder="Location..."
                    aria-label="Location"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
                    aria-label="End Date"
                    value={field.value ? parseDate(field.value) : null}
                    onChange={(value) => field.onChange(value?.toString())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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

      <div className="space-y-4">
        <div>
          <FormLabel>URLs</FormLabel>
          <FormDescription>
            Add links to your website, blog, or social media profiles.
          </FormDescription>
        </div>
        {linksForm.fields.map((f, index) => (
          <div key={f.id} className="flex gap-4">
            <FormField
              control={form.control}
              name={`links.${index}.platform`}
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Platform
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Platform" readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`links.${index}.label`}
              render={({ field }) => (
                <FormItem className="w-full max-w-[200px]">
                  <FormControl>
                    <Input {...field} placeholder="Label" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`links.${index}.url`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={f.platform}
                      endContent={
                        <Button
                          isIconOnly
                          variant="light"
                          className="min-w-min w-5 h-5"
                          onClick={() => {
                            linksForm.remove(index);
                          }}
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </Button>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
        <Autocomplete
          placeholder="Add Links..."
          aria-label="Platform"
          selectedKey={null}
          className="max-w-[200px]"
          onSelectionChange={(key) => {
            if (key === null) return;
            key = key + "";
            linksForm.append({
              platform: key,
              url: undefined,
            });
          }}
        >
          {linksOptions.map((wd) => (
            <AutocompleteItem key={wd.value}>{wd.label}</AutocompleteItem>
          ))}
        </Autocomplete>
      </div>
      <FormMessage>{form.formState.errors.root?.message}</FormMessage>
    </div>
  );
}
