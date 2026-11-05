import { useState } from "react";

export default function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button
      onClick={onClick}
      className="btn-ghost"
      aria-label={label}
      style={{
        fontSize: "0.78rem",
        padding: "2px 10px",
        color: copied ? "#2d6a2d" : "var(--dp-color-annotation)",
        borderColor: copied ? "#4a9a4a" : "rgba(52,76,105,0.4)",
        background: copied ? "rgba(45,106,45,0.07)" : "transparent",
        transition: "all 150ms",
      }}
    >
      {copied ? "✓ Copied!" : `📋 ${label}`}
    </button>
  );
}
