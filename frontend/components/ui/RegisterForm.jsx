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

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [responseMessage, setResponseMessage] = useState(null);
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const response = await instance.post("/auth/register", {
        email: data.email,
        password: data.password,
        username: data.username,
      });
      setResponseMessage({ type: "success", message: response.data.message });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      if (error.response) {
        const errorResponse = error.response.data;
        if (errorResponse.error === "Email already exists") {
          setResponseMessage({
            type: "error",
            message: "Email already exists",
          });
        } else if (errorResponse.error === "Username already exists") {
          setResponseMessage({
            type: "error",
            message: "Username already exists",
          });
        } else if (Array.isArray(errorResponse.error)) {
          // Handle validation errors
          const errorMessage = errorResponse.error
            .map((err) => err.message)
            .join(", ");
          setResponseMessage({ type: "error", message: errorMessage });
        } else if (
          errorResponse.error === "Password does not meet requirements"
        ) {
          setResponseMessage({
            type: "error",
            message: "Password does not meet requirements",
          });
        } else {
          setResponseMessage({ type: "error", message: "Registration failed" });
        }
      } else {
        console.error("Error occurred:", error.message);
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
            <CardTitle>Register</CardTitle>
            <CardDescription>Create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    {...register("username", {
                      required: "Username is required",
                    })}
                  />
                  {errors.username && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        {errors.username.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
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
                        value: 6, // Adjusted to match the backend requirement
                        message: "Password must be at least 6 characters",
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
                    responseMessage.type === "success"
                      ? "success"
                      : "destructive"
                  }
                >
                  <AlertDescription>{responseMessage.message}</AlertDescription>
                </Alert>
              )}
              <CardFooter className="flex justify-between mt-4">
                <Button type="submit">Register</Button>
                <Link href="/login">
                  <p className="hover:underline">Already have an account?</p>
                </Link>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
