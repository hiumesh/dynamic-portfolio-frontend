"use client";

import { Form } from "@/components/ui/form";
import { certificateFormSchema } from "@/lib/zod-schema";
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
import CertificateFormFields from "./form-fields";
import { showErrorToast } from "@/lib/client-utils";
import {
  createUserCertification,
  updateUserCertification,
} from "@/services/api/user-certification";

interface PropTypes {
  isOpen: boolean;
  editData: UserCertification | null;
  onSuccess?: (data: UserCertification | undefined) => void;
  hide: () => void;
}

export default function CertificateFormModal({
  isOpen,
  hide,
  onSuccess,
  editData,
}: PropTypes) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof certificateFormSchema>>({
    defaultValues: {
      description: [
        {
          item: undefined,
        },
      ],
    },
    resolver: zodResolver(certificateFormSchema),
  });

  const onSubmit = async (data: z.infer<typeof certificateFormSchema>) => {
    try {
      setLoading(true);
      let response;

      const body = {
        ...data,
        description: data?.description?.map((item) => item.item),
      };

      if (editData) response = await updateUserCertification(editData.id, body);
      else response = await createUserCertification(body);

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
      form.setValue("title", editData.title);
      form.setValue("completion_date", editData.completion_date.slice(0, 10));
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
                  <CertificateFormFields form={form} />
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
