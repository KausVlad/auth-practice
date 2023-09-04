import { Injectable } from '@nestjs/common';
import { GenerateApiKeyPayload } from '../interfaces/generate-api-key-kayload.interface';
import { HashingService } from '../hashing/hashing.service';
import { randomUUID } from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(private readonly hashingService: HashingService) {}

  async createAndHash(id: number): Promise<GenerateApiKeyPayload> {
    const apiKey = this.generateApi(id);
    const hashedKey = await this.hashingService.hash(apiKey);
    return {
      apiKey,
      hashedKey,
    };
  }

  async validate(apiKey: string, hashedKey: string): Promise<boolean> {
    return this.hashingService.compare(apiKey, hashedKey);
  }

  extractIdFromApiKey(apiKey: string): string {
    const [id] = Buffer.from(apiKey, 'base64').toString('ascii').split(' ');
    return id;
  }

  private generateApi(id: number): string {
    const apiKey = `${id} ${randomUUID()}`;
    return Buffer.from(apiKey).toString('base64');
  }
}
