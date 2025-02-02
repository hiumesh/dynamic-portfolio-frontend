import AutoResizableTextarea from "@/components/auto-resizable-textarea";
import MDEditorComponent from "@/components/md-editor/md-editor";
import TagSelector from "@/components/tag-selector";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useFileUpload from "@/hooks/use-file-upload";
import { showErrorToast } from "@/lib/client-utils";
import { blogFormSchema } from "@/lib/zod-schema";
import { getDetail, create, update, takedown } from "@/services/api/blog";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MDEditor from "@uiw/react-md-editor";
import { Upload } from "lucide-react";
import Image from "next/image";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface PropTypes {
  isOpen: boolean;
  hide: () => void;
  blogId?: string | number;
  onSuccess?: (data: Blog | undefined) => void;
}
export default function BlogsFormModal({
  isOpen,
  blogId,
  onSuccess,
  hide,
}: PropTypes) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(new Set<string>());
  const [enablePreview, setEnablePreview] = useState(false);
  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: async () => {
      const response = await getDetail(blogId!);
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    enabled: !!blogId,
    refetchOnWindowFocus: false,
  });

  const form = useForm<z.infer<typeof blogFormSchema>>({
    defaultValues: {},
    resolver: zodResolver(blogFormSchema),
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof blogFormSchema>, publish?: boolean) => {
      try {
        setLoading(
          (prev) =>
            new Set([...Array.from(prev), publish ? "publish" : "draft"])
        );
        let response;

        const body = {
          ...data,
        };
        if (blogId) response = await update(blogId, body, publish);
        else response = await create(body, publish);

        setLoading((prev) => {
          prev.delete(publish ? "publish" : "draft");
          return new Set([...Array.from(prev)]);
        });
        if (response.error) {
          form.setError("root", { message: response.error.message });
          showErrorToast(
            response.error,
            "There was a problem with your request."
          );
        } else {
          onSuccess?.(response.data);
          queryClient.invalidateQueries({ queryKey: ["users_blogs"] });
          form.reset();
          hide();
        }
      } catch (error: any) {
        setLoading((prev) => {
          prev.delete(publish ? "publish" : "draft");
          return new Set([...Array.from(prev)]);
        });
        showErrorToast(error, "There was a problem with your request.");
      }
    },
    [blogId, form, hide, onSuccess, queryClient]
  );

  const handleSubmit = useCallback(
    (publish: boolean) => form.handleSubmit((data) => onSubmit(data, publish)),
    [form, onSubmit]
  );

  const unPublishMutate = useMutation({
    mutationFn: async (id: string | number) => {
      setLoading((prev) => new Set([...Array.from(prev), "unpublish"]));
      const response = await takedown(id);
      if (response.error) {
        throw new Error(response.error.message);
      }
      return id;
    },

    onSuccess: (id) => {
      setLoading((prev) => {
        prev.delete("unpublish");
        return new Set([...Array.from(prev)]);
      });
      queryClient.setQueryData(["blog", id], (prev: any) => {
        if (prev && typeof prev === "object")
          return {
            ...prev,
            published_at: null,
          };
        return prev;
      });
      queryClient.invalidateQueries({ queryKey: ["users_blogs"] });
    },
    onError: (error) => {
      setLoading((prev) => {
        prev.delete("unpublish");
        return new Set([...Array.from(prev)]);
      });
      showErrorToast(error);
    },
  });

  useEffect(() => {
    if (blogId && data) {
      form.reset();
      form.setValue("title", data.title);
      form.setValue("cover_image", data?.cover_image || "");
      form.setValue("body", data.body || "");
      form.setValue("tags", data.tags || []);
    } else {
      console.log("reset");
      form.reset({
        title: "",
        cover_image: "",
        body: "",
        tags: [],
      });
    }
    setEnablePreview(false);
  }, [blogId, data, form]);

  const errorView = useMemo(
    () => (
      <ModalBody className="bg-white p-8 rounded-xl">
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
      <ModalBody className="bg-white p-8 rounded-xl">
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
        <ModalFooter className="justify-between px-0">
          {data?.published_at ? (
            <div className="flex items-center gap-3">
              <Button
                color="primary"
                type="button"
                onClick={handleSubmit(false)}
                isLoading={loading.has("draft")}
              >
                Save Changes
              </Button>
              <Button
                color="primary"
                type="button"
                onClick={() => unPublishMutate.mutate(blogId!)}
                isLoading={loading.has("unpublish")}
              >
                Unpublish
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                color="primary"
                type="button"
                onClick={handleSubmit(true)}
                isLoading={loading.has("publish")}
              >
                Publish
              </Button>
              <Button
                variant="light"
                type="button"
                onClick={handleSubmit(false)}
                isLoading={loading.has("draft")}
              >
                Save draft
              </Button>
            </div>
          )}

          <Button variant="bordered" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      );

      let body, footer;
      if (error) body = errorView;
      else if (isLoading || isRefetching) body = loadingView;
      else if (enablePreview) {
        body = (
          <ModalBody className="bg-white p-8 rounded-xl">
            <Preview {...form.getValues()} />
          </ModalBody>
        );
        footer = f;
      } else {
        body = (
          <ModalBody className="bg-white p-8 rounded-xl">
            <div className="space-y-9">
              <div>
                <CoverImage form={form} />
              </div>
              <div>
                <div>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-1.5 flex-1">
                        <FormControl>
                          <AutoResizableTextarea
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="New post title here..."
                            className="text-5xl font-bold bg-transparent tracking-wide placeholder:text-gray-500 w-full focus:outline-none"
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
                    name="tags"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-1.5 flex-1">
                        <FormControl>
                          <TagSelector
                            value={field.value}
                            onChange={field.onChange}
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
                  name="body"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5 flex-1">
                      <FormControl>
                        <MDEditorComponent
                          value={field.value}
                          onChange={field.onChange}
                          // className="h-96"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormMessage>{form.formState.errors.root?.message}</FormMessage>
            </div>
          </ModalBody>
        );
        footer = f;
      }

      return (
        <Form {...form}>
          <form>
            {body}
            {footer}
          </form>
        </Form>
      );
    },
    [
      blogId,
      data?.published_at,
      enablePreview,
      error,
      errorView,
      form,
      handleSubmit,
      isLoading,
      isRefetching,
      loading,
      loadingView,
      unPublishMutate,
    ]
  );

  return (
    <Modal
      isOpen={isOpen}
      size="full"
      onOpenChange={(open) => {
        if (open) {
        } else hide();
      }}
    >
      <ModalContent className="overflow-auto bg-gray-100">
        {(onClose) => (
          <div>
            <div className="max-w-screen-md mx-auto">
              <ModalHeader className="flex justify-between items-center gap-1 py-2 px-0 font-normal text-xl">
                <span>Create Blog</span>
                <Button
                  variant="light"
                  onClick={() => setEnablePreview(!enablePreview)}
                >
                  {enablePreview ? "Edit" : "Preview"}
                </Button>
              </ModalHeader>
              {formView(onClose)}
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}

interface CoverImageProps {
  form: UseFormReturn<z.infer<typeof blogFormSchema>>;
}

function CoverImage({ form }: CoverImageProps) {
  const { isUploading, uploadFile } = useFileUpload();
  const coverImage = form.watch("cover_image");
  return (
    <FormField
      control={form.control}
      name="cover_image"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center gap-1 flex-1">
          {coverImage ? (
            <div className="mr-10">
              <Image
                src={coverImage}
                alt="Cover Image"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          ) : null}
          <FormLabel className="inline-flex items-center gap-2 w-min px-2.5 py-1.5 font-normal text-[11px] leading-[20px] tracking-wider bg-primary text-white rounded-lg text-nowrap cursor-pointer">
            {isUploading ? (
              <Spinner size="sm" color="white" />
            ) : (
              <Upload strokeWidth={1.9} size={14} />
            )}
            {coverImage ? "Change" : "Upload Cover Image"}
          </FormLabel>
          <FormControl>
            <input
              type="file"
              accept="image/png, image/jpeg"
              placeholder="Cover Image"
              className="hidden"
              multiple={false}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const t = await uploadFile(file);
                  form.setValue("cover_image", t.url);
                }
              }}
            />
          </FormControl>
          {coverImage ? (
            <div className="flex gap-2 items-center">
              <Button
                variant="light"
                size="sm"
                onPress={() => form.setValue("cover_image", undefined)}
              >
                Remove
              </Button>
            </div>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type PreviewProps = {} & z.infer<typeof blogFormSchema>;

function Preview({ cover_image, title, body, tags }: PreviewProps) {
  return (
    <div className="space-y-10">
      {cover_image && (
        <div className="min-h-72">
          <Image
            src={cover_image}
            alt="Cover Image"
            width={100}
            height={100}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div>
        <p className="text-5xl font-bold">{title}</p>
        <div className="flex gap-2 items-center flex-wrap">
          {tags?.map((tag) => (
            <Chip
              key={tag}
              startContent={<span className="text-xs pl-1">#</span>}
            >
              {tag}
            </Chip>
          ))}
        </div>
      </div>

      <MDEditor.Markdown source={body} />
    </div>
  );
}
