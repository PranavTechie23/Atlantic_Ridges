"use client";

import React from "react";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useApp } from "@/lib/context/AppContext";

interface ChatMessageContentProps {
  content: string;
  isUser: boolean;
}

function PlainText({ children }: { children: React.ReactNode }) {
  return <span className="text-[var(--text-secondary)]">{children}</span>;
}

export function ChatMessageContent({ content, isUser }: ChatMessageContentProps) {
  const { openEvidenceDrawer } = useApp();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>;
  }

  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split("\n");

    return lines.map((line, lineIdx) => {
      if (line.startsWith("### ")) {
        return (
          <h3 key={lineIdx} className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-2 mb-1">
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("#### ")) {
        return (
          <h4 key={lineIdx} className="text-xs font-semibold text-[var(--text-primary)] mt-2 mb-0.5">
            {line.replace("#### ", "")}
          </h4>
        );
      }
      if (line.trim() === "---") {
        return <hr key={lineIdx} className="border-[var(--border-subtle)] my-2" />;
      }

      const isList = line.trim().startsWith("• ") || line.trim().startsWith("- ");
      const lineContent = isList ? line.trim().replace(/^[•-]\s+/, "") : line;

      const parts: React.ReactNode[] = [];
      const regex = /(\[ev-[a-zA-Z0-9_-]+\]|\[Evidence:?\s*[a-zA-Z0-9_-]+\]|\*\*(.+?)\*\*|`[^`]+`)/g;
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(lineContent)) !== null) {
        if (match.index > lastIndex) {
          parts.push(
            <PlainText key={`t-${lineIdx}-${lastIndex}`}>{lineContent.substring(lastIndex, match.index)}</PlainText>
          );
        }

        const token = match[0];
        if (token.startsWith("[ev-") || token.includes("Evidence")) {
          const evidenceIdMatch = token.match(/ev-[a-zA-Z0-9_-]+/);
          const evidenceId = evidenceIdMatch?.[0];
          if (evidenceId) {
            parts.push(
              <button
                key={`ev-${lineIdx}-${match.index}`}
                type="button"
                onClick={() => openEvidenceDrawer(evidenceId)}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 mx-0.5 rounded bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-300 font-mono text-[11px] hover:bg-blue-500/25 cursor-pointer"
              >
                {evidenceId}
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </button>
            );
          } else {
            parts.push(<PlainText key={`ev-f-${lineIdx}-${match.index}`}>{token}</PlainText>);
          }
        } else if (token.startsWith("**") && token.endsWith("**")) {
          parts.push(
            <strong key={`b-${lineIdx}-${match.index}`} className="font-semibold text-[var(--text-primary)]">
              {token.slice(2, -2)}
            </strong>
          );
        } else if (token.startsWith("`") && token.endsWith("`")) {
          parts.push(
            <code
              key={`c-${lineIdx}-${match.index}`}
              className="px-1 py-0.5 rounded bg-[var(--surface-tertiary)] text-blue-700 dark:text-blue-300 font-mono text-[11px]"
            >
              {token.slice(1, -1)}
            </code>
          );
        } else {
          parts.push(<PlainText key={`u-${lineIdx}-${match.index}`}>{token}</PlainText>);
        }
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < lineContent.length) {
        parts.push(<PlainText key={`t-${lineIdx}-end`}>{lineContent.substring(lastIndex)}</PlainText>);
      }

      if (isList) {
        return (
          <li key={lineIdx} className="text-sm ml-4 list-disc my-0.5 leading-relaxed">
            {parts}
          </li>
        );
      }
      if (!line.trim()) {
        return <div key={lineIdx} className="h-1" />;
      }
      return (
        <p key={lineIdx} className="text-sm leading-relaxed my-0.5">
          {parts}
        </p>
      );
    });
  };

  return (
    <div className="group/msg relative">
      <div className="space-y-0.5">{renderFormattedText(content)}</div>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-2 flex items-center gap-1 text-[10px] text-[var(--text-dim)] hover:text-[var(--text-secondary)] opacity-100 sm:opacity-0 sm:group-hover/msg:opacity-100 transition-opacity"
        title="Copy"
      >
        {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
