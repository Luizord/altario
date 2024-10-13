import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class WsJwtGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const client = context.switchToWs().getClient();
        const token = client.handshake.query.token;

        try {
            const decoded = jwt.verify(token, 'your_jwt_secret');
            client.user = decoded;
            return true;
        } catch (err) {
            return false;
        }
    }
}