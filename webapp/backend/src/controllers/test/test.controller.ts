import { Controller, Get } from '@nestjs/common';
import { DbService } from 'src/services/db/db.service';

@Controller('test')
export class TestController {

    constructor(
        private dbService: DbService
    ) { }

    @Get()
    getTest() {
        return this.dbService.getCollection('points').find({
            type: 'heltec',
            position: {
                $ne: null
            }
        }).toArray();
    }

}
