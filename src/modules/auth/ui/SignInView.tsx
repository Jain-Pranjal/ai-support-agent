"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { LastUsedBadge } from "@/components/LastUsedBadge"
import { FaGithub } from "react-icons/fa"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Please enter a password" }),
})

const SigninView = () => {
  const [pending, setPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const session = authClient.useSession().data
  const lastMethod = authClient.getLastUsedLoginMethod()
  console.log("Last login method:", lastMethod)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    if (session) {
      router.replace("/chat")
    }
  }, [session, router])

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/chat",
      },
      {
        onRequest: () => {
          setPending(true)
          toast.loading("Signing in...", {
            id: "signin",
            duration: Infinity,
          })
        },
        onSuccess: () => {
          setPending(false)
          toast.success("Signed in successfully", {
            id: "signin",
            duration: 5000,
          })
        },
        onError: ({ error }) => {
          setPending(false)
          const errorMessage =
            error?.message ||
            error?.error?.message ||
            "An error occurred during sign-in"
          toast.error(errorMessage, {
            id: "signin",
            duration: 5000,
          })
        },
      }
    )
  }

  const onGithubSignIn = () => {
    authClient.signIn.social(
      {
        provider: "github",
        callbackURL: "/chat",
      },
      {
        onRequest: () => {
          setPending(true)
          toast.loading("Signing in...", {
            id: "signin",
            duration: Infinity,
          })
        },
        onSuccess: () => {
          setPending(false)
        },
        onError: ({ error }) => {
          setPending(false)
          const errorMessage =
            error?.message ||
            error?.error?.message ||
            "An error occurred during sign-in"
          toast.error(errorMessage, {
            id: "signin",
            duration: 5000,
          })
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Email
                {lastMethod === "email" && (
                  <LastUsedBadge className="relative mt-4" />
                )}
              </FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeIcon className="h-4 w-4" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <div className="flex justify-end">
                <Link
                  href="/forgotPassword?"
                  className="text-primary text-sm hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center">
          <div className="relative w-full">
            <Button
              type="submit"
              className="w-full"
              disabled={pending}
              variant="default"
            >
              Sign In
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                Or continue with
              </span>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full sm:w-64">
              <Button
                disabled={pending}
                type="button"
                variant="outline"
                className="flex w-full items-center justify-center gap-2"
                onClick={onGithubSignIn}
              >
                <FaGithub className="h-4 w-4" />
                GitHub
              </Button>
              {lastMethod === "github" && (
                <LastUsedBadge className="absolute -top-2 -right-2" />
              )}
            </div>
          </div>
        </div>
      </form>

      <div className="mt-4 text-center">
        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign up here
          </Link>
        </p>
      </div>

      <div className="text-muted-foreground mt-4 text-center text-xs">
        <p>
          By signing in, you agree to our{" "}
          <Link href="/t&c" className="text-muted-foreground hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="text-muted-foreground hover:underline"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </Form>
  )
}

export default SigninView
