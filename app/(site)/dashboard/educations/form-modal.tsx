"use client";

import { Form } from "@/components/ui/form";
import { educationFormSchema } from "@/lib/zod-schema";
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
import {
  createUserEducation,
  updateUserEducation,
} from "@/services/api/user-educations";
import { showErrorToast } from "@/lib/client-utils";

interface PropTypes {
  isOpen: boolean;
  editData: UserEducation | null;
  onSuccess?: (data: UserEducation | undefined) => void;
  hide: () => void;
}

export default function EducationFormModal({
  isOpen,
  hide,
  onSuccess,
  editData,
}: PropTypes) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof educationFormSchema>>({
    defaultValues: {
      type: "COLLEGE",
      institute_name: "",
      field_of_study: "",
      degree: "",
      class: "",
      start_year: "",
      end_year: "",
      passing_year: "",
      grade: "",
    },
    resolver: zodResolver(educationFormSchema),
  });

  const onSubmit = async (data: z.infer<typeof educationFormSchema>) => {
    try {
      setLoading(true);
      let response;
      if (editData) response = await updateUserEducation(editData.id, data);
      else response = await createUserEducation(data);

      onSuccess?.(response);
      hide();

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      showErrorToast(error, "There was a problem with your request.");
    }
  };

  useEffect(() => {
    console.log(editData);
    if (editData) {
      form.reset();
      form.setValue("type", editData.type);
      form.setValue("institute_name", editData.institute_name);
      form.setValue(
        "field_of_study",
        editData.attributes?.field_of_study || ""
      );
      form.setValue("degree", editData.attributes?.degree || "");
      form.setValue("class", editData.attributes?.class);
      form.setValue("start_year", editData.attributes?.start_year || "");
      form.setValue("end_year", editData.attributes?.end_year || "");
      form.setValue("passing_year", editData.attributes?.passing_year || "");
      form.setValue("grade", editData.grade);
    } else form.reset();
  }, [editData, form]);

  return (
    <Modal
      isOpen={isOpen}
      size="3xl"
      onOpenChange={(open) => {
        if (open) {
          if (!editData) form;
        } else hide();
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
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
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
