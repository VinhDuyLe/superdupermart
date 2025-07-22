// src/app/shared/models/order.model.ts
import { BigDecimal } from './common.model';

export interface Order {
  id: number;
  user: { id: number; username: string; email: string; role: string };
  status: 'PROCESSING' | 'COMPLETED' | 'CANCELED';
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productSnapshotName: string;
  productSnapshotPrice: BigDecimal;
  quantity: number;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  order: OrderItemRequest[];
}