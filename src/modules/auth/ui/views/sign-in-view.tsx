"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Github, Chrome as Google, } from "lucide-react";
import Link from "next/link";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});
type FormValues = z.infer<typeof formSchema>;

export default function SignInView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema), mode: "onTouched" });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("Submitting", data);
    setLoading(true);
    
  //   authClient.signIn.email({email: data.email, password: data.password},
  //     {
  //   onSuccess: () => router.push("/home"),
  //   onError: (error) => console.error("Sign-in error:", error),
  // }
  //   );

    try {
      // Replace with your real auth logic
      await new Promise((r) => setTimeout(r, 1000));
      console.log("Signed in:", data);
      router.push("/sign-up");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="w-[360px] border border-border/40 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Amplithink-AI</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Sign in to continue your AI interview practice
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" className="pl-9" {...register("email")} />
                </div>
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
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
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
              </div>

              <Button type="submit" disabled={loading} className={cn("w-full", loading && "opacity-80 cursor-wait")}>
                {loading ? "Signing in..." : "Sign in"}
              </Button> 
            </form>

            <div className="my-5 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">or continue with</span>
              <Separator className="flex-1" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" onClick={() => alert("Google OAuth")}>
                <Google className="mr-2 h-4 w-4" /> Google
              </Button>
              <Button type="button" variant="outline" onClick={() => alert("GitHub OAuth")}>
                <Github className="mr-2 h-4 w-4" /> GitHub
              </Button>
            </div>
          </CardContent> 
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Create a new account?{" "}
              <Link href="/sign-up" className="text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>

        </Card>
      </motion.div>
    </div>
  );
}
