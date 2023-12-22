// factory.service.ts

import { Injectable } from '@nestjs/common';
import { Factory } from './factory.model';
import { PostgresService } from "../postgres/postgres.service";

@Injectable()
export class FactoryService {
  constructor(private readonly postgresService: PostgresService) {}

  async getAllFactories(): Promise<Factory[]> {
    const query = 'SELECT * FROM factory';
    return this.postgresService.executeQuery(query);
  }

  async getFactoryById(id: number): Promise<Factory> {
    const query = 'SELECT * FROM factory WHERE id = $1';
    const values = [id];
    return this.postgresService.executeQuery(query, values);
  }

  async createFactory(factory: Factory): Promise<Factory> {
    const query = 'INSERT INTO factory (name, address) VALUES ($1, $2) RETURNING *';
    const values = [factory.name, factory.address];
    return this.postgresService.executeQuery(query, values);
  }

  async updateFactory(id: number, factory: Factory): Promise<Factory> {
    const query = 'UPDATE factory SET name = $1, address = $2 WHERE id = $3 RETURNING *';
    const values = [factory.name, factory.address, id];
    return this.postgresService.executeQuery(query, values);
  }

  async deleteFactory(id: number): Promise<void> {
    const query = 'DELETE FROM factory WHERE id = $1';
    const values = [id];
    await this.postgresService.executeQuery(query, values);
  }
}
