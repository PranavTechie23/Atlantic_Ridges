"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bot, X, Send, Trash2, Settings, User, Key, Eye, EyeOff } from "lucide-react";
import { useApp } from "@/lib/context/AppContext";
import { sounds } from "@/lib/utils/sound";
import { ChatMessageContent } from "./ChatMessageContent";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  guardrailTriggered?: boolean;
}

const WELCOME_ID = "welcome-1";

const INITIAL_MESSAGES: Message[] = [
  {
    id: WELCOME_ID,
    role: "assistant",
    content: "",
    timestamp: "",
  },
];

function WelcomeMessage() {
  return (
    <div className="space-y-2">
      <p className="text-[15px] font-semibold text-[var(--text-primary)] leading-snug">How can I help?</p>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
        Ask about competitors, pricing moves, the diff engine, or evidence records. Tap a suggestion or type below.
      </p>
    </div>
  );
}

const QUICK_SUGGESTIONS = [
  { label: "Acme price hike", prompt: "Analyze Acme Cloud's +30% price hike and recommended counter-strategy." },
  { label: "NovaAI threat", prompt: "What is NovaAI's current threat score and recent product launch?" },
  { label: "AST diff engine", prompt: "How does the AST Diff Engine filter cosmetic DOM noise?" },
  { label: "Evidence SHA-256", prompt: "Show the SHA-256 evidence record for ev-acme-pricing-20261023." },
];

function toApiMessages(msgs: Message[]) {
  return msgs
    .filter((m) => m.id !== WELCOME_ID)
    .map((m) => ({ role: m.role, content: m.content }));
}

export function PrysmChatbot() {
  const { isChatOpen, closeChat, toggleChat, chatInitialPrompt, clearChatInitialPrompt } = useApp();

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [provider, setProvider] = useState<"gemini" | "openai" | "local">("local");
  const [model, setModel] = useState("gemini-2.0-flash");
  const [apiKey, setApiKey] = useState("");
  const [showKeyText, setShowKeyText] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendMessageRef = useRef<(text?: string) => Promise<void>>(async () => {});

  useEffect(() => {
    try {
      const savedKey = localStorage.getItem("prysm_ai_key") || "";
      const savedProvider = (localStorage.getItem("prysm_ai_provider") as "gemini" | "openai" | "local") || "local";
      const savedModel = localStorage.getItem("prysm_ai_model") || "gemini-2.0-flash";
      if (savedKey) setApiKey(savedKey);
      setProvider(savedProvider);
      setModel(savedModel);
    } catch {
      /* private mode */
    }
  }, []);

  const sendMessage = useCallback(
    async (textToSend?: string) => {
      const prompt = (textToSend || input).trim();
      if (!prompt || isLoading) return;

      sounds.playTick();
      setInput("");

      const userMsg: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: prompt,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const newHistory = [...messages, userMsg];
      setMessages(newHistory);
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: toApiMessages(newHistory),
            apiKey: apiKey.trim(),
            provider,
            model,
          }),
        });

        const data = await res.json();

        setMessages((prev) => [
          ...prev,
          {
            id: `resp-${Date.now()}`,
            role: "assistant",
            content: data.reply || data.error || "No response received.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            guardrailTriggered: Boolean(data.guardrailTriggered),
          },
        ]);
        sounds.playSuccess();
      } catch (err) {
        console.error("Chat error:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: "Could not reach the chat service. Try **PRYSM Vault** mode in settings (no API key).",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey, input, isLoading, messages, model, provider]
  );

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  useEffect(() => {
    if (!chatInitialPrompt || !isChatOpen) return;
    const prompt = chatInitialPrompt;
    clearChatInitialPrompt();
    void sendMessageRef.current(prompt);
  }, [chatInitialPrompt, isChatOpen, clearChatInitialPrompt]);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen, isLoading]);

  const handleSaveSettings = () => {
    try {
      localStorage.setItem("prysm_ai_key", apiKey.trim());
      localStorage.setItem("prysm_ai_provider", provider);
      localStorage.setItem("prysm_ai_model", model);
      sounds.playSuccess();
      setShowSettings(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const clearChat = () => {
    sounds.playTick();
    setMessages(INITIAL_MESSAGES);
  };

  const providerLabel =
    provider === "local" ? "Vault" : provider === "gemini" ? `Gemini · ${model}` : `OpenAI · ${model}`;

  const showSuggestions = messages.length === 1 && messages[0]?.id === WELCOME_ID && !isLoading;

  return (
    <>
      {!isChatOpen && (
        <button
          type="button"
          onClick={() => {
            sounds.playChirp();
            toggleChat();
          }}
          className="no-print print:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-linear-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center cursor-pointer ring-4 ring-[var(--surface-primary)]"
          title="Open PRYSM Copilot (Ctrl+J)"
        >
          <Bot className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0b0d13]" />
        </button>
      )}

      {isChatOpen && (
        <div className="no-print print:hidden fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col w-[min(100vw-2rem,380px)] h-[min(100vh-2rem,520px)] bg-[var(--surface-primary)] backdrop-blur-xl border border-[var(--border-subtle)] rounded-2xl shadow-[var(--card-shadow),0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--surface-secondary)] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">PRYSM Copilot</h3>
                <p className="text-[11px] text-[var(--text-muted)] truncate">{providerLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => {
                  sounds.playTick();
                  setShowSettings((s) => !s);
                }}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  showSettings
                    ? "bg-blue-500/15 text-blue-600 dark:text-blue-300"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)]"
                }`}
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={clearChat}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)] transition-colors cursor-pointer"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playTick();
                  closeChat();
                }}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showSettings && (
            <div className="px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--surface-secondary)] space-y-3 shrink-0 text-xs">
              <p className="text-[var(--text-secondary)] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-blue-400" />
                Provider (saved in this browser)
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: "local" as const, title: "Vault", sub: "No key" },
                    { id: "gemini" as const, title: "Gemini", sub: "Google" },
                    { id: "openai" as const, title: "OpenAI", sub: "GPT" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setProvider(opt.id);
                      if (opt.id === "gemini") setModel("gemini-2.0-flash");
                      if (opt.id === "openai") setModel("gpt-4o-mini");
                    }}
                    className={`py-2 rounded-lg border text-center transition-colors cursor-pointer ${
                      provider === opt.id
                        ? "border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-200"
                        : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <div className="font-medium">{opt.title}</div>
                    <div className="text-[9px] opacity-70">{opt.sub}</div>
                  </button>
                ))}
              </div>
              {provider !== "local" && (
                <>
                  <div className="relative">
                    <input
                      type={showKeyText ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={provider === "gemini" ? "Gemini API key (optional if set on server)" : "OpenAI API key"}
                      className="w-full bg-[var(--surface-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 pr-9 text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKeyText((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1"
                    >
                      {showKeyText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-[var(--surface-primary)] border border-[var(--border-subtle)] rounded-lg px-2 py-2 text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                  >
                    {provider === "gemini" ? (
                      <>
                        <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                        <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                        <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                      </>
                    ) : (
                      <>
                        <option value="gpt-4o-mini">gpt-4o-mini</option>
                        <option value="gpt-4o">gpt-4o</option>
                      </>
                    )}
                  </select>
                </>
              )}
              <button
                type="button"
                onClick={handleSaveSettings}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium cursor-pointer"
              >
                Save
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 ${
                      isUser
                        ? "bg-blue-600 text-white rounded-br-md"
                        : m.guardrailTriggered
                          ? "bg-amber-500/10 border border-amber-500/35 rounded-bl-md"
                          : "bg-[var(--surface-secondary)] border border-[var(--border-subtle)] rounded-bl-md"
                    }`}
                  >
                    {m.guardrailTriggered && (
                      <p className="text-[11px] font-medium text-amber-700 dark:text-amber-400 mb-1.5">Off-topic question</p>
                    )}
                    {m.id === WELCOME_ID ? (
                      <WelcomeMessage />
                    ) : (
                      <ChatMessageContent content={m.content} isUser={isUser} />
                    )}
                    {m.timestamp ? (
                      <p className={`text-[10px] mt-1.5 ${isUser ? "text-blue-100/80" : "text-[var(--text-dim)]"}`}>
                        {m.timestamp}
                      </p>
                    ) : null}
                  </div>
                  {isUser && (
                    <div className="w-7 h-7 rounded-lg bg-[var(--surface-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2 items-center pl-9">
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showSuggestions && (
            <div className="px-3 pb-2 flex flex-wrap gap-2 shrink-0">
              {QUICK_SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => void sendMessage(s.prompt)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--surface-tertiary)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--surface-secondary)] shrink-0">
            <div className="flex gap-2 items-end">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about competitors or evidence…"
                disabled={isLoading}
                className="flex-1 resize-none bg-[var(--surface-primary)] border border-[var(--border-subtle)] focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:outline-none min-h-[42px] max-h-28"
              />
              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-[var(--text-dim)] mt-1.5 text-center">Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      )}
    </>
  );
}
