import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import instance from "@/lib/axios-instance";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 5;

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await instance.get("/dashboard", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserData({
          ...response.data,
          generatedBlogPosts: response.data.generatedBlogPosts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ),
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        router.push("/login");
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleView = (id) => {
    router.push(`/viewpost/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserData((prevData) => ({
        ...prevData,
        generatedBlogPosts: prevData.generatedBlogPosts.filter(
          (post) => post.id !== id
        ),
      }));
    } catch (error) {
      console.error("Failed to delete blog post", error);
    }
  };

  if (!userData) return <div>Loading...</div>;

  const totalPages = Math.ceil(
    userData.generatedBlogPosts.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPosts = userData.generatedBlogPosts.slice(startIndex, endIndex);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
          <h1 className="text-2xl font-bold"> VideoToBlogAI</h1>
          <div className="flex items-center space-x-4">
            <span>
              <b>
                Credits Remaining: {userData.secondsRemaining.toFixed(2)}{" "}
                seconds
              </b>
            </span>
            <span>Welcome! {userData.userName}</span>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Video/Audio</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/addvideo" passHref>
                    <Button className="w-full">Upload Media</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Generated Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="hover:bg-gray-100">
                    <TableHead className="py-2">SL No.</TableHead>
                    <TableHead className="py-2">ID</TableHead>
                    <TableHead className="py-2">Text</TableHead>
                    <TableHead className="py-2">Created At</TableHead>
                    <TableHead className="py-2">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPosts.map((post, index) => (
                    <TableRow key={post.id} className="hover:bg-gray-100">
                      <TableCell className="py-2">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="py-2">{post.id}</TableCell>
                      <TableCell className="py-2">
                        {post.text.substring(0, 20)}...
                      </TableCell>
                      <TableCell className="py-2">{post.createdAt}</TableCell>
                      <TableCell className="py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          onClick={() => handleView(post.id)}
                        >
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={
                        currentPage > 1
                          ? `/dashboard?page=${currentPage - 1}`
                          : undefined
                      }
                      onClick={() => {
                        if (currentPage > 1) {
                          setCurrentPage((prev) => Math.max(prev - 1, 1));
                        }
                      }}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </PaginationPrevious>
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href={`/dashboard?page=${i + 1}`}
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href={
                        currentPage < totalPages
                          ? `/dashboard?page=${currentPage + 1}`
                          : undefined
                      }
                      onClick={() => {
                        if (currentPage < totalPages) {
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          );
                        }
                      }}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
