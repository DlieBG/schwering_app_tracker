import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbService } from './services/db/db.service';

@Module({
  imports: [
    ConfigModule.forRoot()
  ],
  controllers: [
    
  ],
  providers: [
    DbService
  ],
})
export class AppModule {}
