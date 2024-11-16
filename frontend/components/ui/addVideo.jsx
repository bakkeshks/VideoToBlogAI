import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import instance from "@/lib/axios-instance";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AddContent() {
  const [userData, setUserData] = useState({
    userName: "",
    secondsRemaining: 0,
  });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const router = useRouter();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await instance.get("/dashboard", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserData({
          userName: response.data.userName,
          secondsRemaining: response.data.secondsRemaining,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        router.push("/login");
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({
        type: "error",
        content: "Please upload a video or audio file.",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", content: "" });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await instance.post("/upload/addvideo", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage({ type: "success", content: response.data.message });
    } catch (error) {
      setMessage({
        type: "error",
        content: error.response?.data?.error || "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold"> VideoToBlogAI</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
          <span>
            <b>
              Credits Remaining: {userData.secondsRemaining.toFixed(2)} seconds
            </b>
          </span>
          <span>Welcome! {userData.userName}</span>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main className="container mx-auto mt-8 p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">
              Upload Video or Audio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center justify-center space-y-2">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="video/*,audio/*"
                  ref={fileInputRef}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  variant="outline"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Select Video/Audio
                </Button>
                {file && <span className="text-sm">{file.name}</span>}
              </div>
              <div className="flex justify-center">
                <Button type="submit" disabled={isLoading || !file}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Blog Post"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-500">
            <b>Upload file size limit is 30MB and length is 10 minutes</b>
          </CardFooter>
        </Card>

        {message.content && (
          <Alert
            className={`mt-4 max-w-md mx-auto ${
              message.type === "error" ? "bg-red-100" : "bg-green-100"
            }`}
          >
            <AlertTitle>
              {message.type === "error" ? "Error" : "Success"}
            </AlertTitle>
            <AlertDescription>{message.content}</AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
}
