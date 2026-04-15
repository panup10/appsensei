import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export default async (req) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: { message: 'Invalid JSON body.' } },
      { status: 400 }
    );
  }

  const { messages, system } = body;

  if (!messages || !Array.isArray(messages)) {
    return Response.json(
      { error: { message: 'messages array required.' } },
      { status: 400 }
    );
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: system || '',
      messages,
    });

    return Response.json(message);
  } catch (err) {
    const status = err.status || 500;
    const errMessage = err.message || 'Server error. Try again.';
    return Response.json(
      { error: { message: errMessage } },
      { status }
    );
  }
};

export const config = {
  path: '/api/chat',
};
