import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import instance from "@/lib/axios-instance";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [responseMessage, setResponseMessage] = useState(null);
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const response = await instance.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      if (response.data.token) {
        // Save the token to localStorage or cookie (depending on your auth strategy)
        localStorage.setItem("token", response.data.token);

        // Check user role and redirect accordingly
        const userRole = response.data.role; // Assuming the role is included in the response
        if (userRole === "admin") {
          router.push("/analytics");
        } else if (userRole === "user") {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setResponseMessage({
          type: "error",
          message: error.response.data.error,
        });
      } else {
        setResponseMessage({ type: "error", message: "Something went wrong!" });
      }
    }
  };

  return (
    <div>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold"> VideoToBlogAI</span>
            </div>
            <div className="flex items-center">
              <Link href="/">
                <Button>Home Page</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex justify-center items-center h-screen">
        <Card className="w-[450px]">
          <CardHeader className="text-center">
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your email and password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        {errors.email.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                  />
                  {errors.password && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        {errors.password.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
              {responseMessage && (
                <Alert
                  variant={
                    responseMessage.type === "error" ? "destructive" : "success"
                  }
                >
                  <AlertDescription>{responseMessage.message}</AlertDescription>
                </Alert>
              )}
              <CardFooter className="flex justify-between mt-4">
                <Button type="submit">Login</Button>
                <Link href="/register">
                  <p className="hover: underline">Need an account?</p>
                </Link>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
