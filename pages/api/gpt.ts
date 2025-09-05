import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';



console.log("The loaded OPENAI_API_KEY is:", process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Data = {
  reply?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { userInput } = req.body;

  if (!userInput) {
    res.status(400).json({ error: 'Missing userInput parameter' });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: "You are a gentle emotional support assistant. Please provide advice based on the user's mood.",
        },
        {
          role: 'user',
          content: `My current state is：${userInput}`,
        },
      ],
    });

    const reply = completion.choices[0]?.message?.content || 'No response received.';

    res.status(200).json({ reply });
  } catch (error) {
    console.error('GPT Interface Error:', error);
    res.status(500).json({ error: 'GPT request failed' });
  }
}