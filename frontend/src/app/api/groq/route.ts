import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { districtName, pincode, temp, humidity, desc } = await req.json();

    const prompt = `Act as an expert AI named FORESIGHT. The user clicked on ${districtName} (Pincode: ${pincode || 'Unknown'}) in India. The current live weather is ${temp}°C, humidity ${humidity}%, conditions: ${desc}. Give a 2-3 sentence insightful summary of the current weather conditions. Make it sound professional, intelligent, and highly contextual to the region. Do not use robotic greetings, just dive straight into the analysis. Generate a unique and creative angle each time.`;

    // Try both the NEXT_PUBLIC_ version (since user already added it) and a regular GROQ_API_KEY
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key not configured on the server' }, { status: 500 });
    }

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 150
      })
    });

    const groqData = await groqRes.json();
    
    if (groqData.choices && groqData.choices.length > 0) {
      return NextResponse.json({ summary: groqData.choices[0].message.content.trim() });
    } else {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

  } catch (error) {
    console.error('Groq API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
