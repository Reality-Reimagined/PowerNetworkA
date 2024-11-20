import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'sk-example-api-key'
});

const SYSTEM_PROMPT = `You are a network analysis expert. For the given person, return a JSON object with this exact structure:
{
  "connections": [
    {
      "type": "think-tank" | "donor" | "political" | "corporate" | "lobbying" | "media" | "personal",
      "name": string,
      "role": string,
      "description": string,
      "startYear": number (optional),
      "endYear": number (optional)
    }
  ]
}`;

app.post('/api/analyze', async (req, res) => {
  try {
    const { query } = req.body;
    
    const completion = await client.chat.completions.create({
      model: "llama-3.2-90b-text-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analyze the network connections for: ${query}` }
      ],
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
      response_format: { "type": "json_object" }
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      return res.status(400).json({ error: 'No response from LLM' });
    }

    const analysis = JSON.parse(response);
    analysis.lastUpdated = new Date().toISOString();
    
    res.json(analysis);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to analyze network' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});