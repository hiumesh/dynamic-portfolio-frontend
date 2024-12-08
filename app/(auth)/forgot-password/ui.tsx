"use client";

import { initUpdatePassword } from "@/actions/supabase_auth";
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
import { showErrorToast } from "@/lib/client-utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

let formSchema = z
  .object({
    email: z.string().trim().email(),
  })
  .required();

export default function ForgotPasswordUI() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { email: "" },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async () => {
    try {
      const validEmail = await form.trigger("email", { shouldFocus: true });
      if (validEmail) {
        setLoading(true);
        const email = form.getValues().email;
        await initUpdatePassword(email);
        setLoading(false);
        router.replace(`/confirm?from=forgot-password&email=${email}`);
      }
    } catch (error: any) {
      setLoading(false);
      showErrorToast(error);
    }
  };
  return (
    <MaxWidthWrapper>
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                className="space-y-5"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel className="font-normal">Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit
                </Button>
              </form>
              <p className="text-sm mt-4">
                Remember you password, then&nbsp;
                <Link
                  href="/signin"
                  className="text-blue-500 hover:text-blue-400"
                >
                  sign in
                </Link>
              </p>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  );
}
