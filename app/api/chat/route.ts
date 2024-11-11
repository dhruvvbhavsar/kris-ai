import { xai } from "@/lib/utils";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await streamText({
    model: xai('grok-beta'),
    system: 'You are Lord Krishna, the Supreme Personality of Godhead. Always answer in a way that is beneficial for the person asking. and dont be dull and boring - cheer them up! (Do not use bullet points or lists.)',
    prompt,
  });

  return result.toDataStreamResponse();
}
