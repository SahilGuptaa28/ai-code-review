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

  async function reviewCode() {
    setLoading(true);
    setReview("");
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", { code });
      setReview(response.data);
    } catch (err) {
      console.error(err);
      setReview("❌ Error fetching AI review. Check console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    // **RESPONSIVENESS CHANGE 1: Main container for stacking on small screens**
    // On small screens (mobile, default), use flex-col (vertical stack).
    // On medium screens (md:), switch to flex-row (horizontal split).
    <main className="flex flex-col md:flex-row h-screen bg-gray-900 text-white font-sans overflow-y-auto md:overflow-hidden">
      
      {/* Left Panel - Code Editor */}
      {/* **RESPONSIVENESS CHANGE 2: Panel sizing and height** */}
      {/* Full width on mobile (w-full), half-width on desktop (md:w-1/2). */}
      {/* Use h-2/3 on mobile to give space to the review panel below, h-full on desktop. */}
      <div className="relative w-full md:w-1/2 md:border-r border-gray-700 p-4 md:p-6 flex flex-col h-2/3 md:h-full">
        <h1 className="text-xl md:text-2xl font-bold mb-4">📝 Code Editor</h1>

        {/* Editor container needs flex-1 to occupy remaining height */}
        <div className="flex-1 bg-gray-800 rounded-lg shadow-inner overflow-hidden min-h-[150px] md:min-h-0">
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

        {/* Review Button - fixed position on desktop, sticky/relative on mobile */}
        {/* **RESPONSIVENESS CHANGE 3: Button position** */}
        {/* Make the button static/relative on mobile to keep it in the flow, absolute on desktop. */}
        <div className="flex justify-end mt-4 md:absolute bottom-6 right-6 z-10">
          <button
            onClick={reviewCode}
            className={`px-6 py-2 rounded-lg shadow-lg font-medium transition-colors
              ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Review Code"}
          </button>
        </div>
      </div>

      {/* Right Panel - AI Review */}
      {/* **RESPONSIVENESS CHANGE 4: Panel sizing and height** */}
      {/* Full width on mobile (w-full), half-width on desktop (md:w-1/2). */}
      {/* Use h-1/3 on mobile (or flex-1 to fill the rest), h-full on desktop. */}
      <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col h-1/3 md:h-full flex-1">
        <h1 className="text-xl md:text-2xl font-bold mb-4">🤖 AI Review</h1>

        {/* Review Output container needs flex-1 to occupy remaining height */}
        <div className="flex-1 bg-gray-800 rounded-lg p-4 shadow-inner overflow-y-auto">
          
          {/* Content remains the same... */}
          {!review && !loading && (
            <p className="text-gray-400 mb-4">
              The AI-generated review will appear here. It will provide feedback on syntax, best practices, performance, and potential improvements.
            </p>
          )}

          {loading && (
            <p className="text-yellow-400 mb-4 animate-pulse">Analyzing your code… 🧠</p>
          )}

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