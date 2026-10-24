import { NextRequest, NextResponse } from "next/server";
import { validateDomainRelevance, STRICT_GUARDRAIL_REFUSAL_MESSAGE } from "@/lib/ai/guardrail";
import { PRYSM_SYSTEM_PROMPT, generateLocalVaultResponse } from "@/lib/ai/prysm-knowledge";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  apiKey?: string;
  provider?: "gemini" | "openai" | "local" | "auto";
  model?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const { messages, apiKey: clientApiKey, provider = "auto", model } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Missing messages array" }, { status: 400 });
    }

    const latestUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const userPrompt = latestUserMessage?.content || "";

    // 1. STRICT DOMAIN GUARDRAIL CHECK
    // If the query is outside PRYSM, reject immediately with zero outer information
    const guardCheck = validateDomainRelevance(userPrompt);
    if (!guardCheck.isAllowed) {
      return NextResponse.json({
        reply: STRICT_GUARDRAIL_REFUSAL_MESSAGE,
        provider: "guardrail",
        model: "PRYSM Security Filter",
        guardrailTriggered: true,
      });
    }

    // Determine API keys from client or server environment
    const geminiKey = clientApiKey || process.env.GEMINI_API_KEY || "";
    const openAiKey = clientApiKey || process.env.OPENAI_API_KEY || "";

    // If explicitly local or no API keys present, use built-in grounded engine
    if (provider === "local" || (!geminiKey && !openAiKey)) {
      const localReply = generateLocalVaultResponse(userPrompt);
      return NextResponse.json({
        reply: localReply,
        provider: "local",
        model: "PRYSM Vault Engine",
        guardrailTriggered: false,
      });
    }

    // 2. GEMINI PROVIDER (Default or specified)
    if (provider === "gemini" || (provider === "auto" && geminiKey)) {
      const selectedModel = model || "gemini-2.0-flash";
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${geminiKey}`;

        // Convert messages to Gemini format
        const contents = messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          }));

        const response = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: PRYSM_SYSTEM_PROMPT }],
            },
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1200,
            },
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          console.error("Gemini API Error:", errData);
          // Graceful fallback to local vault response with key indicator
          const localFallback = generateLocalVaultResponse(userPrompt);
          return NextResponse.json({
            reply: localFallback,
            provider: "local-fallback",
            model: "PRYSM Vault Engine (Gemini fallback)",
            note: "Gemini API key returned an error; used verified PRYSM Vault instead.",
          });
        }

        const data = await response.json();
        const candidateText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received from Gemini.";

        return NextResponse.json({
          reply: candidateText,
          provider: "gemini",
          model: selectedModel,
          guardrailTriggered: false,
        });
      } catch (err: unknown) {
        console.error("Gemini fetch exception:", err);
        const localFallback = generateLocalVaultResponse(userPrompt);
        return NextResponse.json({
          reply: localFallback,
          provider: "local-fallback",
          model: "PRYSM Vault Engine",
        });
      }
    }

    // 3. OPENAI PROVIDER
    if (provider === "openai" || (provider === "auto" && openAiKey)) {
      const selectedModel = model || "gpt-4o-mini";
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              { role: "system", content: PRYSM_SYSTEM_PROMPT },
              ...messages.map((m) => ({ role: m.role, content: m.content })),
            ],
            temperature: 0.2,
            max_tokens: 1200,
          }),
        });

        if (!response.ok) {
          const localFallback = generateLocalVaultResponse(userPrompt);
          return NextResponse.json({
            reply: localFallback,
            provider: "local-fallback",
            model: "PRYSM Vault Engine",
            note: "OpenAI API returned an error; used verified PRYSM Vault instead.",
          });
        }

        const data = await response.json();
        const reply = data?.choices?.[0]?.message?.content || "No reply from OpenAI.";

        return NextResponse.json({
          reply,
          provider: "openai",
          model: selectedModel,
          guardrailTriggered: false,
        });
      } catch (err: unknown) {
        console.error("OpenAI fetch exception:", err);
        const localFallback = generateLocalVaultResponse(userPrompt);
        return NextResponse.json({
          reply: localFallback,
          provider: "local-fallback",
          model: "PRYSM Vault Engine",
        });
      }
    }

    // Fallback to local
    return NextResponse.json({
      reply: generateLocalVaultResponse(userPrompt),
      provider: "local",
      model: "PRYSM Vault Engine",
    });
  } catch (error: unknown) {
    console.error("Chat route handler error:", error);
    return NextResponse.json(
      {
        error: "Internal server error in PRYSM chat route",
        reply: STRICT_GUARDRAIL_REFUSAL_MESSAGE,
      },
      { status: 500 }
    );
  }
}
