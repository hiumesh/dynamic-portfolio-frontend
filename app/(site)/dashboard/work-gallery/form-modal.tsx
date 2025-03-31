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
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
} from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { showErrorToast } from "@/lib/client-utils";
import { create, getDetail, update } from "@/services/api/work-gallery";
import { FileUploader } from "@/components/upload/file-uploader";
import { useAsyncList } from "@react-stately/data";
import { getSkills } from "@/services/skills-api";
import _ from "lodash";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { techProjectLinkOptions } from "@/lib/select-options";
import { useQuery } from "@tanstack/react-query";

interface PropTypes {
  isOpen: boolean;
  projectId?: string | number;
  onSuccess?: (data: TechProject | undefined) => void;
  hide: () => void;
}

export default function TechProjectFormModal({
  isOpen,
  projectId,
  hide,
  onSuccess,
}: PropTypes) {
  const [loading, setLoading] = useState(false);
  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["work-gallery", projectId],
    queryFn: async () => {
      const response = await getDetail(projectId!);
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });

  const form = useForm<z.infer<typeof techProjectFormSchema>>({
    defaultValues: {
      attachments: [],
      links: [],
    },
    resolver: zodResolver(techProjectFormSchema),
  });

  const linksForm = useFieldArray({
    name: "links",
    control: form.control,
  });

  const onSubmit = async (data: z.infer<typeof techProjectFormSchema>) => {
    try {
      setLoading(true);
      let response;

      const body = {
        ...data,
        attachments: data?.attachments?.filter((item) => item.url),
      };

      if (projectId) response = await update(projectId, body);
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

  useEffect(() => {
    if (projectId && data) {
      form.reset();
      form.setValue("title", data.title);
      form.setValue("description", data.description);
      form.setValue("tech_used", data.tech_used);
      form.setValue("links", data?.links || []);
      linksForm.replace(data?.links || []);
      form.setValue(
        "attachments",
        data?.attachments?.map((item) => ({
          url: item.file_url,
          name: item.file_name,
          type: item.file_type,
          size: item.file_size,
        })) || []
      );
    } else {
      form.reset();
      linksForm.replace([]);
    }
  }, [projectId, data, isOpen]);

  const body = (onClose: () => void) => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-sm">Something went wrong</p>
          <Button color="danger" onPress={() => refetch()}>
            Retry
          </Button>
        </div>
      );
    }
    if (isLoading || isRefetching) {
      return (
        <div className="flex flex-col items-center justify-center space-y-2">
          <Spinner size="sm" />
          <p className="text-sm">Loading...</p>
        </div>
      );
    } else
      return (
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
                    name="tech_used"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-1.5 flex-1">
                        <FormLabel className="font-normal">
                          Tech Used (min 3)
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
                      Add links to your deployment, source code, or any other
                      source which can showcase your project.
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
                              <Input
                                {...field}
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(e.target.value || undefined)
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
                                  field.onChange(e.target.value || undefined)
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
                                  field.onChange(e.target.value || undefined)
                                }
                                placeholder={f.platform}
                                endContent={
                                  <Button
                                    isIconOnly
                                    variant="light"
                                    className="min-w-min w-5 h-5"
                                    onPress={() => {
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
                    {techProjectLinkOptions.map((wd) => (
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

                <FormMessage>{form.formState.errors.root?.message}</FormMessage>
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
      );
  };

  return (
    <Modal
      isOpen={isOpen}
      size="full"
      onOpenChange={(open) => {
        if (open) {
        } else hide();
      }}
    >
      <ModalContent className="overflow-auto">
        {(onClose) => (
          <div>
            <div className="mx-auto max-w-xl">
              <ModalHeader className="w-max"></ModalHeader>
              {body(onClose)}
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
