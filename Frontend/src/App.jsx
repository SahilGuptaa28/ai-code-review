import { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function App() {
  const [code, setCode] = useState("// Write your code here...\n");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  // Use Vercel environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://ai-code-review-0838.onrender.com";


  async function reviewCode() {
    setLoading(true);
    setReview("");
    try {
      const response = await axios.post(`${BACKEND_URL}/ai/get-review`, { code });
      setReview(response.data);
    } catch (err) {
      console.error(err);
      setReview("❌ Error fetching AI review. Check console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-white font-sans overflow-y-auto md:overflow-hidden">

{/* Left Panel — Code Editor */}
<div className="w-full md:w-1/2 flex flex-col min-h-[80vh] md:h-screen p-3 sm:p-4 md:p-6 border-r border-gray-700
            overflow-auto">
  {/* Heading */}
  <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
    📝 Code Editor
  </h1>

  {/* Editor Container */}
  <div className="bg-gray-800 rounded-lg shadow-inner overflow-auto  h-[600px] md:flex-1">
    <Editor
      height="100%"  
      width="100%"
      language="javascript"
      value={code}
      theme="vs-dark"
      onChange={(value) => setCode(value)}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        wordWrap: "on",
        automaticLayout: true,
        accessibilitySupport: "off",
        tabSize: 2,
        smoothScrolling: true,
        scrollbar: { vertical: "auto" },
      }}
    />
  </div>

  {/* Button */}
  <div className="flex justify-end mt-4">
    <button
      onClick={reviewCode}
      className={`px-5 sm:px-6 py-2 rounded-lg shadow-lg font-medium transition-colors
        ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
      disabled={loading}
    >
      {loading ? "Analyzing..." : "Review Code"}
    </button>
  </div>
</div>



      {/* Right Panel — AI Review */}
      <div className="w-full md:w-1/2 p-3 sm:p-4 md:p-6 flex flex-col min-h-[80vh] md:h-screen overflow-y-auto">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">🤖 AI Review</h1>

        <div className="flex-1 bg-gray-800 rounded-lg p-4 shadow-inner overflow-y-auto">
          {!review && !loading && (
            <p className="text-gray-400 mb-4 text-sm sm:text-base">
              The AI-generated review will appear here. It will provide feedback on syntax, best practices, performance, and potential improvements.
            </p>
          )}

          {loading && (
            <p className="text-yellow-400 mb-4 animate-pulse text-sm sm:text-base">Analyzing your code… 🧠</p>
          )}

          {review && !loading && (
            <ReactMarkdown
              children={review}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            />
          )}
        </div>
      </div>

    </main>
  );
}

export default App;
