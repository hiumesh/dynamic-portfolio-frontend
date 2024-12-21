"use client";

import { Form } from "@/components/ui/form";
import { hackathonFormSchema } from "@/lib/zod-schema";
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
import HackathonFormFields from "./form-fields";
import { showErrorToast } from "@/lib/client-utils";
import {
  createUserHackathon,
  updateUserHackathon,
} from "@/services/api/user_hackathon";

interface PropTypes {
  isOpen: boolean;
  editData: UserHackathon | null;
  onSuccess?: (data: UserHackathon | undefined) => void;
  hide: () => void;
}

export default function HackathonFormModal({
  isOpen,
  hide,
  onSuccess,
  editData,
}: PropTypes) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof hackathonFormSchema>>({
    defaultValues: {
      // title: "",
      // location: "",
      // end_date: "",
      // start_date: "",
      // certificate_link: "",
      // description: "",
      // avatar: undefined,
      links: [
        {
          platform: "Website",
          label: "",
          url: "",
        },
      ],
    },
    resolver: zodResolver(hackathonFormSchema),
  });

  const onSubmit = async (data: z.infer<typeof hackathonFormSchema>) => {
    try {
      setLoading(true);
      let response;

      const body = {
        ...data,
        links: data?.links?.filter(
          (item) => item.url && item.platform && item.label
        ),
        avatar: data?.avatar?.url,
      };
      if (editData) response = await updateUserHackathon(editData.id, body);
      else response = await createUserHackathon(body);

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

  const setAvatar = (url?: string | null) => {
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
      console.log(editData);
      form.reset();
      form.setValue("title", editData.title);
      form.setValue("avatar", setAvatar(editData.avatar));
      form.setValue("location", editData.location);
      form.setValue("start_date", editData.start_date.slice(0, 10));
      form.setValue("end_date", editData.end_date.slice(0, 10));
      form.setValue("description", editData.description);
      form.setValue("links", editData.attributes?.links || []);
      form.setValue("certificate_link", editData.certificate_link);
    } else {
      form.reset({
        title: undefined,
        location: undefined,
        end_date: undefined,
        start_date: undefined,
        certificate_link: undefined,
        description: undefined,
        avatar: undefined,
      });
      console.log("running");
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
                    <HackathonFormFields form={form} />
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
