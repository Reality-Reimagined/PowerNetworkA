import { NetworkAnalysis, Connection } from '../types';
import { Groq } from 'groq-sdk';

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
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

class NetworkAnalyzerAPI {
  private static generateMermaidDiagram(analysis: NetworkAnalysis): string {
    const nodeColors: Record<Connection['type'], string> = {
      'think-tank': '#4B0082',
      'donor': '#006400',
      'political': '#8B0000',
      'corporate': '#00008B',
      'lobbying': '#FF4500',
      'media': '#4169E1',
      'personal': '#800080'
    };

    return `
      graph LR
        Subject[["${analysis.subject}"]]
        ${analysis.connections.map((conn, i) => `
          Connection${i}["${conn.name}"]:::${conn.type}
          Subject --> |${conn.role || conn.type}| Connection${i}
        `).join('\n')}
        
        classDef think-tank fill:${nodeColors['think-tank']},color:white;
        classDef donor fill:${nodeColors['donor']},color:white;
        classDef political fill:${nodeColors['political']},color:white;
        classDef corporate fill:${nodeColors['corporate']},color:white;
        classDef lobbying fill:${nodeColors['lobbying']},color:white;
        classDef media fill:${nodeColors['media']},color:white;
        classDef personal fill:${nodeColors['personal']},color:white;
    `;
  }

  async searchPerson(query: string): Promise<NetworkAnalysis> {
    try {
      const completion = await client.chat.completions.create({
        model: "llama-3.1-70b-specdec",
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
        throw new Error('No response from LLM');
      }

      const data = JSON.parse(response);
      
      if (!data || !data.connections) {
        throw new Error('Invalid response format from LLM');
      }

      return {
        subject: query,
        connections: data.connections,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Search failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async generateDiagram(analysis: NetworkAnalysis): Promise<string> {
    try {
      return NetworkAnalyzerAPI.generateMermaidDiagram(analysis);
    } catch (error) {
      throw new Error('Failed to generate network diagram');
    }
  }
}

export const skAPI = new NetworkAnalyzerAPI();
