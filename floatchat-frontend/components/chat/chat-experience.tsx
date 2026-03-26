"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Bot, Sparkles, User2 } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const starterMessages: Message[] = [
  {
    id: "assistant-1",
    role: "assistant",
    content:
      "Ask about float distribution, profile recency, regional coverage, or upload status. This workspace is ready for the backend query layer.",
  },
];

export function ChatExperience() {
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "FloatChatAI response placeholder: connect this panel to your live `/query` endpoint when you want RAG-backed answers.",
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setInput("");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
      <GlassCard className="flex min-h-[72vh] flex-col overflow-hidden">
        <div className="border-b border-white/10 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/65">AI workspace</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Ocean intelligence chat</h2>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((message, index) => {
            const isUser = message.role === "user";
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-[26px] border px-4 py-4 ${
                    isUser
                      ? "border-cyan-300/25 bg-cyan-300/12 text-white"
                      : "border-white/10 bg-white/[0.045] text-white/80"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/45">
                    {isUser ? <User2 className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                    {isUser ? "Operator" : "FloatChatAI"}
                  </div>
                  <p className="leading-7">{message.content}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-white/10 px-5 py-4">
          <div className="flex items-end gap-3 rounded-[28px] border border-white/10 bg-white/[0.045] p-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about float coverage, profile trends, or upload results..."
              className="min-h-[72px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/35"
            />
            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-cyan-300 to-teal-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              <span className="flex items-center gap-2">
                Send
                <ArrowUp className="h-4 w-4" />
              </span>
            </button>
          </div>
        </form>
      </GlassCard>

      <div className="space-y-6">
        <GlassCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/[0.06] p-3 text-cyan-100">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/65">Suggested prompts</p>
              <h3 className="mt-2 text-lg font-semibold text-white">Ask sharper questions</h3>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm text-white/70">
            {[
              "Which floats were updated most recently?",
              "Summarize the latest profiles near the Arabian Sea.",
              "How many profiles belong to each project?",
              "What changed after the last NetCDF upload?",
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition hover:border-cyan-300/20 hover:bg-cyan-300/10 hover:text-white"
              >
                {prompt}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
