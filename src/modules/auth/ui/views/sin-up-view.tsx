"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Github, Chrome as Google, UserRound } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

// ✅ Sign-up schema (with confirm match)
const SignUpSchema = z
  .object({
    name: z.string().min(2, "Name is required").max(50, "Maximum 50 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Minimum 8 characters"),
    confirmPassword: z.string().min(8, "Minimum 8 characters"),
  })
  .refine((vals) => vals.password === vals.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof SignUpSchema>;

export default function SignUpView() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onBlur",
  });

  async function onSubmit(values: SignUpValues) {
    setError(null);
    setLoading(true);
    try {
      const res = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (res.error) {
        setError(res.error.message || "Could not create account");
        return;
      }

      // After sign-up, send them to sign-in or dashboard; your choice:
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function oauth(provider: "google" | "github") {
    const cb = encodeURIComponent("/dashboard"); // adjust as you like
    window.location.href = `/api/better-auth/sign-up/${provider}?callbackURL=${cb}`;
  }

  return (
    <div className="min-h-svh grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel – branding (optional) */}
      <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-background to-muted/50 dark:from-zinc-950 dark:to-zinc-900">
        <div />
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-xl">
          <h1 className="text-4xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-3 text-muted-foreground">Start practicing mock interviews with the Amplithink-AI coach.</p>
        </motion.div>
        <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} Amplithink-AI</div>
      </div>

      {/* Right panel – form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
          <Card className="shadow-xl border-border/60">
            <CardHeader>
              <CardTitle className="text-3xl font-extrabold tracking-tight">Sign up</CardTitle>
              <CardDescription className="text-base">Create an account to get started</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4">
                {error && (
                  <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M9.401 3.004a2.25 2.25 0 0 1 3.198 0l8.397 8.397a2.25 2.25 0 0 1 0 3.198l-8.397 8.397a2.25 2.25 0 0 1-3.198 0L1.004 14.6a2.25 2.25 0 0 1 0-3.198L9.4 3.004Zm2.099 4.246a.75.75 0 0 0-1.5 0v5.25a.75.75 0 0 0 1.5 0V7.25ZM12 16.5a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input type="text" placeholder="John Doe" className="pl-9 h-11" autoComplete="name" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input type="email" placeholder="m@example.com" className="pl-9 h-11" autoComplete="email" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type={showPwd ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-9 pr-10 h-11"
                                autoComplete="new-password"
                                minLength={8}
                                {...field}
                              />
                              <button
                                type="button"
                                aria-label={showPwd ? "Hide password" : "Show password"}
                                onClick={() => setShowPwd((s) => !s)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-muted"
                              >
                                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type={showPwd ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-9 pr-10 h-11"
                                autoComplete="new-password"
                                minLength={8}
                                {...field}
                              />
                              <button
                                type="button"
                                aria-label={showPwd ? "Hide password" : "Show password"}
                                onClick={() => setShowPwd((s) => !s)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-muted"
                              >
                                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full h-11 text-base" disabled={loading || !form.formState.isValid}>
                      {loading ? "Creating account…" : "Create account"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link href="/sign-in" className="text-primary underline-offset-4 hover:underline">
                        Sign in
                      </Link>
                    </p>
                  </form>
                </Form>

                <div className="relative">
                  <Separator className="my-3" />
                  <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-background px-2 text-sm text-muted-foreground">
                    Or continue with
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" type="button" onClick={() => oauth("google")} className="h-11 w-full">
                    <Google className="mr-2 h-4 w-4" /> Google
                  </Button>
                  <Button variant="outline" type="button" onClick={() => oauth("github")} className="h-11 w-full">
                    <Github className="mr-2 h-4 w-4" /> Github
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  By continuing, you agree to our{" "}
                  <Link className="underline underline-offset-4" href="/terms">Terms</Link> and{" "}
                  <Link className="underline underline-offset-4" href="/privacy">Privacy Policy</Link>.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
