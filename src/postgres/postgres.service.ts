// postgres.service.ts

import { Injectable } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class PostgresService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      user: 'alicebeci',
      host: 'localhost',
      database: 'crud-db',
      password: '',
      port: 5432,
    });
    this.client.connect();
  }

  async executeQuery(query: string, values: any[] = []): Promise<any> {
    try {
      const result = await this.client.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Error executing query: ${error}`);
    }
  }
}
