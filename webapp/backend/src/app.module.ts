import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbService } from './services/db/db.service';
import { TestController } from './controllers/test/test.controller';

@Module({
  imports: [
    ConfigModule.forRoot()
  ],
  controllers: [
    TestController
  ],
  providers: [
    DbService
  ],
})
export class AppModule {}
