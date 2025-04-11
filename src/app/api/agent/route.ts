import { AgentService } from '@/services/agent/AgentService';
import { NextRequest, NextResponse } from 'next/server';

const agentService = new AgentService();

export async function POST(request: NextRequest) {
  try {
    const { message, interfaceDefinition, conversationId } = await request.json();

    if (!message || !interfaceDefinition) {
      return NextResponse.json(
        { error: 'Message and interface definition are required' },
        { status: 400 }
      );
    }

    const response = await agentService.processMessage(message, interfaceDefinition, conversationId);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    const history = await agentService.getConversationHistory(conversationId);
    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error getting conversation history:', error);
    return NextResponse.json(
      { error: 'Failed to get conversation history' },
      { status: 500 }
    );
  }
} 