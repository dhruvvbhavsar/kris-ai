"use client";
import LoadingDots from "@/components/LoadingDots";
import ResizablePanel from "@/components/ResizablePanel";
import { useCompletion } from "ai/react";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const { isLoading, input, setInput, handleSubmit, completion } =
    useCompletion({
      api: "/api/chat",
    });
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
              disabled={input.length < 4}
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
              {completion ? (
                <>
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mx-auto text-center">
                      Hare Krishna
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center mx-4">
                    <div className="bg-white rounded-xl shadow-md p-4 w-full overflow-y-auto">
                      <div className="text-sm text-pretty text-left">
                        <ReactMarkdown>{completion}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
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
