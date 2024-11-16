import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/stackoverflow-dark.css";

const SyntaxHighlighter = ({ children, language }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [children, language]);

  return (
    <pre>
      <code ref={codeRef} className={`language-${language}`}>
        {children}
      </code>
    </pre>
  );
};

export default SyntaxHighlighter;
