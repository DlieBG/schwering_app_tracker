import { Module } from '@nestjs/common';
import { DbService } from './services/db/db.service';
import { ArduinoController } from './controllers/arduino/arduino.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ArduinoController],
  providers: [DbService],
})
export class AppModule {}
