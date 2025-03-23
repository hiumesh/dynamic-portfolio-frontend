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
import { certificationMetadataFormSchema } from "@/lib/zod-schema";
import { getMetadata, updateMetadata } from "@/services/api/certification";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PropTypes {
  isOpen: boolean;
  hide: () => void;
  onSuccess?: (data: any) => void;
}

export function CertificationMetaDataFormModal({
  isOpen,
  hide,
  onSuccess,
}: PropTypes) {
  const [loading, setLoading] = useState(false);
  const { data, dataUpdatedAt, error, isLoading, isRefetching, refetch } =
    useQuery({
      queryKey: ["certification_metadata"],
      queryFn: async () => {
        const response = await getMetadata();
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.data;
      },
      refetchOnWindowFocus: false,
    });

  const form = useForm<z.infer<typeof certificationMetadataFormSchema>>({
    resolver: zodResolver(certificationMetadataFormSchema),
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof certificationMetadataFormSchema>) => {
      try {
        setLoading(true);

        const body = {
          ...data,
        };

        const response = await updateMetadata(body);

        setLoading(false);
        if (response.error) {
          form.setError("root", { message: response.error.message });
          showErrorToast(
            response.error,
            "There was a problem with your request."
          );
        } else {
          onSuccess?.(response.data);
          hide();
        }
      } catch (error: any) {
        setLoading(false);
        showErrorToast(error, "There was a problem with your request.");
      }
    },
    [form, hide, onSuccess]
  );

  useEffect(() => {
    if (data) {
      form.setValue("heading", data?.heading || "");
      form.setValue("description", data?.description || "");
    } else {
      form.reset({
        heading: "",
        description: "",
      });
    }
  }, [data, dataUpdatedAt]);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen]);

  const errorView = useMemo(
    () => (
      <ModalBody>
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-sm">Something went wrong</p>
          <Button color="danger" onPress={() => refetch()}>
            Retry
          </Button>
        </div>
      </ModalBody>
    ),
    [refetch]
  );

  const loadingView = useMemo(
    () => (
      <ModalBody>
        <div className="flex flex-col items-center justify-center space-y-2">
          <Spinner size="sm" />
          <p className="text-sm">Loading...</p>
        </div>
      </ModalBody>
    ),
    []
  );

  const formView = useCallback(
    (onClose: () => void) => {
      const f = (
        <ModalFooter>
          <Button variant="bordered" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" type="submit" isLoading={loading}>
            Save Details
          </Button>
        </ModalFooter>
      );

      let body, footer;
      if (error) body = errorView;
      else if (isLoading || isRefetching) body = loadingView;
      else {
        body = (
          <ModalBody>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="heading"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5 flex-1">
                    <FormLabel className="font-normal">Heading</FormLabel>
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
                    <FormLabel className="font-normal">Description</FormLabel>
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
        );

        footer = f;
      }

      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {body}
            {footer}
          </form>
        </Form>
      );
    },
    [
      error,
      errorView,
      form,
      isLoading,
      isRefetching,
      loading,
      loadingView,
      onSubmit,
    ]
  );

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      className="min-h-60"
      onOpenChange={(open) => {
        if (!open) hide();
      }}
    >
      <ModalContent className="overflow-auto">
        {(onClose) => (
          <div>
            <div className="mx-auto max-w-xl">
              <ModalHeader className="w-max">Update Metadata</ModalHeader>
              {formView(onClose)}
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
