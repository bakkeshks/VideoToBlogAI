import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import instance from "@/lib/axios-instance";
import { Button } from "@/components/ui/button";
import SyntaxHighlighter from "@/components/ui/SyntaxHighlighter";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

export default function ViewPost() {
  const router = useRouter();
  const { id } = router.query;
  const [userData, setUserData] = useState({
    userName: "",
    secondsRemaining: 0,
  });
  const [postContent, setPostContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [tableOfContents, setTableOfContents] = useState([]);
  const [sentiment, setSentiment] = useState("Neutral");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await instance.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserData({
          userName: response.data.userName,
          secondsRemaining: response.data.secondsRemaining,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setError("Failed to fetch dashboard data");
        router.push("/login");
      }
    };

    fetchDashboardData();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await instance.get(`/posts/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const fetchedContent = response.data.text || "";
          setPostContent(fetchedContent);
          updateContentStats(fetchedContent);
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to fetch post data", error);
          setError("Failed to fetch post data");
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [id]);

  const updateContentStats = (content) => {
    const words = content.trim().split(/\s+/);
    setWordCount(words.length);
    setCharCount(content.length);

    // Extract headings for table of contents
    const headings = content.match(/^#{1,6}\s.+$/gm) || [];
    setTableOfContents(
      headings.map((heading) => ({
        level: heading.match(/^#+/)[0].length,
        text: heading.replace(/^#+\s/, ""),
      }))
    );

    // Simple sentiment analysis
    const positiveWords = [
      "good",
      "great",
      "excellent",
      "amazing",
      "wonderful",
    ];
    const negativeWords = ["bad", "awful", "terrible", "horrible", "poor"];
    const lowercaseContent = content.toLowerCase();
    const positiveCount = positiveWords.reduce(
      (count, word) =>
        count + (lowercaseContent.match(new RegExp(word, "g")) || []).length,
      0
    );
    const negativeCount = negativeWords.reduce(
      (count, word) =>
        count + (lowercaseContent.match(new RegExp(word, "g")) || []).length,
      0
    );

    if (positiveCount > negativeCount) {
      setSentiment("Positive");
    } else if (negativeCount > positiveCount) {
      setSentiment("Negative");
    } else {
      setSentiment("Neutral");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleContentChange = (event) => {
    const newContent = event.target.value;
    setPostContent(newContent);
    updateContentStats(newContent);
  };

  const saveContent = async () => {
    try {
      await instance.patch(
        `/posts/${id}`,
        { text: postContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Content saved successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving data:", error);
      setError("Failed to save content. Please try again.");
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  if (error) {
    return (
      <div className="text-red-500 font-bold text-center mt-4">{error}</div>
    );
  }

  if (isLoading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold"> VideoToBlogAI</h1>
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

      <main className="container mx-auto mt-8 p-4 flex relative">
        <div className="w-3/4 pr-8">
          {isEditing ? (
            <>
              <textarea
                value={postContent}
                onChange={handleContentChange}
                className="w-full h-96 p-2 border rounded"
              />
              <Button onClick={saveContent} className="mt-4 mr-2">
                Save
              </Button>
              <Button onClick={toggleEditMode} className="mt-4">
                Cancel
              </Button>
            </>
          ) : (
            <>
              <div className="prose max-w-none">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter language={match[1]}>
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    h1: ({ node, ...props }) => (
                      <h1 className="text-4xl font-bold my-8" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-3xl font-bold my-6" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-2xl font-bold my-4" {...props} />
                    ),
                    h4: ({ node, ...props }) => (
                      <h4 className="text-xl font-bold my-4" {...props} />
                    ),
                    h5: ({ node, ...props }) => (
                      <h5 className="text-lg font-bold my-2" {...props} />
                    ),
                    h6: ({ node, ...props }) => (
                      <h6 className="text-base font-bold my-2" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="my-2" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside my-2" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal list-inside my-2"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="ml-4" {...props} />
                    ),
                  }}
                >
                  {postContent}
                </ReactMarkdown>
              </div>
            </>
          )}
        </div>
        <div className="w-1/4 bg-white p-4 rounded shadow-md sticky top-4 self-start max-h-screen overflow-y-auto">
          <Button onClick={toggleEditMode} className="w-full mb-4">
            {isEditing ? "Cancel Edit" : "Edit Post"}
          </Button>
          <div className="mb-4">
            <h3 className="font-bold mb-2">Content Stats</h3>
            <p>Word Count: {wordCount}</p>
            <p>Character Count: {charCount}</p>
            <p>Sentiment: {sentiment}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-bold mb-2">Table of Contents</h3>
            <ul className="list-none">
              {tableOfContents.map((heading, index) => (
                <li
                  key={index}
                  className={`ml-${(heading.level - 1) * 4} text-sm mb-1`}
                >
                  {heading.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
