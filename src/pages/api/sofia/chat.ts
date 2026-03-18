import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface ChatRequest {
  message: string;
  context?: Array<{ role: string; content: string }>;
}

interface ChatResponse {
  text: string;
  video_url?: string;
  status: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ text: 'Method not allowed', status: 'error' });
  }

  const { message, context } = req.body as ChatRequest;

  if (!message) {
    return res.status(400).json({ text: 'Message is required', status: 'error' });
  }

  try {
    // Call ATTI LLM adapter
    const llmResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/llm/generate`,
      {
        prompt: message,
        context: context || [],
        model: 'nemotron',
      }
    );

    const text = llmResponse.data.response;

    // Generate avatar video (optional)
    let video_url = undefined;
    try {
      const videoResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/avatar/generate-video`,
        {
          text: text,
          avatar: 'sofia',
        }
      );
      video_url = videoResponse.data.video_url;
    } catch (error) {
      console.warn('Video generation failed, returning text only');
    }

    return res.status(200).json({
      text,
      video_url,
      status: 'success',
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      text: 'Erro ao processar sua mensagem',
      status: 'error',
    });
  }
}
