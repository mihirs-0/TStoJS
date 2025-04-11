import { Anthropic } from '@anthropic-ai/sdk';
import { OpenAI } from 'openai';
import { AgentConversationEnt } from '../ent/agent/AgentConversationEnt';

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AgentResponse {
  message: string;
  isComplete: boolean;
  jsonData?: Record<string, unknown>;
  conversationId?: string;
}

export class AgentService {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;
  private model: 'openai' | 'anthropic';
  private currentConversationId: string | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      this.model = 'openai';
    } else if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      this.model = 'anthropic';
    } else {
      throw new Error('No AI provider API key found');
    }
  }

  async processMessage(message: string, interfaceDefinition: string, conversationId?: string): Promise<AgentResponse> {
    // If no conversationId is provided, create a new conversation
    if (!conversationId) {
      conversationId = await AgentConversationEnt.createConversation(interfaceDefinition);
    }
    this.currentConversationId = conversationId;

    // Add user message to conversation
    await AgentConversationEnt.addMessage(conversationId, { role: 'user', content: message });

    // Get conversation history
    const conversation = await AgentConversationEnt.getConversation(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const systemPrompt = this.generateSystemPrompt(interfaceDefinition);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation.getModel().messages.map(msg => ({ role: msg.role, content: msg.content }))
    ];

    let response: string;
    if (this.model === 'openai') {
      const completion = await this.openai!.chat.completions.create({
        model: 'gpt-4',
        messages: messages as OpenAI.ChatCompletionMessageParam[],
        stream: true
      });

      response = '';
      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || '';
        response += content;
      }
    } else {
      const anthropicMessages = messages.map(msg => ({
        role: msg.role === 'system' ? 'assistant' : msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })) as Anthropic.MessageParam[];

      const completion = await this.anthropic!.messages.create({
        model: 'claude-3-opus-20240229',
        messages: anthropicMessages,
        max_tokens: 4096,
        stream: true
      });

      response = '';
      for await (const chunk of completion) {
        if (chunk.type === 'content_block_delta') {
          response += chunk.delta.text;
        }
      }
    }

    // Add assistant response to conversation
    await AgentConversationEnt.addMessage(conversationId, { role: 'assistant', content: response });

    // Parse the response to check if it contains complete JSON data
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        const jsonData = JSON.parse(jsonMatch[1]) as Record<string, unknown>;
        await AgentConversationEnt.setJsonData(conversationId, jsonData);
        return {
          message: response,
          isComplete: true,
          jsonData,
          conversationId
        };
      } catch (error) {
        // If JSON parsing fails, continue the conversation
        console.error('Failed to parse JSON:', error);
      }
    }

    return {
      message: response,
      isComplete: false,
      conversationId
    };
  }

  private generateSystemPrompt(interfaceDefinition: string): string {
    return `You are an AI assistant helping to collect data based on a TypeScript interface.
Your goal is to guide the user through providing all required fields and values to construct a complete JSON object.

Interface definition:
${interfaceDefinition}

Guidelines:
1. Ask one question at a time
2. Validate user input against the expected types
3. Provide helpful guidance when input doesn't match expected formats
4. For arrays, ask how many items the user wants to add
5. For nested objects, collect each field one at a time
6. When all data is collected, output the complete JSON object in a code block

Remember to:
- Be conversational and friendly
- Explain type requirements clearly
- Handle errors gracefully
- Confirm values before moving to the next field
- Format the final JSON output in a code block with \`\`\`json`;
  }

  async getConversationHistory(conversationId: string): Promise<AgentMessage[]> {
    const conversation = await AgentConversationEnt.getConversation(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    return conversation.getModel().messages.map(msg => ({ role: msg.role, content: msg.content }));
  }

  getCurrentConversationId(): string | null {
    return this.currentConversationId;
  }
} 