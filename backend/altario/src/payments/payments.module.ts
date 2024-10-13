import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { RealTimeGateway } from 'src/gateway/websocket.gateway';
import { PaymentsController } from './payments.controller';
import { WsJwtGuard } from 'src/gateway/jwt.service';

@Module({
    providers: [RealTimeGateway, PaymentsService, WsJwtGuard],
    controllers: [PaymentsController],
    exports: [PaymentsService],
})
export class PaymentsModule { }