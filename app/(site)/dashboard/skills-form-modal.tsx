import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { showErrorToast } from "@/lib/client-utils";
import { skillsFormSchema } from "@/lib/zod-schema";
import { updateUserSkills } from "@/services/api/users";
import { getSkills } from "@/services/skills-api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PropTypes {
  isOpen: boolean;
  editData: string[] | null;
  onSuccess?: (data: string[] | undefined) => void;
  hide: () => void;
}

export default function SkillsFormModal({
  isOpen,
  hide,
  onSuccess,
  editData,
}: PropTypes) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof skillsFormSchema>>({
    defaultValues: {},
    resolver: zodResolver(skillsFormSchema),
  });

  const onSubmit = async (data: z.infer<typeof skillsFormSchema>) => {
    try {
      setLoading(true);

      const response = await updateUserSkills(data);

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
    if (editData) {
      form.reset();
      form.setValue("skills", editData);
    } else form.reset();
  }, [editData, form]);

  return (
    <Modal
      isOpen={isOpen}
      size="sm"
      onOpenChange={(open) => {
        if (open) {
          if (!editData) form;
        } else hide();
      }}
      onClose={hide}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <ModalBody>
                  <div>
                    <FormField
                      control={form.control}
                      name="skills"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex flex-col space-y-1.5">
                            <FormLabel className="font-normal">
                              Which skills are you good or working at? (add
                              minimum 3)
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
                                <AutocompleteItem
                                  key={skill.value}
                                  value={skill.value}
                                >
                                  {skill.label}
                                </AutocompleteItem>
                              )}
                            </Autocomplete>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  <FormMessage>
                    {form.formState.errors.root?.message}
                  </FormMessage>
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
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
