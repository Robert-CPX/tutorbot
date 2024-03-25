import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: body.messages,
      }),
    })
    const data = await response.json()
    console.log("data: ", data)
    return NextResponse.json({ content: data.choices[0].message.content })
  } catch (error) {
    return NextResponse.error()
  }
}