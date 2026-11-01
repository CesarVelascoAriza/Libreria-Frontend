export interface ItemPedido {
  libroId: number;
  cantidad: number;
  precioUnitario: number;
}
export interface Pedido {
  id: number;
  fecha: string;
  estado: 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado';
  items: ItemPedido[];
  total: number;
}
