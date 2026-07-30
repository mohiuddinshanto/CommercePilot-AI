"use client";
import { useState } from "react";
import { FileText, RefreshCw, Sparkles } from "lucide-react";
import { useChat } from "@/features/ai/hooks/useAi";
import { useT } from "@/lib/i18n/use-t";

const templates = { product: "product description", social: "social media post", email: "customer email" } as const;
type Template = keyof typeof templates;
export default function ContentStudioPage() {
  const T = useT();
  const [template, setTemplate] = useState<Template>("product");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("confident and practical");
  const [length, setLength] = useState("medium");
  const [output, setOutput] = useState("");
  const generate = useChat();
  const prompt = `Create a ${length}-length ${templates[template]} for ${topic}. Tone: ${tone}. Use clear commerce language, an engaging opening, useful detail, and a concise call to action. Return only the finished content.`;
  const run = () => {
    if (!topic.trim()) return;
    generate.mutate({ message: prompt, model: "llama-3.1-8b-instant" }, { onSuccess: (data) => setOutput(data.assistantMessage.content) });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-violet-100 p-3 text-violet-700"><Sparkles /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{T("aiGenerator.title")}</h1>
          <p className="text-sm text-gray-500">{T("aiGenerator.subtitle")}</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              {T("aiGenerator.contentType", "Content type")}
              <select value={template} onChange={(e) => setTemplate(e.target.value as Template)} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5">
                <option value="product">{T("aiGenerator.productDescription", "Product description")}</option>
                <option value="social">{T("aiGenerator.socialPost", "Social media post")}</option>
                <option value="email">{T("aiGenerator.customerEmail", "Customer email")}</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              {T("aiGenerator.productOrTopic", "Product or topic")}
              <textarea value={topic} onChange={(e) => setTopic(e.target.value)} rows={4} placeholder={T("aiGenerator.topicPlaceholder", "e.g. breathable cotton panjabi for Eid")} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-medium text-gray-700">
                {T("aiGenerator.tone", "Tone")}
                <input value={tone} onChange={(e) => setTone(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5" />
              </label>
              <label className="text-sm font-medium text-gray-700">
                {T("aiGenerator.length", "Length")}
                <select value={length} onChange={(e) => setLength(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5">
                  <option value="short">{T("aiGenerator.short", "Short")}</option>
                  <option value="medium">{T("aiGenerator.medium", "Medium")}</option>
                  <option value="long">{T("aiGenerator.long", "Long")}</option>
                </select>
              </label>
            </div>
            <button disabled={!topic.trim() || generate.isPending} onClick={run} className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              <Sparkles className="h-4 w-4" />
              {generate.isPending ? T("aiGenerator.writing", "Writing...") : T("aiGenerator.generateContent")}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
