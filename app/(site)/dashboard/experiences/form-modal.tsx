"use client";

import { Form } from "@/components/ui/form";
import { workExperienceFormSchema } from "@/lib/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import EducationFormFields from "./form-fields";
import { showErrorToast } from "@/lib/client-utils";
import {
  createUserWorkExperience,
  updateUserWorkExperience,
} from "@/services/api/experience";

interface PropTypes {
  isOpen: boolean;
  editData: UserWorkExperience | null;
  onSuccess?: (data: UserWorkExperience | undefined) => void;
  hide: () => void;
}

export default function ExperienceFormModal({
  isOpen,
  hide,
  onSuccess,
  editData,
}: PropTypes) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof workExperienceFormSchema>>({
    defaultValues: {
      description: [{}, {}, {}],
    },
    resolver: zodResolver(workExperienceFormSchema),
  });

  const onSubmit = async (data: z.infer<typeof workExperienceFormSchema>) => {
    try {
      setLoading(true);
      let response;

      const body = {
        ...data,
        description: data?.description?.map((item) => item.item),
      };
      if (editData)
        response = await updateUserWorkExperience(editData.id, body);
      else response = await createUserWorkExperience(body);

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

  useEffect(() => {
    if (editData) {
      form.reset();
      form.setValue("company_name", editData.company_name);
      form.setValue("job_type", editData.job_type);
      form.setValue("company_url", editData.company_url);
      form.setValue("job_title", editData.job_title);
      form.setValue("location", editData.location);
      form.setValue("start_date", editData.start_date.slice(0, 10));
      form.setValue(
        "end_date",
        editData.end_date ? editData.end_date.slice(0, 10) : undefined
      );
      form.setValue("currently_working", typeof editData.end_date != "string");
      form.setValue(
        "description",
        editData.description.map((item) => ({ item }))
      );
      form.setValue("skills_used", editData.skills_used);
      form.setValue("certificate_link", editData.certificate_link);
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
          <div className="max-w-4xl mx-auto">
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <ModalBody>
                  <EducationFormFields form={form} />
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
        )}
      </ModalContent>
    </Modal>
  );
}
