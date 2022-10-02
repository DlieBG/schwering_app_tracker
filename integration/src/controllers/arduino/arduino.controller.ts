import { Controller, Post, Headers, Body, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
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

        return this.dbService
            .getCollection('raw')
            .insertOne(body)
            .then(
                () => {
                    return {
                        ok: true
                    }
                }
            )
            .catch(
                () => {
                    throw new InternalServerErrorException();
                }
            );
    }
}
