"use client";

import RenderMarkdown from "@/components/parse-markdown";
import { useControllableState } from "@/hooks/use-controllable-state";
import { showErrorToast } from "@/lib/client-utils";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/providers/app-context";
import {
  commentReaction,
  commentReply,
  createComment,
  getComments,
} from "@/services/api/comment";
import { Avatar, Badge, Button, Skeleton, Textarea, User } from "@heroui/react";
import { useDateFormatter } from "@react-aria/i18n";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Comments() {
  const params = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const { profile } = useAppContext();
  const [ref, inView] = useInView();

  const isLodgedIn = !!profile?.user_id;

  const {
    data,
    error,
    isLoading,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["blog-comments", params.slug, null],
    queryFn: async ({ pageParam }) => {
      const response = await getComments({
        slug: params.slug,
        module: "blog",
        cursor: pageParam,
      });
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.cursor,
    refetchOnWindowFocus: false,
  });

  const newCommentMutation = useMutation({
    mutationFn: async (body: string) => {
      const response = await createComment({
        body: body,
        module: "blog",
        slug: params.slug,
      });
      if (response.error) {
        showErrorToast(response.error);
      }
      return response.data;
    },

    onMutate: async (body: string) => {
      queryClient.setQueryData(
        ["blog-comments", params.slug, null],
        (
          prev: InfiniteData<
            | {
                list: BlogComment[];
                cursor: number | null;
              }
            | undefined
          >
        ) => {
          if (!prev) return prev;
          return {
            ...prev,
            pages:
              prev?.pages && prev?.pages?.length
                ? prev.pages.map((page, index) => {
                    if (index === 0) {
                      return {
                        ...page,
                        list: [
                          {
                            id: Date.now(),
                            body: body,
                            parent_id: null,
                            author_id: profile?.user_id,
                            author_name: profile?.full_name,
                            author_avatar: profile?.avatar_url,
                            attributes: {},
                            reactions: [],
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                          },
                          ...(page?.list || []),
                        ],
                      };
                    }
                    return page;
                  })
                : [
                    {
                      list: [
                        {
                          id: Date.now(),
                          body: body,
                          parent_id: null,
                          author_id: profile?.user_id,
                          author_name: profile?.full_name,
                          author_avatar: profile?.avatar_url,
                          attributes: {},
                          reactions: [],
                          created_at: new Date().toUTCString(),
                          updated_at: new Date().toUTCString(),
                        },
                      ],
                      cursor: null,
                    },
                  ],
          };
        }
      );
    },
    onSettled: () => {
      refetch();
    },
  });

  const commentReactionMutation = useMutation({
    mutationFn: async ({
      commentId,
      action,
      reaction,
    }: {
      commentId: string | number;
      parentId?: string | number;
      reaction: string;
      action: "add" | "remove";
    }) => {
      const response = await commentReaction({
        commentId: commentId,
        reaction,
        action,
      });
      if (response.error) {
        showErrorToast(response.error);
      }
      return response.data;
    },
    onMutate: ({ commentId, parentId, reaction, action }) => {
      queryClient.setQueryData(
        ["blog-comments", params.slug, parentId],
        (
          prev: InfiniteData<
            | {
                list: BlogComment[];
                cursor: number | null;
              }
            | undefined
          >
        ) => {
          if (!prev) return prev;
          return {
            ...prev,
            pages: prev.pages.map((page) => ({
              ...page,
              list: page?.list.map((comment) => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    attributes: {
                      ...comment.attributes,
                      reaction_metadata: {
                        ...comment.attributes?.reaction_metadata,
                        [reaction]:
                          action === "add"
                            ? ((
                                comment.attributes?.reaction_metadata as Record<
                                  string,
                                  number
                                >
                              )?.[reaction] || 0) + 1
                            : ((
                                comment.attributes?.reaction_metadata as Record<
                                  string,
                                  number
                                >
                              )?.[reaction] || 0) - 1,
                      },
                    },
                    reactions:
                      action === "add"
                        ? [...comment.reactions, reaction]
                        : comment.reactions.filter((r) => r !== reaction),
                  };
                }
                return comment;
              }),
            })),
          };
        }
      );
    },
    onError: (_, { parentId }) => {
      queryClient.invalidateQueries({
        queryKey: ["blog-comments", params.slug, parentId],
      });
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  if (!data || error || isLoading) return null;

  return (
    <div className="space-y-7">
      <h1 className="text-xl">Comments</h1>
      <CommentInput
        handleSubmit={(body) => newCommentMutation.mutateAsync(body)}
        loading={newCommentMutation.isPending}
        isLoggedIn={isLodgedIn}
      />
      <div className="space-y-8">
        {data.pages
          .flatMap((page) => page?.list || [])
          .map((comment) => (
            <CommentBlock
              key={comment.id}
              comment={comment}
              slug={params.slug}
              refetchParent={refetch}
              handleCommentReaction={commentReactionMutation.mutateAsync}
              isLoggedIn={isLodgedIn}
            />
          ))}

        {(isLoading || isFetchingNextPage) && <CommentBlockSkeleton />}
        <div
          ref={ref}
          className="text-center text-sm text-muted-foreground py-7 invisible"
        >
          {isFetchingNextPage
            ? "Fetching next page..."
            : hasNextPage
            ? "Fetch More Data"
            : "No more data"}
        </div>
      </div>
    </div>
  );
}

function CommentInput({
  handleSubmit,
  loading,
  editMode,
  setEditMode,
  isLoggedIn = false,
}: {
  handleSubmit: (body: string) => Promise<void>;
  loading: boolean;
  editMode?: boolean;
  setEditMode?: (editMode: boolean) => void;
  isLoggedIn?: boolean;
}) {
  const [isEditMode, setIsEditMode] = useControllableState({
    defaultProp: editMode,
    onChange: setEditMode,
  });
  const [value, setValue] = useState("");
  const { profile } = useAppContext();
  const router = useRouter();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge
          color="success"
          content=""
          placement="bottom-right"
          shape="circle"
        >
          <Avatar
            src={profile?.avatar_url || ""}
            alt={profile?.full_name || ""}
            name={profile?.full_name || ""}
            size="sm"
            radius="full"
          />
        </Badge>
        <p>{profile?.full_name}</p>
      </div>
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsEditMode(true)}
          minRows={isEditMode ? 3 : 1}
          placeholder="What are your thoughts?"
          classNames={{
            input: isEditMode && "pb-10",
          }}
        />
        <div
          className={cn(
            "absolute hidden bottom-2 right-2 items-center gap-3",
            isEditMode && "flex"
          )}
        >
          <Button
            variant="ghost"
            onPress={() => {
              startTransition(() => {
                setIsEditMode(false);
                setValue("");
              });
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            isDisabled={!(value?.length > 5) || loading}
            isLoading={loading}
            onPress={async () => {
              if (!isLoggedIn) {
                router.push("/login");
                return;
              }
              await handleSubmit(value);
              setValue("");
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CommentBlock({
  comment,
  slug,
  refetchParent,
  handleCommentReaction,
  isLoggedIn = false,
}: {
  comment: BlogComment;
  slug: string;
  isLoggedIn?: boolean;
  refetchParent?: () => void;
  handleCommentReaction: ({
    commentId,
    parentId,
    reaction,
    action,
  }: {
    commentId: string | number;
    parentId: string | number;
    reaction: string;
    action: "add" | "remove";
  }) => Promise<void>;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const router = useRouter();
  let formatter = useDateFormatter({ dateStyle: "medium" });

  const {
    data,
    error,
    isLoading,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["blog-comments", slug, comment.id],
    queryFn: async ({ pageParam }) => {
      const response = await getComments({
        slug: slug,
        parentId: comment.id,
        module: "blog",
        cursor: pageParam,
      });
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.cursor,
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const commentReplyMutation = useMutation({
    mutationFn: async (body: string) => {
      const response = await commentReply({
        body: body,
        module: "blog",
        commentId: comment.id,
      });
      if (response.error) {
        showErrorToast(response.error);
      }
      return response.data;
    },
    onMutate: () => {},

    onSuccess: () => {
      setShowReplyInput(false);
      setShowReplies(true);
      refetchParent?.();
      refetch();
    },
  });

  const handleShowReplies = () => {
    if (!showReplies) refetch();
    setShowReplies(!showReplies);
  };

  return (
    <div className="space-y-2 border-b last:border-b-0 pb-6">
      <User
        avatarProps={{
          src: comment.author_avatar,
          alt: comment.author_name,
          name: comment.author_name,
          isBordered: true,
        }}
        name={comment.author_name}
        description={formatter.format(new Date(comment.created_at))}
      />
      <RenderMarkdown markdown={comment.body} />
      <div className="flex gap-4">
        <div className="flex gap-1">
          {comment.reactions?.includes("clap") ? (
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={() => {
                if (!isLoggedIn) {
                  router.push("/login");
                  return;
                }
                handleCommentReaction({
                  commentId: comment.id,
                  parentId: comment.parent_id,
                  reaction: "clap",
                  action: "remove",
                });
              }}
            >
              <ClapFilledIcon />
            </button>
          ) : (
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={() => {
                if (!isLoggedIn) {
                  router.push("/login");
                  return;
                }
                handleCommentReaction({
                  commentId: comment.id,
                  parentId: comment.parent_id,
                  reaction: "clap",
                  action: "add",
                });
              }}
            >
              <ClapIcon />
            </button>
          )}

          <button className="text-gray-600 hover:text-gray-800">
            {comment.attributes?.reaction_metadata?.clap || 0}
          </button>
        </div>
        <button
          className="flex gap-1 text-gray-600 hover:text-gray-800"
          onClick={handleShowReplies}
        >
          <CommentIcon />
          {showReplies ? (
            <span>Hide replies</span>
          ) : (
            `${comment?.attributes?.replies_count || 0} replies`
          )}
        </button>

        <button className="underline" onClick={() => setShowReplyInput(true)}>
          Reply
        </button>
      </div>

      <div className="border-l pl-10">
        {showReplyInput && (
          <CommentInput
            handleSubmit={async (body: string) => {
              await commentReplyMutation.mutateAsync(body);
            }}
            loading={commentReplyMutation.isPending}
            editMode={true}
            setEditMode={setShowReplyInput}
            isLoggedIn={isLoggedIn}
          />
        )}
        {showReplies && (
          <div className="space-y-7 pt-7">
            {data?.pages
              .flatMap((page) => page?.list || [])
              .map((reply) => (
                <CommentBlock
                  key={reply.id}
                  comment={reply}
                  slug={slug}
                  refetchParent={refetch}
                  handleCommentReaction={handleCommentReaction}
                  isLoggedIn={isLoggedIn}
                />
              ))}
          </div>
        )}
        {showReplies && (isLoading || isFetchingNextPage) && (
          <CommentBlockSkeleton />
        )}
        {!isFetchingNextPage && hasNextPage && (
          <Button
            type="button"
            variant="light"
            onPress={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            disabled={isFetchingNextPage}
          >
            Load more
          </Button>
        )}
      </div>
    </div>
  );
}

function CommentBlockSkeleton() {
  return (
    <div className="space-y-4 py-10">
      <div className="max-w-[200px] w-full flex items-center gap-3">
        <div>
          <Skeleton className="flex rounded-full w-12 h-12" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-3 w-3/5 rounded-lg" />
          <Skeleton className="h-3 w-4/5 rounded-lg" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-2/5 rounded-lg">
          <div className="h-3 w-2/5 rounded-lg bg-default-300" />
        </Skeleton>
      </div>
    </div>
  );
}

export function ClapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-label="clap"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M11.37.828 12 3.282l.63-2.454zM13.916 3.953l1.523-2.112-1.184-.39zM8.589 1.84l1.522 2.112-.337-2.501zM18.523 18.92c-.86.86-1.75 1.246-2.62 1.33a6 6 0 0 0 .407-.372c2.388-2.389 2.86-4.951 1.399-7.623l-.912-1.603-.79-1.672c-.26-.56-.194-.98.203-1.288a.7.7 0 0 1 .546-.132c.283.046.546.231.728.5l2.363 4.157c.976 1.624 1.141 4.237-1.324 6.702m-10.999-.438L3.37 14.328a.828.828 0 0 1 .585-1.408.83.83 0 0 1 .585.242l2.158 2.157a.365.365 0 0 0 .516-.516l-2.157-2.158-1.449-1.449a.826.826 0 0 1 1.167-1.17l3.438 3.44a.363.363 0 0 0 .516 0 .364.364 0 0 0 0-.516L5.293 9.513l-.97-.97a.826.826 0 0 1 0-1.166.84.84 0 0 1 1.167 0l.97.968 3.437 3.436a.36.36 0 0 0 .517 0 .366.366 0 0 0 0-.516L6.977 7.83a.82.82 0 0 1-.241-.584.82.82 0 0 1 .824-.826c.219 0 .43.087.584.242l5.787 5.787a.366.366 0 0 0 .587-.415l-1.117-2.363c-.26-.56-.194-.98.204-1.289a.7.7 0 0 1 .546-.132c.283.046.545.232.727.501l2.193 3.86c1.302 2.38.883 4.59-1.277 6.75-1.156 1.156-2.602 1.627-4.19 1.367-1.418-.236-2.866-1.033-4.079-2.246M10.75 5.971l2.12 2.12c-.41.502-.465 1.17-.128 1.89l.22.465-3.523-3.523a.8.8 0 0 1-.097-.368c0-.22.086-.428.241-.584a.847.847 0 0 1 1.167 0m7.355 1.705c-.31-.461-.746-.758-1.23-.837a1.44 1.44 0 0 0-1.11.275c-.312.24-.505.543-.59.881a1.74 1.74 0 0 0-.906-.465 1.47 1.47 0 0 0-.82.106l-2.182-2.182a1.56 1.56 0 0 0-2.2 0 1.54 1.54 0 0 0-.396.701 1.56 1.56 0 0 0-2.21-.01 1.55 1.55 0 0 0-.416.753c-.624-.624-1.649-.624-2.237-.037a1.557 1.557 0 0 0 0 2.2c-.239.1-.501.238-.715.453a1.56 1.56 0 0 0 0 2.2l.516.515a1.556 1.556 0 0 0-.753 2.615L7.01 19c1.32 1.319 2.909 2.189 4.475 2.449q.482.08.971.08c.85 0 1.653-.198 2.393-.579.231.033.46.054.686.054 1.266 0 2.457-.52 3.505-1.567 2.763-2.763 2.552-5.734 1.439-7.586z"
        clip-rule="evenodd"
      ></path>
    </svg>
  );
}

export function ClapFilledIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-label="clap"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M11.37.828 12 3.282l.63-2.454zM15.421 1.84l-1.185-.388-.338 2.5zM9.757 1.452l-1.184.389 1.523 2.112zM20.253 11.84 17.75 7.438c-.238-.353-.57-.584-.93-.643a.96.96 0 0 0-.753.183 1.13 1.13 0 0 0-.443.695c.014.019.03.033.044.053l2.352 4.138c1.614 2.95 1.1 5.771-1.525 8.395a7 7 0 0 1-.454.415c.997-.13 1.927-.61 2.773-1.457 2.705-2.704 2.517-5.585 1.438-7.377M12.066 9.01c-.129-.687.08-1.299.573-1.773l-2.062-2.063a1.123 1.123 0 0 0-1.555 0 1.1 1.1 0 0 0-.273.521z"
        clipRule="evenodd"
      ></path>
      <path
        fillRule="evenodd"
        d="M14.741 8.309c-.18-.267-.446-.455-.728-.502a.67.67 0 0 0-.533.127c-.146.113-.59.458-.199 1.296l1.184 2.503a.448.448 0 0 1-.236.755.445.445 0 0 1-.483-.248L7.614 6.106A.816.816 0 1 0 6.459 7.26l3.643 3.644a.446.446 0 1 1-.631.63L5.83 7.896l-1.03-1.03a.82.82 0 0 0-1.395.577.81.81 0 0 0 .24.576l1.027 1.028 3.643 3.643a.444.444 0 0 1-.144.728.44.44 0 0 1-.486-.098l-3.64-3.64a.82.82 0 0 0-1.335.263.81.81 0 0 0 .178.89l1.535 1.534 2.287 2.288a.445.445 0 0 1-.63.63l-2.287-2.288a.813.813 0 0 0-1.393.578c0 .216.086.424.238.577l4.403 4.403c2.79 2.79 5.495 4.119 8.681.931 2.269-2.271 2.708-4.588 1.342-7.086z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export function CommentIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-label="responses"
      fill="currentColor"
    >
      <path d="M18.006 16.803c1.533-1.456 2.234-3.325 2.234-5.321C20.24 7.357 16.709 4 12.191 4S4 7.357 4 11.482c0 4.126 3.674 7.482 8.191 7.482.817 0 1.622-.111 2.393-.327.231.2.48.391.744.559 1.06.693 2.203 1.044 3.399 1.044.224-.008.4-.112.486-.287a.49.49 0 0 0-.042-.518c-.495-.67-.845-1.364-1.04-2.057a4 4 0 0 1-.125-.598zm-3.122 1.055-.067-.223-.315.096a8 8 0 0 1-2.311.338c-4.023 0-7.292-2.955-7.292-6.587 0-3.633 3.269-6.588 7.292-6.588 4.014 0 7.112 2.958 7.112 6.593 0 1.794-.608 3.469-2.027 4.72l-.195.168v.255c0 .056 0 .151.016.295.025.231.081.478.154.733.154.558.398 1.117.722 1.659a5.3 5.3 0 0 1-2.165-.845c-.276-.176-.714-.383-.941-.59z"></path>
    </svg>
  );
}
