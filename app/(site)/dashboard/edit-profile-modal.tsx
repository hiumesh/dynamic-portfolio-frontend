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
import { profileFormSchema } from "@/lib/zod-schema";
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
  Textarea,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { updateProfile } from "@/services/api/users";
import { CheckIcon } from "@/lib/icons";
import { socialProfilesOptions, workDomainOptions } from "@/lib/select-options";
import { useAsyncList } from "@react-stately/data";

import { FileUploader, SingleImageInput } from "@/components/upload/uploader";
import { DropzoneOptions } from "react-dropzone";
import { showErrorToast } from "@/lib/client-utils";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface PropTypes {
  isOpen: boolean;
  editData: {
    name?: string;
    tagline?: string;
    about?: string;
    avatar?: string;
    work_domains?: string[];
    college?: string;
    graduation_year?: string;
    social_profiles?: { platform: string; url: string }[];
  };
  onSuccess?: (data?: any) => void;
  hide: () => void;
}

export default function ProfileFormModal({
  isOpen,
  hide,
  onSuccess,
  editData,
}: PropTypes) {
  const [loading, setLoading] = useState(false);

  const dropZoneConfig: DropzoneOptions = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  };

  const form = useForm<z.infer<typeof profileFormSchema>>({
    defaultValues: {
      social_profiles: [
        {
          platform: "LinkedIn",
          url: undefined,
        },
        {
          platform: "Github",
          url: undefined,
        },
      ],
    },
    resolver: zodResolver(profileFormSchema),
  });

  const socialProfilesForm = useFieldArray({
    name: "social_profiles",
    control: form.control,
  });

  const selectedSocialProfiles =
    form.watch("social_profiles")?.map((item) => item.platform) || [];

  let workDomainList = useAsyncList<(typeof workDomainOptions)[0]>({
    async load({ signal, filterText }) {
      let items: typeof workDomainOptions;
      if (filterText)
        items = workDomainOptions.filter((item) =>
          item.label.toLowerCase().startsWith(filterText.toLowerCase())
        );
      else items = workDomainOptions.slice(0, 10);

      return {
        items: items,
      };
    },
  });

  const onSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      setLoading(true);

      const body = {
        ...data,
        social_profiles: data?.social_profiles?.filter(
          (item) => item.url && item.platform
        ),
        profile_picture: data?.profile_picture?.url,
      };

      const { error } = await updateProfile(body);

      if (error) {
        form.setError("root", { message: error.message });
        setLoading(false);
        showErrorToast(error, "There was a problem with your request.");
        return;
      }
      onSuccess?.();
      hide();
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      showErrorToast(error);
    }
  };

  const setupSocialProfiles = (
    socialProfiles: z.infer<typeof profileFormSchema>["social_profiles"]
  ) => {
    const github = socialProfiles?.find(
      (item) => item.platform === "Github"
    ) ?? { platform: "Github", url: undefined };
    const linkedin = socialProfiles?.find(
      (item) => item.platform === "LinkedIn"
    ) ?? { platform: "LinkedIn", url: undefined };
    const other =
      socialProfiles?.filter(
        (item) => item.platform !== "Github" && item.platform !== "LinkedIn"
      ) ?? [];

    return [linkedin, github, ...other];
  };

  const setProfileImage = (url?: string | null) => {
    if (url) {
      return {
        file_name: url.split("/").pop() ?? "",
        key: url.split("/").pop() ?? "",
        url: url,
      };
    }
  };

  useEffect(() => {
    if (editData) {
      form.reset();
      form.setValue("full_name", editData.name || "");
      form.setValue("work_domains", editData?.work_domains || []);
      form.setValue("college", editData?.college || "");
      form.setValue("graduation_year", editData?.graduation_year || "");
      form.setValue("tagline", editData?.tagline || "");
      form.setValue("about", editData?.about || "");
      form.setValue(
        "social_profiles",
        setupSocialProfiles(editData?.social_profiles)
      );
      form.setValue("profile_picture", setProfileImage(editData?.avatar));
    } else form.reset();
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
          <>
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
              >
                <ModalBody>
                  <div className="flex gap-10 max-w-4xl mx-auto">
                    <div className="flex-1 space-y-4">
                      <div>
                        <FormField
                          control={form.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem className="flex flex-col space-y-1.5 flex-1">
                              <FormLabel className="font-normal">
                                Your Full Name?
                              </FormLabel>
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
                                  Which domain are you interested in working?
                                  (add upto 3)
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
                                  inputValue={workDomainList.filterText}
                                  isLoading={workDomainList.isLoading}
                                  items={workDomainList.items}
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
                                    if (domainSet.size >= 3) return;
                                    domainSet.add(key);
                                    field.onChange(Array.from(domainSet));
                                  }}
                                  onInputChange={workDomainList.setFilterText}
                                >
                                  {(wd) => (
                                    <AutocompleteItem
                                      key={wd.value}
                                      endContent={
                                        field?.value?.includes(wd.value) ? (
                                          <CheckIcon className="text-2xl text-black" />
                                        ) : undefined
                                      }
                                    >
                                      {wd.label}
                                    </AutocompleteItem>
                                  )}
                                </Autocomplete>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="about"
                          render={({ field }) => (
                            <FormItem className="flex flex-col space-y-1.5 flex-1">
                              <FormLabel className="font-normal">
                                About
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  value={field.value || ""}
                                  minRows={4}
                                  onChange={(e) =>
                                    field.onChange(e.target.value || undefined)
                                  }
                                  placeholder="About..."
                                  aria-label="About"
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
                          name="tagline"
                          render={({ field }) => (
                            <FormItem className="flex flex-col space-y-1.5 flex-1">
                              <FormLabel className="font-normal">
                                Tagline
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value || ""}
                                  onChange={(e) =>
                                    field.onChange(e.target.value || undefined)
                                  }
                                  placeholder="Tagline..."
                                  aria-label="Tagline"
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
                                  (_, i) =>
                                    new Date().getFullYear() - 30 + i + ""
                                ).map((year) => (
                                  <AutocompleteItem key={year}>
                                    {year}
                                  </AutocompleteItem>
                                ))}
                              </Autocomplete>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="space-y-4">
                        {socialProfilesForm.fields.map((f, index) => (
                          <div key={f.id}>
                            <FormField
                              control={form.control}
                              name={`social_profiles.${index}.platform`}
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
                              name={`social_profiles.${index}.url`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    className={cn(index !== 0 && "sr-only")}
                                  >
                                    URLs
                                  </FormLabel>
                                  <FormDescription
                                    className={cn(index !== 0 && "sr-only")}
                                  >
                                    Add links to your website, blog, or social
                                    media profiles.
                                  </FormDescription>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder={f.platform}
                                      endContent={
                                        typeof f.platform == "undefined" ||
                                        ["Github", "LinkedIn"].includes(
                                          f?.platform
                                        ) ? undefined : (
                                          <Button
                                            isIconOnly
                                            variant="light"
                                            className="min-w-min w-5 h-5"
                                            onClick={() => {
                                              socialProfilesForm.remove(index);
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
                        <Autocomplete
                          placeholder="Select Platform..."
                          aria-label="Platform"
                          selectedKey={null}
                          className="max-w-[200px]"
                          onSelectionChange={(key) => {
                            if (key === null) return;
                            key = key + "";
                            socialProfilesForm.append({
                              platform: key,
                              url: undefined,
                            });
                          }}
                        >
                          {socialProfilesOptions
                            .filter(
                              (p) => !selectedSocialProfiles.includes(p.value)
                            )
                            .map((wd) => (
                              <AutocompleteItem key={wd.value}>
                                {wd.label}
                              </AutocompleteItem>
                            ))}
                        </Autocomplete>
                      </div>
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="profile_picture"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FileUploader
                                value={field.value ? [field.value] : []}
                                onValueChange={(value) =>
                                  field.onChange(
                                    value?.length && value?.length > 0
                                      ? value[0]
                                      : null
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
                                <p>Upload a nice Profile Picture.</p>
                                <h3 className="font-semibold">
                                  Profile Picture
                                </h3>
                              </div>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <div className="mx-auto max-w-4xl flex gap-4">
                    <Button variant="bordered" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" type="submit" isLoading={loading}>
                      Save Details
                    </Button>
                  </div>
                </ModalFooter>
              </form>
            </Form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
