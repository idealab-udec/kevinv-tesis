import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const runtime = 'edge';

export async function POST(req) {
    let { messages, userInput, systemPrompt, temperature, maxTokens, topP } = await req.json();
    
    if (systemPrompt !== "") {
        messages = [
            ['system', systemPrompt],
            ...messages
        ] 
        // messages.unshift(['system', systemPrompt]);
    }

    // Log the received parameters for debugging
    console.log('Received parameters:', { messages, userInput, systemPrompt, temperature, maxTokens, topP });

    const model = new ChatGroq({
        model: 'llama3-70b-8192',
        apiKey: process.env.GROQ_API_KEY,
        temperature,
        maxTokens,
        topP,
    });

    const prompt = ChatPromptTemplate.fromMessages([
        ...messages,
        ['human', 
`En base a lo siguiente:
"""
{input}
"""
Crea una guía paso a paso que permita abordar este problema (sin realizar cálculos), en cada paso solo debes de dejar expresadas fórmulas simples que representen lo que se debe calcular, deja escrito consideraciones relevantes.`],
    ]);
    const outputParser = new StringOutputParser();
    const chain = prompt.pipe(model).pipe(outputParser);

    const stream = await chain.stream({ input: userInput });

    return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
    });
}
