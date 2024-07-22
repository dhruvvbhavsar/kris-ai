"use client";
import LoadingDots from "@/components/LoadingDots";
import ResizablePanel from "@/components/ResizablePanel";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import { useCompletion } from "ai/react";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("");
  async function handleSubmit() {
    setResult("")
    setIsLoading(true);
    const response = await fetch("/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setResult((prev) => prev + chunkValue);
    }
    setIsLoading(false)
  }
  return (
    <div className="sm:flex mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Krishna AI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-4xl font-bold text-slate-900">
          What have you come to seek, My dear child?
        </h1>
        <div className="max-w-xl mt-4 w-full">
          <textarea
            rows={4}
            value={input}
            maxLength={200}
            onChange={(e) => setInput(e.target.value)}
            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-basecd shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={`Type your question here...\neg: Why do I keep chasing after money?`}
          />
          {!isLoading ? (
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={input.length < 8}
              className="bg-black rounded-xl disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium px-4 py-2 sm:mt-10 mt-8  w-full"
            >
              Ask
            </button>
          ) : (
            <>
              <button
                className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                disabled={input.length < 8}
              >
                <LoadingDots color="white" style="large" />
              </button>
            </>
          )}
        </div>
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
              {result && (
                <>
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mx-auto text-center">
                      Hare Krishna
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center mx-4">
                    <div className="bg-white rounded-xl shadow-md p-4 w-full overflow-y-auto">
                      <p className="text-sm text-pretty text-left">{result}</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>

        <div className="text-center p-4">
          <p className="font-serif font-semibold">Made by Dhruvv Bhavsar</p>
          <span className="font-mono">With Love🙏</span>
        </div>
      </main>
    </div>
  );
}
