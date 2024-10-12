import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GridService } from './grid/grid.service';
import { GridController } from './grid/grid.controller';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsService } from './payments/payments.service';

@Module({
  imports: [],
  controllers: [AppController, GridController, PaymentsController],
  providers: [AppService, GridService, PaymentsService],
})
export class AppModule {}
