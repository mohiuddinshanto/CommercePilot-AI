"use client";

import { useState } from "react";
import { generateContent } from "@/features/ai/api/ai.api";
import { Sparkles, Copy, Check, RotateCcw, PenTool, Layout, FileText, Share2, Mail } from "lucide-react";
import toast from "react-hot-toast";

type ContentType = "product_description" | "social_post" | "blog_outline" | "email_newsletter";
type ToneType = "professional" | "friendly" | "casual" | "excited" | "persuasive";
type LengthType = "short" | "medium" | "long";

export default function AIContentGeneratorPage() {
  const [contentType, setContentType] = useState<ContentType>("product_description");
  const [titleOrKeywords, setTitleOrKeywords] = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");
  const [tone, setTone] = useState<ToneType>("persuasive");
  const [length, setLength] = useState<LengthType>("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!titleOrKeywords.trim()) {
      toast.error("Please enter a title or keywords.");
      return;
    }

    setIsLoading(true);
    setResult("");
    try {
      const response = await generateContent({
        contentType,
        titleOrKeywords: titleOrKeywords.trim(),
        keyFeatures: keyFeatures.trim() || undefined,
        tone,
        length,
      });
      setResult(response.content);
      toast.success("Content generated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate content.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy content.");
    }
  };

  // Helper icons for content types
  const getIcon = (type: ContentType) => {
    switch (type) {
      case "product_description":
        return <Layout className="h-5 w-5 text-indigo-500" />;
      case "social_post":
        return <Share2 className="h-5 w-5 text-sky-500" />;
      case "blog_outline":
        return <FileText className="h-5 w-5 text-emerald-500" />;
      case "email_newsletter":
        return <Mail className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-100 text-blue-700">
          <PenTool className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Copywriter & Content Generator</h1>
          <p className="text-sm text-gray-500">
            Generate high-converting product copies, social media captions, SEO articles, and newsletter drafts in seconds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Panel */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Content Template <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "product_description", label: "Product Info", icon: "product_description" },
                  { id: "social_post", label: "Social Caption", icon: "social_post" },
                  { id: "blog_outline", label: "SEO Outline", icon: "blog_outline" },
                  { id: "email_newsletter", label: "Newsletter", icon: "email_newsletter" },
                ] as const
              ).map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setContentType(tpl.id)}
                  className={`flex items-center gap-2 p-3 text-sm font-medium rounded-lg border text-left transition-all ${
                    contentType === tpl.id
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-gray-200 hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  {getIcon(tpl.icon)}
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="titleOrKeywords" className="block text-sm font-semibold text-gray-700 mb-1">
              Title or Primary Keywords <span className="text-red-500">*</span>
            </label>
            <input
              id="titleOrKeywords"
              type="text"
              required
              value={titleOrKeywords}
              onChange={(e) => setTitleOrKeywords(e.target.value)}
              placeholder={
                contentType === "product_description"
                  ? "e.g. Premium Cotton Panjabi, Summer Polo Shirt"
                  : contentType === "social_post"
                  ? "e.g. Eid-ul-Adha Discount Sale Launch"
                  : contentType === "blog_outline"
                  ? "e.g. How to scale your e-commerce operations in Bangladesh"
                  : "e.g. Monthly Stock Clearance Event"
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="keyFeatures" className="block text-sm font-semibold text-gray-700 mb-1">
              Key Features or Highlights (Optional)
            </label>
            <textarea
              id="keyFeatures"
              rows={3}
              value={keyFeatures}
              onChange={(e) => setKeyFeatures(e.target.value)}
              placeholder="e.g. - 100% fine cotton fabric&#10;- Slim fit design with traditional embroidery&#10;- Handcrafted buttons&#10;- 15% discount for first 50 customers"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="tone" className="block text-sm font-semibold text-gray-700 mb-1">
                Tone of Voice
              </label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value as ToneType)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="persuasive">Persuasive</option>
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="casual">Casual</option>
                <option value="excited">Excited</option>
              </select>
            </div>

            <div>
              <label htmlFor="length" className="block text-sm font-semibold text-gray-700 mb-1">
                Content Length
              </label>
              <select
                id="length"
                value={length}
                onChange={(e) => setLength(e.target.value as LengthType)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="short">Short (~100w)</option>
                <option value="medium">Medium (~300w)</option>
                <option value="long">Long (~600w)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            {isLoading ? "Generating Draft..." : "Generate Content"}
          </button>
        </form>

        {/* Right Output Panel */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col min-h-[460px]">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Draft Output</span>
            {result && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={() => handleGenerate()}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  title="Regenerate with same settings"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Regenerate
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 rounded-lg bg-slate-50 p-4 border border-gray-100 overflow-y-auto max-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full py-16 space-y-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                <p className="text-sm text-gray-500 font-medium">Crafting your content using AI...</p>
              </div>
            ) : result ? (
              <div className="prose prose-sm text-gray-800 max-w-none space-y-4 whitespace-pre-wrap font-sans leading-relaxed">
                {result}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20 text-gray-400">
                <Sparkles className="h-10 w-10 text-gray-300 mb-3" />
                <p className="text-sm font-medium">No content generated yet.</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Fill in the options on the left and click &ldquo;Generate Content&rdquo; to draft your copywriting.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
