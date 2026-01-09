"use server";

import { Message, GROQ_API_URL, STUDY_BUDDY_SYSTEM_PROMPT, STUDY_PLANNER_SYSTEM_PROMPT } from "@/lib/groq";

export async function chatWithGroqAction(messages: Message[]) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set on the server");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to fetch from Groq");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function generateStudyPlanAction(prompt: string) {
  return chatWithGroqAction([
    { role: "system", content: STUDY_PLANNER_SYSTEM_PROMPT },
    { role: "user", content: prompt }
  ]);
}
