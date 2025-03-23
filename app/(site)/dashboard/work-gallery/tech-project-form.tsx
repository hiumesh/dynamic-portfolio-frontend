"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { techProjectFormSchema } from "@/lib/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Chip,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { showErrorToast } from "@/lib/client-utils";
import { create, update } from "@/services/api/work-gallery";
import { parseDate } from "@internationalized/date";
import { FileUploader } from "@/components/upload/file-uploader";
import { useAsyncList } from "@react-stately/data";
import { getSkills } from "@/services/skills-api";
import _, { at } from "lodash";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { linksOptions } from "@/lib/select-options";

interface PropTypes {
  isOpen: boolean;
  editData: TechProject | null;
  onSuccess?: (data: TechProject | undefined) => void;
  hide: () => void;
}

export default function TechProjectFormModal({
  isOpen,
  hide,
  onSuccess,
  editData,
}: PropTypes) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof techProjectFormSchema>>({
    defaultValues: {
      attachments: [],
    },
    resolver: zodResolver(techProjectFormSchema),
  });

  const onSubmit = async (data: z.infer<typeof techProjectFormSchema>) => {
    try {
      setLoading(true);
      let response;

      const body = {
        ...data,
        attachments: data?.attachments?.filter((item) => item.url),
      };

      if (editData) response = await update(editData.id, body);
      else response = await create(body);

      setLoading(false);
      if (response.error) {
        form.setError("root", { message: response.error.message });
        showErrorToast(
          response.error,
          "There was a problem with your request."
        );
      } else {
        onSuccess?.(response.data);
        form.reset();
        hide();
      }
    } catch (error: any) {
      setLoading(false);
      showErrorToast(error, "There was a problem with your request.");
    }
  };

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

  const linksForm = useFieldArray({
    name: "links",
    control: form.control,
  });

  const currentlyWorkingHereCheck = form.watch("currently_working");

  useEffect(() => {
    if (editData) {
      form.reset();
      form.setValue("title", editData.title);
      form.setValue("description", editData.description);
      form.setValue("start_date", editData.start_date.slice(0, 10));
      form.setValue(
        "end_date",
        editData.end_date ? editData.end_date.slice(0, 10) : undefined
      );
      form.setValue("currently_working", typeof editData.end_date != "string");
      form.setValue("skills_used", editData.skills_used);
      linksForm.replace(editData.attributes?.links || []);
      form.setValue(
        "attachments",
        editData?.attachments?.map((item) => ({
          url: item.file_url,
          name: item.file_name,
          type: item.file_type,
          size: item.file_size,
        })) || []
      );
    } else {
      form.reset({});
    }
  }, [editData, form]);

  return (
    <Modal
      isOpen={isOpen}
      size="full"
      onOpenChange={(open) => {
        if (open) {
          if (!editData) form;
        } else hide();
      }}
    >
      <ModalContent className="overflow-auto">
        {(onClose) => (
          <div>
            <div className="mx-auto max-w-xl">
              <ModalHeader className="w-max"></ModalHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <ModalBody>
                    <div className="space-y-6">
                      <div className="flex gap-4 items-center flex-row-reverse">
                        <div className="space-y-4 flex-1">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem className="flex flex-col space-y-1.5 flex-1">
                                <FormLabel className="font-normal">
                                  Title?
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value || undefined
                                      )
                                    }
                                    placeholder="Title..."
                                    aria-label="Title"
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
                              <FormLabel className="font-normal">
                                Start Date?
                              </FormLabel>
                              <FormControl>
                                <DatePicker
                                  aria-label="Start Date"
                                  value={
                                    field.value ? parseDate(field.value) : null
                                  }
                                  onChange={(value) =>
                                    field.onChange(value?.toString())
                                  }
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
                                <FormLabel className="font-normal">
                                  End Date?
                                </FormLabel>
                                <FormControl>
                                  <DatePicker
                                    isDisabled={currentlyWorkingHereCheck}
                                    aria-label="End Date"
                                    value={
                                      field.value
                                        ? parseDate(field.value)
                                        : null
                                    }
                                    onChange={(value) =>
                                      field.onChange(value?.toString())
                                    }
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
                                    aria-label="Currently Working?"
                                    isSelected={field.value}
                                    onValueChange={(value) => {
                                      if (value) {
                                        form.setValue("end_date", undefined);
                                      }
                                      field.onChange(value);
                                    }}
                                  >
                                    Currently Working?
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
                              <FormLabel className="font-normal">
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  value={field.value || ""}
                                  minRows={4}
                                  onChange={(e) =>
                                    field.onChange(e.target.value || undefined)
                                  }
                                  placeholder="Description..."
                                  aria-label="Description"
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
                      </div>
                      <div className="space-y-4">
                        <div>
                          <FormLabel className="font-normal">URLs</FormLabel>
                          <FormDescription>
                            Add links to your website, blog, or social media
                            profiles.
                          </FormDescription>
                        </div>
                        {linksForm.fields.map((f, index) => (
                          <div key={f.id} className="flex gap-4">
                            <FormField
                              control={form.control}
                              name={`links.${index}.platform`}
                              render={({ field }) => (
                                <FormItem className="hidden">
                                  <FormLabel
                                    className={cn(index !== 0 && "sr-only")}
                                  >
                                    Platform
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      value={field.value || ""}
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value || undefined
                                        )
                                      }
                                      placeholder="Platform"
                                      readOnly
                                    />
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
                                    <Input
                                      {...field}
                                      value={field.value || ""}
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value || undefined
                                        )
                                      }
                                      placeholder="Label"
                                    />
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
                                      value={field.value || ""}
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value || undefined
                                        )
                                      }
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
                            <AutocompleteItem key={wd.value}>
                              {wd.label}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="attachments"
                          render={({ field }) => (
                            <div className="space-y-6">
                              <FormItem className="w-full">
                                <FormLabel className="font-normal">
                                  Attachments
                                </FormLabel>
                                <FormControl>
                                  <FileUploader
                                    variant="tile"
                                    multiple={true}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    accept={{
                                      "image/jpeg": [],
                                      "image/png": [],
                                      "image/webp": [],
                                      "image/svg+xml": [],
                                      "video/mp4": [],
                                      "video/webm": [],
                                    }}
                                    maxFileCount={5}
                                    maxSize={20 * 1024 * 1024}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Upload images and short videos showcasing your
                                  project up to 20MB each and 5 in total
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            </div>
                          )}
                        />
                      </div>

                      <FormMessage>
                        {form.formState.errors.root?.message}
                      </FormMessage>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="bordered" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" type="submit" isLoading={loading}>
                      Save Details
                    </Button>
                  </ModalFooter>
                </form>
              </Form>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
