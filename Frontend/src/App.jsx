import { useState } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function App() {
  const [code, setCode] = useState("// Write your code here...\n");
  const [review, setReview] = useState("");

  const handleCodeChange = (value) => setCode(value);
  const handleReviewChange = (e) => setReview(e.target.value);
  const handleReviewClick = () => {
    alert("Code review triggered!");
    // Add your code review logic here
  };

  return (
    <div className="relative flex flex-col md:flex-row h-screen">
      {/* Code Editor */}
      <div className="flex-1 overflow-auto h-full">
        <Editor
          height="100%"
          language="javascript"
          value={code}
          onChange={handleCodeChange}
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>

      {/* Divider */}
      <div className="h-1 md:h-full md:w-1 bg-gray-300"></div>

      {/* Review Section */}
      <div className="flex-1 overflow-auto h-full p-4 flex flex-col">
        <textarea
          className="w-full h-1/2 p-2 border rounded resize-none mb-4"
          placeholder="Write your review..."
          value={review}
          onChange={handleReviewChange}
        />
        <div className="flex-1 overflow-auto border rounded p-2 bg-gray-50">
          <ReactMarkdown
            children={review}
            components={{
              code({ node, inline, className, children, ...props }) {
                return !inline ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language="javascript"
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-gray-200 p-1 rounded">{children}</code>
                );
              },
            }}
          />
        </div>
      </div>

      {/* Floating Review Code Button */}
      <button
        onClick={handleReviewClick}
        className="absolute bottom-4 right-4 bg-blue-600 text-white px-5 py-2 rounded shadow-lg hover:bg-blue-700 transition"
      >
        Review Code
      </button>
    </div>
  );
}

export default App;
