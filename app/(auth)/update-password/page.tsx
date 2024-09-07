"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  // exchangeCodeForSession,
  updatePassword,
} from "@/actions/supabase_auth";
import { useRouter, useSearchParams } from "next/navigation";

const formSchema = z
  .object({
    password: z.string().trim().min(8),
    cpassword: z.string().trim().min(8),
  })
  .refine(({ cpassword, password }) => password === cpassword, {
    message: "Password don't match",
    path: ["cpassword"],
  });

export default function UpdatePassword() {
  const [loading, setLoading] = useState(false);
  // const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { password: "", cpassword: "" },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await updatePassword(data.password);
      router.replace("signin");
    } catch (error: any) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: error?.message || "There was a problem with your request.",
      });
    }
  };

  // useEffect(() => {
  //   async function init() {
  //     const code = searchParams.get("code");
  //     const error = searchParams.get("error");

  //     if (error) {
  //       const errorDescription = searchParams.get("error_description");
  //       setTimeout(() => {
  //         toast({
  //           variant: "destructive",
  //           title: "Something went wrong!",
  //           description:
  //             errorDescription || "There was a problem with your request.",
  //         });
  //       });
  //       router.replace("/update-password");
  //       return;
  //     }

  //     if (code) {
  //       try {
  //         await exchangeCodeForSession(code);
  //         router.replace("/update-password");
  //       } catch (error: any) {
  //         setTimeout(() => {
  //           toast({
  //             variant: "destructive",
  //             title: "Something went wrong!",
  //             description:
  //               error?.message || "There was a problem with your request.",
  //           });
  //         });
  //       }
  //     }
  //   }

  //   init();
  // }, []);
  return (
    <MaxWidthWrapper>
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Update Password</CardTitle>
            <CardDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel className="font-normal">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="enter password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpassword"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel className="font-normal">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="confirm password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  );
}
