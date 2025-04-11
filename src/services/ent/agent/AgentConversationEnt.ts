import { ObjectId } from 'mongodb';
import { BaseEnt } from '../base/BaseEnt';
import { IEnt } from '../base/IEnt';
import { TEntWithObjectIdsMappedToString } from '../base/TEntWithObjectIdsMappedToString';
import { EEntCollectionName } from '../EEntCollectionName';

export interface IAgentConversationEnt extends IEnt {
  interfaceDefinition: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
  }>;
  jsonData?: any;
  updatedAt: Date;
}

export class AgentConversationEnt extends BaseEnt<IAgentConversationEnt> {
  public static COLLECTION_NAME = EEntCollectionName.EntEzRecord;

  constructor(collection: any, model: IAgentConversationEnt) {
    super(collection, model);
  }

  public getModelWithStringIds(): TEntWithObjectIdsMappedToString<IAgentConversationEnt> {
    return {
      ...this.model,
      _id: this.model._id.toString(),
      created_date: this.model.created_date,
      updatedAt: this.model.updatedAt,
      messages: this.model.messages,
      interfaceDefinition: this.model.interfaceDefinition,
      jsonData: this.model.jsonData
    };
  }

  public static async createConversation(interfaceDefinition: string): Promise<string> {
    const conversation: IAgentConversationEnt = {
      _id: new ObjectId(),
      interfaceDefinition,
      messages: [],
      created_date: new Date(),
      updatedAt: new Date()
    };

    const result = await this.genCreateOne(conversation);
    return result.toString();
  }

  public static async addMessage(conversationId: string, message: { role: 'user' | 'assistant' | 'system'; content: string }) {
    await this.genUpdateOne(
      conversationId,
      {
        updatedAt: new Date()
      },
      {
        messages: {
          ...message,
          timestamp: new Date()
        }
      }
    );
  }

  public static async setJsonData(conversationId: string, jsonData: any) {
    await this.genUpdateOne(
      conversationId,
      {
        jsonData,
        updatedAt: new Date()
      }
    );
  }

  public static async getConversation(conversationId: string): Promise<AgentConversationEnt | null> {
    return this.genNullable(conversationId);
  }
} 