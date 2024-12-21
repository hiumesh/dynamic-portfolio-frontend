"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { showErrorToast } from "@/lib/client-utils";
import { hackathonMetadataFormSchema } from "@/lib/zod-schema";
import { useAppContext } from "@/providers/app-context";
import { updateHackathonMetadata } from "@/services/api/user_hackathon";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PropTypes {
  isOpen: boolean;
  hide: () => void;
}

export function MetaDataFormModal({ isOpen, hide }: PropTypes) {
  const [loading, setLoading] = useState(false);
  const { profile, refreshProfile } = useAppContext();

  const form = useForm<z.infer<typeof hackathonMetadataFormSchema>>({
    resolver: zodResolver(hackathonMetadataFormSchema),
  });

  const onSubmit = async (
    data: z.infer<typeof hackathonMetadataFormSchema>
  ) => {
    try {
      setLoading(true);

      const body = {
        ...data,
      };

      const response = await updateHackathonMetadata(body);

      setLoading(false);
      if (response.error) {
        form.setError("root", { message: response.error.message });
        showErrorToast(
          response.error,
          "There was a problem with your request."
        );
      } else {
        refreshProfile();
        hide();
      }
    } catch (error: any) {
      setLoading(false);
      showErrorToast(error, "There was a problem with your request.");
    }
  };

  useEffect(() => {
    if (profile?.attributes?.hackathon_metadata) {
      form.setValue(
        "heading",
        profile?.attributes?.hackathon_metadata?.heading
      );
      form.setValue(
        "description",
        profile?.attributes?.hackathon_metadata?.description
      );
    } else {
      form.setValue("heading", "");
      form.setValue("description", "");
    }
  }, [form, profile?.attributes?.hackathon_metadata]);

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      onOpenChange={(open) => {
        if (!open) hide();
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
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="heading"
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-1.5 flex-1">
                            <FormLabel className="font-normal">
                              Heading
                            </FormLabel>
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
