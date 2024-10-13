import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GridService } from './grid/grid.service';
import { GridController } from './grid/grid.controller';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { RedisIoAdapter } from './gateway/redits.adapter';
import { PaymentsModule } from './payments/payments.module';
import { RealTimeGateway } from './gateway/websocket.gateway';


@Module({
  imports: [forwardRef(() => PaymentsModule)],
  controllers: [AppController, GridController],
  providers: [AppService,
    GridService,
    {
      provide: IoAdapter,
      useClass: RedisIoAdapter,
    },
    RealTimeGateway
  ],
})
export class AppModule { }
