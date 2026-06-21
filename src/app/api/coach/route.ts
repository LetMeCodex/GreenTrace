import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userMessage, userProfile, last7Days, biggestSource, completedActionsCount } = body;

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    let responseText = "";

    // 1. Fallback Rule-Based Response Generator
    const getFallbackResponse = () => {
      const name = userProfile?.full_name || "Anish";
      const text = userMessage.toLowerCase();

      if (text.includes("week") || text.includes("analyze")) {
        const total = last7Days ? last7Days.reduce((sum: number, e: any) => sum + Number(e.total_co2e), 0) : 47.2;
        return `Anish, looking at your logged entries: You generated about ${total.toFixed(1)} kg CO₂e. Travel represents your primary emission driver (${biggestSource || "Transport"}). Replacing short bike or cab trips with metro rides will lower your footprint by ~2.5 kg next week.`;
      }

      if (text.includes("reduce") || text.includes("today") || text.includes("actions")) {
        return `Here are 3 quick actions you can take today:
        1. Swap one meat-heavy meal for plant-based vegan choice (saves ~4.5 kg CO₂e).
        2. Set AC temperature to 25°C and turn it off 1 hour early (saves ~1.2 kg CO₂e).
        3. Use a reusable shopping bag and water bottle today (saves ~0.5 kg CO₂e).`;
      }

      if (text.includes("score") || text.includes("green score")) {
        return `Your Green Score measures your carbon efficiency compared to a baseline of 8.0 kg/day. Completing actions from your Plan raises it, while logging vehicle travel lowers it.`;
      }

      return `That is a solid climate question! Focus on small, repeatable daily habits: walking for commutes under 2 km, switching to home-cooked meals to reduce packaging waste, and carrying insulated bottles.`;
    };

    // 2. Try Gemini API
    if (geminiKey) {
      try {
        const prompt = `
          You are "Trace Coach", a friendly, practical, data-aware personal carbon coach.
          Your tone should be motivating, friendly, and practical—never preachy or guilt-inducing.
          
          User Profile:
          - Name: ${userProfile?.full_name || "Anish"}
          - City: ${userProfile?.city || "Bengaluru"}
          - Main Transit: ${userProfile?.main_transport_mode || "Car"}
          - Average Commute: ${userProfile?.avg_daily_distance_km || 10} km
          - Diet: ${userProfile?.diet_type || "Mixed diet"}
          
          Recent History Summary:
          - Biggest Emission Source: ${biggestSource || "Transport"}
          - Completed Actions This Week: ${completedActionsCount || 0}
          
          User Question: "${userMessage}"
          
          Give a short, actionable, personalized response. Refer to their name and their specific data where appropriate. Limit your response to 3-4 concise sentences.
        `;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        });

        if (res.ok) {
          const apiData = await res.json();
          responseText = apiData.candidates[0].content.parts[0].text.trim();
        } else {
          console.error("Gemini API returned error code:", res.status);
          responseText = getFallbackResponse();
        }
      } catch (err) {
        console.error("Gemini API call failed, using fallback:", err);
        responseText = getFallbackResponse();
      }
    }
    // 3. Try OpenAI API
    else if (openaiKey) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are Trace Coach, an eco-brutalist personal carbon assistant. Keep answers under 4 sentences.",
              },
              {
                role: "user",
                content: `User query: ${userMessage}. Context: name is ${userProfile?.full_name || "Anish"}, biggest source is ${biggestSource}.`,
              },
            ],
          }),
        });

        if (res.ok) {
          const apiData = await res.json();
          responseText = apiData.choices[0].message.content.trim();
        } else {
          responseText = getFallbackResponse();
        }
      } catch (err) {
        console.error("OpenAI API failed, using fallback:", err);
        responseText = getFallbackResponse();
      }
    }
    // 4. Default Fallback
    else {
      responseText = getFallbackResponse();
    }

    return NextResponse.json({ text: responseText });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
