import OpenAI from 'openai';
import Constants from 'expo-constants';

interface CacheEntry {
  response: string;
  timestamp: number;
}

class AIClient {
  private static instance: AIClient;
  private client: OpenAI;
  private rateLimit: number = 60; // requests per minute
  private lastRequestTime: number = 0;
  private requestQueue: Array<() => Promise<any>> = [];
  private cache: Map<string, CacheEntry> = new Map();
  private CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  private constructor() {
    const apiKey = Constants.expoConfig?.extra?.deepseekApiKey;
    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY is not defined in environment variables');
    }

    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://api.deepseek.com/v1',
    });
  }

  public static getInstance(): AIClient {
    if (!AIClient.instance) {
      AIClient.instance = new AIClient();
    }
    return AIClient.instance;
  }

  private getCacheKey(type: string, ...args: any[]): string {
    return `${type}:${JSON.stringify(args)}`;
  }

  private getFromCache(key: string): string | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < this.CACHE_DURATION) {
      return entry.response;
    }
    return null;
  }

  private setCache(key: string, response: string): void {
    this.cache.set(key, {
      response,
      timestamp: Date.now(),
    });
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minTimeBetweenRequests = 60000 / this.rateLimit;

    if (timeSinceLastRequest < minTimeBetweenRequests) {
      await new Promise(resolve => 
        setTimeout(resolve, minTimeBetweenRequests - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();
  }

  private async processQueue(): Promise<void> {
    if (this.requestQueue.length === 0) return;

    const request = this.requestQueue.shift();
    if (request) {
      try {
        await this.enforceRateLimit();
        await request();
      } catch (error) {
        console.error('Error processing AI request:', error);
      }
      this.processQueue();
    }
  }

  public async generateTreeExplanation(tree: any, language: string): Promise<string> {
    const cacheKey = this.getCacheKey('tree_explanation', tree, language);
    const cachedResponse = this.getFromCache(cacheKey);
    if (cachedResponse) return cachedResponse;

    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const response = await this.client.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: `You are a language syntax expert. Explain the following syntax tree in ${language}. Focus on the structure, relationships between nodes, and linguistic significance.`
              },
              {
                role: 'user',
                content: JSON.stringify(tree)
              }
            ],
            temperature: 0.7,
            max_tokens: 500
          });
          const result = response.choices[0].message?.content || '';
          this.setCache(cacheKey, result);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  public async generateLearningGuidance(language: string, topic: string, level: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'): Promise<string> {
    const cacheKey = this.getCacheKey('learning_guidance', language, topic, level);
    const cachedResponse = this.getFromCache(cacheKey);
    if (cachedResponse) return cachedResponse;

    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const response = await this.client.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: `You are a language learning expert. Provide ${level} level guidance on ${topic} in ${language}. Include examples, common mistakes, and practice exercises.`
              },
              {
                role: 'user',
                content: `Please explain ${topic} in ${language} at a ${level} level, with examples and exercises.`
              }
            ],
            temperature: 0.7,
            max_tokens: 500
          });
          const result = response.choices[0].message?.content || '';
          this.setCache(cacheKey, result);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  public async answerQuestion(question: string, context: any): Promise<string> {
    const cacheKey = this.getCacheKey('question', question, JSON.stringify(context));
    const cachedResponse = this.getFromCache(cacheKey);
    if (cachedResponse) return cachedResponse;

    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const response = await this.client.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: 'You are a language syntax expert. Answer the following question based on the provided context. If the question is about a syntax tree, provide a detailed explanation of the tree structure.'
              },
              {
                role: 'user',
                content: `Context: ${JSON.stringify(context)}\n\nQuestion: ${question}`
              }
            ],
            temperature: 0.7,
            max_tokens: 500
          });
          const result = response.choices[0].message?.content || '';
          this.setCache(cacheKey, result);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }
}

export const aiClient = AIClient.getInstance(); 