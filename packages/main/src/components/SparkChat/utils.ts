import { CardItem } from './types';

let counter = 0;

export function uuid(): string {
  return `msg-${Date.now()}-${++counter}`;
}

export function createCard(code: string, data: any): CardItem {
  return { code, data };
}
