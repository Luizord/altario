import { UseGuards } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from './jwt.service';
import { PaymentsService } from 'src/payments/payments.service';
import { UpdatePaymentDTO } from 'src/models/payment.model';

@WebSocketGateway()
@UseGuards(WsJwtGuard)
export class RealTimeGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(private readonly paymentsService: PaymentsService) { }

    @WebSocketServer() server: Server;

    handleConnection(client: Socket) {
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
    }

    @SubscribeMessage('updateData')
    async handleUpdate(@MessageBody() data: { id: string, updateData: UpdatePaymentDTO }, @ConnectedSocket() client: Socket) {
        const { id, updateData } = data;

        try {
            // Use the PaymentsService to update the payment
            const updatedPayment = await this.paymentsService.update(+id, updateData);

            // Broadcast the updated payment to all connected clients
            this.server.emit('dataUpdated', updatedPayment);

            return { status: 'success', updatedPayment };
        } catch (error) {
            client.emit('updateRejected', { id, reason: error.message });
        }
    }
}