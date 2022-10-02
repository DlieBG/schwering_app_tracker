import { Controller, Post, Headers, Body, UnauthorizedException, InternalServerErrorException, Get } from '@nestjs/common';
import { DbService } from 'src/services/db/db.service';

@Controller('arduino')
export class ArduinoController {

    constructor(
        private dbService: DbService
    ) { }

    @Post()
    async lora2mongo(
        @Headers('Schwering-App-Tracker-Shared-Secret') sharedSecret: string,
        @Body() body: any
    ) {
        if(process.env.SHARED_SECRET != sharedSecret)
            throw new UnauthorizedException();

        try {
            await this.dbService
                .getCollection('arduino_raw')
                .insertOne(body);

            await this.dbService
                .getCollection('devices')
                .updateOne(
                    {
                        deviceId: body.id
                    },
                    {
                        $set: {
                            deviceId: body.id,
                            name: body.name,
                            type: 'arduino',
                            downlinkUrl: body.downlink_url,
                            lastSeen: new Date()
                        }
                    },
                    {
                        upsert: true
                    }
                );

            let payload = Buffer.from(body.payload, 'base64').toString('binary');
            
            if(payload != '')
                await this.dbService
                    .getCollection('positions')
                    .insertOne({
                        deviceId: body.id,
                        rawPayload: body.payload,
                        decodedPayload: payload,
                        time: new Date(),
                        type: 'fix',
                        lat: parseFloat(payload.split('#')[0]) / 1000000,
                        lon: parseFloat(payload.split('#')[1]) / 1000000,
                        speed: parseFloat(payload.split('#')[2]) / 100 * 1.852
                    });
            else
                await this.dbService
                    .getCollection('positions')
                    .insertOne({
                        deviceId: body.id,
                        rawPayload: body.payload,
                        decodedPayload: payload,
                        time: new Date(),
                        type: 'no-fix',
                        lat: null,
                        lon: null,
                        speed: null
                    });
            
            return {
                ok: true
            };
        } catch {
            throw new InternalServerErrorException();
        }
    }
}
