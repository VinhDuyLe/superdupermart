// src/app/shared/models/product.model.ts
import { BigDecimal } from './common.model';

export interface ProductResponseDTO {
  id: number;
  name: string;
  description: string;
  retailPrice: BigDecimal;
  quantity?: number | null;
  wholesalePrice?: BigDecimal | null;
}

export interface ProductRequest {
  name: string;
  description: string;
  wholesalePrice: BigDecimal;
  retailPrice: BigDecimal;
  quantity: number;
}