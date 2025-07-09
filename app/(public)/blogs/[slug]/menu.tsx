"use client";

import { useAppContext } from "@/providers/app-context";
import { useParams, useRouter } from "next/navigation";
import { ClapFilledIcon, ClapIcon } from "./comments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  blogReaction,
  bookmark,
  getDetailBySlug,
  removeBookmark,
} from "@/services/api/blog";
import { BookmarkFilledIcon, BookmarkIcon } from "@/lib/icons";
import { showErrorToast } from "@/lib/client-utils";
import Link from "next/link";

export default function ActionMenu() {
  const { profile } = useAppContext();
  const queryClient = useQueryClient();
  const isLoggedIn = !!profile?.user_id;
  const params = useParams<{ slug: string }>();

  const router = useRouter();

  const {
    data: blog,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["blog", params.slug],
    queryFn: async () => {
      const response = await getDetailBySlug(params.slug);
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const blogReactionMutation = useMutation({
    mutationFn: async ({
      blogId,
      action,
      reaction,
    }: {
      blogId: string | number;
      parentId?: string | number;
      reaction: string;
      action: "add" | "remove";
    }) => {
      const response = await blogReaction({
        blogId: blogId,
        reaction,
        action,
      });
      if (response.error) {
        showErrorToast(response.error);
        throw new Error(response.error.message);
      }
      return response.data;
    },
    onMutate: ({ reaction, action }) => {
      queryClient.setQueryData(
        ["blog", params.slug],
        (prev: Blog | undefined) => {
          if (!prev) return prev;
          return {
            ...prev,
            reactions:
              action === "add"
                ? [...prev.reactions, reaction]
                : prev.reactions.filter((r) => r !== reaction),
            reaction_metadata: {
              ...prev.reactions_metadata,
              [reaction]:
                action === "add"
                  ? ((prev?.reactions_metadata as Record<string, number>)?.[
                      reaction
                    ] || 0) + 1
                  : ((prev?.reactions_metadata as Record<string, number>)?.[
                      reaction
                    ] || 0) - 1,
            },
          };
        }
      );
    },
    onError: (_, {}) => {
      queryClient.invalidateQueries({
        queryKey: ["blog", params.slug],
      });
    },
  });

  const blogBookmarkMutation = useMutation({
    mutationFn: async ({
      blogId,
      is_bookmarked,
    }: {
      blogId: string | number;
      is_bookmarked: boolean;
    }) => {
      let response;
      if (is_bookmarked) {
        response = await bookmark(blogId);
      } else {
        response = await removeBookmark(blogId);
      }

      if (response.error) {
        showErrorToast(response.error);
        throw new Error(response.error.message);
      }
      return response.data;
    },
    onMutate: ({ is_bookmarked }) => {
      queryClient.setQueryData(
        ["blog", params.slug],
        (prev: Blog | undefined) => {
          if (!prev) return prev;
          return {
            ...prev,
            is_bookmarked: is_bookmarked,
          };
        }
      );
    },
    onError: (_, {}) => {
      queryClient.invalidateQueries({
        queryKey: ["blog", params.slug],
      });
    },
  });

  console.log(blog);

  if (!blog || error || isLoading) return null;

  return (
    <div className="py-3 px-2  border-y flex items-center justify-between">
      <div className="flex gap-4">
        <div className="flex gap-1">
          {blog?.reactions?.includes("clap") ? (
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={() => {
                if (!isLoggedIn) {
                  router.push("/login");
                  return;
                }
                blogReactionMutation.mutate({
                  blogId: blog!.id,
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
                blogReactionMutation.mutate({
                  blogId: blog!.id,
                  reaction: "clap",
                  action: "add",
                });
              }}
            >
              <ClapIcon />
            </button>
          )}

          <button className="text-gray-600 hover:text-gray-800">
            {blog?.reactions_metadata?.clap || 0}
          </button>
        </div>
        <div className="flex gap-1">
          <Link
            href={"#comments"}
            className="text-gray-600 hover:text-gray-800"
            onClick={() => {
              if (!isLoggedIn) {
                router.push("/login");
                return;
              }
              // handleCommentReaction({
              //   commentId: comment.id,
              //   parentId: comment.parent_id,
              //   reaction: "clap",
              //   action: "remove",
              // });
            }}
          >
            <CommentIcon />
          </Link>

          <button className="text-gray-600 hover:text-gray-800">
            {blog?.comments_count || 0}
          </button>
        </div>
      </div>
      <div>
        {blog?.is_bookmarked ? (
          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={() => {
              if (!isLoggedIn) {
                router.push("/login");
                return;
              }
              blogBookmarkMutation.mutate({
                blogId: blog.id,
                is_bookmarked: false,
              });
            }}
          >
            <BookmarkFilledIcon />
          </button>
        ) : (
          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={() => {
              if (!isLoggedIn) {
                router.push("/login");
                return;
              }
              blogBookmarkMutation.mutate({
                blogId: blog!.id,
                is_bookmarked: true,
              });
            }}
          >
            <BookmarkIcon />
          </button>
        )}
      </div>
    </div>
  );
}

function CommentIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M18.006 16.803c1.533-1.456 2.234-3.325 2.234-5.321C20.24 7.357 16.709 4 12.191 4S4 7.357 4 11.482c0 4.126 3.674 7.482 8.191 7.482.817 0 1.622-.111 2.393-.327.231.2.48.391.744.559 1.06.693 2.203 1.044 3.399 1.044.224-.008.4-.112.486-.287a.49.49 0 0 0-.042-.518c-.495-.67-.845-1.364-1.04-2.057a4 4 0 0 1-.125-.598zm-3.122 1.055-.067-.223-.315.096a8 8 0 0 1-2.311.338c-4.023 0-7.292-2.955-7.292-6.587 0-3.633 3.269-6.588 7.292-6.588 4.014 0 7.112 2.958 7.112 6.593 0 1.794-.608 3.469-2.027 4.72l-.195.168v.255c0 .056 0 .151.016.295.025.231.081.478.154.733.154.558.398 1.117.722 1.659a5.3 5.3 0 0 1-2.165-.845c-.276-.176-.714-.383-.941-.59z"></path>
    </svg>
  );
}
