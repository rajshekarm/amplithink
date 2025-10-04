"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Mail, Lock, Eye, EyeOff, Github, Chrome as Google,
  ShieldCheck, Sparkles, Bot, Mic, BookOpen, Video, HeartHandshake, UserRound
} from "lucide-react";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";                   
import { authClient } from "@/lib/auth-client";
import router from "next/router";

// Validation schema
const SignInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
  remember: z.boolean().optional(),
  role: z.enum(["learner", "coach"]).default("learner"),
});


export type SignInValues = z.infer<typeof SignInSchema>;




export default function SignInView() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
    mode: "onTouched",
    defaultValues: { role: "learner" },
  });

  const role = watch("role");

  // async function onSubmit(values: SignInValues) {
  //   console.log("Submitting", values);
  //   setLoading(true);
  //   try {
  //     // TODO: hook into BetterAuth/NextAuth/custom API
  //     await new Promise((r) => setTimeout(r, 1000));
  //     console.log("Sign in with:", values);
  //     // router.push(role === "learner" ? "/practice" : "/coach");
  //   } finally {
  //     setLoading(false);
  //   }
  // }


  const onSubmit = async (data: SignInValues) => {
  setError(null);
  authClient.signIn.email(
    { email: data.email, password: data.password },
    {
      onSuccess: () => router.push(data.role === "coach" ? "/coach" : "/practice"),
      onError: ({error}) => setError(error.message),
    }
  );
};


  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/30 dark:from-zinc-950 dark:to-zinc-900">
      {/* Learning-only banner */}
      <div className="sticky top-0 z-10 border-b bg-background/70 backdrop-blur">
        <div className="container mx-auto flex items-center justify-center gap-2 px-4 py-2 text-xs text-muted-foreground">
          <HeartHandshake className="h-3.5 w-3.5" />
          <span>Learning-only • Mock interviews & AI coaching • We don’t share data with employers</span>
        </div>
      </div>

      <div className="container mx-auto grid min-h-[calc(100vh-44px)] grid-cols-1 md:grid-cols-2">
        {/* Left / Brand & coach presence */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative hidden items-center justify-center p-10 md:flex"
        >
          <div className="max-w-md">
            <div className="mb-6 flex items-center justify-between">
              <div className="inline-flex items-center gap-3 rounded-2xl bg-primary/10 px-4 py-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-medium">Privacy-first • Consent-driven • Secure</span>
              </div>
              {/* “Coach is online” presence */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <UserRound className="h-6 w-6 text-muted-foreground" />
                  <span className="absolute -right-0 -top-0 inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                </div>
                <span className="text-xs text-muted-foreground">Coach available</span>
              </div>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              Practice with a{" "}
              <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                real-feeling AI coach
              </span>
            </h1>

            <p className="mt-4 text-base text-muted-foreground">
              Amplithink-AI is a <strong>career guide</strong> for CS, software, and AI engineers. Jump into a mock
              interview or talk to a friendly coach over video. No recruiting, no hiring pipeline — just practice and growth.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <Bot className="mt-0.5 h-4 w-4 text-primary" />
                Adaptive sessions for DSA, systems, backend, cloud, and ML — matched to your level.
              </li>
              <li className="flex items-start gap-3">
                <Mic className="mt-0.5 h-4 w-4 text-primary" />
                Voice/video with instant, rubric-based feedback that feels like a human mentor.
              </li>
              <li className="flex items-start gap-3">
                <BookOpen className="mt-0.5 h-4 w-4 text-primary" />
                Actionable tips, skill plans, and progress tracking. Learn by practicing often.
              </li>
            </ul>

            {/* Accent blobs */}
            <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          </div>
        </motion.aside>

        {/* Right / Form card */}
        <motion.main
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center p-6"
        >
          <Card className="w-full max-w-md border-zinc-200/60 shadow-xl shadow-zinc-950/5 dark:border-zinc-800/60">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Sign in</CardTitle>
                <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  <Video className="h-3.5 w-3.5" />
                  <span>Meet your coach in minutes</span>
                </div>
              </div>
              <CardDescription>
                Learning-only platform. Use email/password or continue with a provider.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Role */}
              <div className="mb-4">
                <Label className="mb-2 block">I’m signing in as</Label>
                <ToggleGroup
                  type="single"
                  value={role}
                  onValueChange={(v) => v && setValue("role", v as "learner" | "coach", { shouldValidate: true })}
                  className="grid grid-cols-2"
                >
                  <ToggleGroupItem value="learner" className="data-[state=on]:bg-primary/10">Learner</ToggleGroupItem>
                  <ToggleGroupItem value="coach" className="data-[state=on]:bg-primary/10">Coach</ToggleGroupItem>
                </ToggleGroup>
                {errors.role && <p className="mt-1 text-xs text-destructive">{errors.role.message as string}</p>}
              </div>

              {/* Quick modes (purely visual for now) */}
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant="secondary">DSA</Badge>
                <Badge variant="secondary">System Design</Badge>
                <Badge variant="secondary">Backend</Badge>
                <Badge variant="secondary">Cloud</Badge>
                <Badge variant="secondary">ML</Badge>
              </div>

              {/* OAuth */}
              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" className="w-full" onClick={() => alert("Google OAuth")}>
                  <Google className="mr-2 h-4 w-4" /> Google
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={() => alert("GitHub OAuth")}>
                  <Github className="mr-2 h-4 w-4" /> GitHub
                </Button>
              </div>

              <div className="my-6 flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs uppercase text-muted-foreground">or</span>
                <Separator className="flex-1" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input type="hidden" value={role} {...register("role")} />

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@learners.dev"
                      className="pl-9"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-xs text-primary underline-offset-4 hover:underline">Forgot?</a>
                  </div>
                  <div className="relative mt-1">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-9 pr-10"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 hover:bg-muted"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Use at least 8 characters. A passphrase works well (e.g., <em>“practice-daily-grow”</em>).
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <Checkbox {...register("remember")} />
                    <span>Remember me</span>
                  </label>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Video className="h-3.5 w-3.5" />
                    <span>Camera/mic used only during mock calls</span>
                  </div>
                </div>

                <Button type="submit" className={cn("w-full", loading && "cursor-wait opacity-90")} disabled={loading}>
                  {loading
                    ? (role === "learner" ? "Preparing your practice room…" : "Opening coach studio…")
                    : (role === "learner" ? "Sign in & start a mock interview" : "Sign in & coach learners")}
                </Button>

                {/* ultra-low friction demo */}
                <Button type="button" variant="ghost" className="w-full" onClick={() => alert("Start 2-min demo")}>
                  Try a 2-min demo (no account)
                </Button>
              </form>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                We’re a learning tool — not a job placement service.{" "}
                We never sell or share your practice data with employers.
              </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <p className="text-center text-sm text-muted-foreground">
                New here? <a href="#" className="text-primary underline-offset-4 hover:underline">Create an account</a>
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Encrypted at rest</span>
                <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Actionable feedback</span>
                <span className="inline-flex items-center gap-1.5"><HeartHandshake className="h-3.5 w-3.5" /> Learning-only pledge</span>
              </div>
            </CardFooter>
          </Card>
        </motion.main>
      </div>
    </div>
  );
}
function setError(arg0: null) {
  throw new Error("Function not implemented.");
}

