import { NextResponse } from "next/server";
import OpenAI from "openai";

// Define system prompt for OpenAI API
const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, use mnemonics or memory aids to help reference the information.
8. Tailor the difficulty level of the flashcards to the user's specified preferences.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
11. Only generate 15 flashcards.
12. Keep the questions and answers as short and concise as possible.

Return in the following JSON format:
{
    "flashcards": [
        {
            "front": str,
            "back": str
        }
    ]
}
`;

export async function POST(req) {
    try {
        // Initialize OpenAI with API key from environment variables
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        // Extract the input text from the request
        const data = await req.text();

        // Call OpenAI's chat completion endpoint with system and user prompts
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: data },
            ]
        });

        // Parse the response content
        const responseContent = completion.choices[0].message.content;

        // Attempt to parse the JSON returned by OpenAI
        const flashcards = JSON.parse(responseContent);

        // Return the generated flashcards in JSON format
        return NextResponse.json(flashcards.flashcards);
    } catch (error) {
        console.error("Error generating flashcards:", error);
        return NextResponse.json({ error: "Failed to generate flashcards." }, { status: 500 });
    }
}
