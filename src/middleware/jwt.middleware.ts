// jwt.middleware.ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        req['user'] = verify(token, 'sfgtaeeeegfsnglkxftrsgfkGNKTESTteafgfd');
        next();
      } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    } else {
      return res.status(401).json({ message: 'Token not provided' });
    }
  }
}
