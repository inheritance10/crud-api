// user.service.ts

import { Injectable } from "@nestjs/common";
import { Users } from "./users.model";
import { compareSync, hashSync } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { PostgresService } from "../postgres/postgres.service";
@Injectable()
export class UserService {
  constructor(private postgresService: PostgresService) {
  }
  private readonly users: Users[] = [];
  private readonly refreshToken: string[] = [];

  private readonly jwtSecretKey = "sfgtaeeeegfsnglkxftrsgfkGNKTESTteafgfd";

  async register(user: Users): Promise<Users> {
    const emailExistsQuery = 'SELECT * FROM users WHERE email = $1';
    const emailExistsValues = [user.email];
    const emailExistsResult = await this.postgresService.executeQuery(emailExistsQuery, emailExistsValues);


    if (emailExistsResult?.rows?.length > 0) {
      throw new Error('Email already exists');
    }

    const hashedPassword = hashSync(user.password, 10);
    const insertQuery = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
    const insertValues = [user.email, hashedPassword];

    return await this.postgresService.executeQuery(insertQuery, insertValues);
  }


  async login(user: Users): Promise<any> {

    const userFrom = await this.getUserByEmail(user.email);

    if (!userFrom || !compareSync(user.password, userFrom?.password)) {
      throw new Error("Invalid email or password");
    }

    const accessToken = sign({ userId: userFrom?.id }, this.jwtSecretKey, { expiresIn: "1h" });
    const refreshToken = sign({ userId: userFrom?.id }, this.jwtSecretKey);
    this.refreshToken.push(refreshToken);
    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string): Promise<string> {
    if (!this.refreshToken.includes(refreshToken)) {
      throw new Error("Invalid refresh token");
    }

    const decoded = verify(refreshToken, this.jwtSecretKey) as { userId: number };
    return sign({ userId: decoded.userId }, this.jwtSecretKey, { expiresIn: "1h" });
  }

  async verifyToken(token: string): Promise<{ isValid: boolean; userId?: number }> {
    try {
      const decoded = verify(token, this.jwtSecretKey) as { userId: number };
      return { isValid: true, userId: decoded.userId };
    } catch (error) {
      return { isValid: false };
    }
  }

  private async getUserByEmail(email: string): Promise<Users | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    return await this.postgresService.executeQuery(query, values);
  }
}
