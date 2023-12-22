import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FactoryService } from "./factory/factory.service";
import { UserService } from "./user/user.service";
import { PostgresService } from "./postgres/postgres.service";
import { UserController } from "./user/user.controller";
import { FactoryController } from "./factory/factory.controller";
import { JwtMiddleware } from "./middleware/jwt.middleware";

@Module({
  imports: [],
  controllers: [AppController,UserController,FactoryController],
  providers: [AppService,FactoryService,UserService,PostgresService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes(FactoryController, UserController);
  }
}
