import { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function App() {
  const [code, setCode] = useState("// Write your code here...\n");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false); // new loading state

  async function reviewCode() {
    setLoading(true);      // start loading
    setReview("");         // clear previous review
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", { code });
      setReview(response.data);
    } catch (err) {
      console.error(err);
      setReview("❌ Error fetching AI review. Check console.");
    } finally {
      setLoading(false);   // stop loading
    }
  }

  return (
    <main className="flex h-screen bg-gray-900 text-white font-sans">
      
      {/* Left Panel - Code Editor */}
      <div className="relative w-1/2 border-r border-gray-700 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">📝 Code Editor</h1>

        <div className="flex-1 bg-gray-800 rounded-lg shadow-inner overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue={code}
            theme="vs-dark"
            onChange={(value) => setCode(value)}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        </div>

        {/* Review Button */}
        <div className="absolute bottom-6 right-6">
          <button
            onClick={reviewCode}
            className={`px-6 py-2 rounded-lg shadow-lg font-medium transition-colors
              ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            disabled={loading} // prevent multiple clicks
          >
            {loading ? "Analyzing..." : "Review Code"}
          </button>
        </div>
      </div>

      {/* Right Panel - AI Review */}
      <div className="w-1/2 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">🤖 AI Review</h1>

        <div className="flex-1 bg-gray-800 rounded-lg p-4 shadow-inner overflow-auto">
          {/* Show intro text only if review is empty and not loading */}
          {!review && !loading && (
            <p className="text-gray-400 mb-4">
              The AI-generated review will appear here. It will provide feedback on syntax, best practices, performance, and potential improvements.
            </p>
          )}

          {/* Show loading text */}
          {loading && (
            <p className="text-yellow-400 mb-4 animate-pulse">Analyzing your code… 🧠</p>
          )}

          {/* Render Markdown review */}
          {review && !loading && (
            <ReactMarkdown
              children={review}
              components={{
                code({ node, inline, className, children, ...props }) {
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
