import OpenAI from "openai";
import { OpenAIStream } from "ai";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  throw new Error(
    "Please link a Vercel KV instance or populate `KV_REST_API_URL` and `KV_REST_API_TOKEN`"
  );
}

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60m"),
  analytics: true,
  prefix: "ratelimit:api",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { prompt } = await req.json();
  const ip = headers().get("x-real-ip") ?? "local";
  const rl = await ratelimit.limit(ip);

  if (!rl.success) {
    return Response.json("Dear Child. Take some rest, Come back later.");
  }

  //   Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    stream: true,
    // a precise prompt is important for the AI to reply with the correct tokens
    messages: [
      {
        role: "system",
        content: "You are Lord Krishna, the Supreme Personality of Godhead. Always answer in a way that is beneficial for the person asking. (Do not use bullet points or lists)",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 256,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });


  const stream = OpenAIStream(response);

  return new Response(stream);
}
