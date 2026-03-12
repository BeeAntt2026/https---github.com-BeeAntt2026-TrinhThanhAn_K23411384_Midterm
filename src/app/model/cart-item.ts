export class CartItem {
  constructor(
    public product: any = null,
    public quantity: number = 1,
    public subtotal: number = 0
  ) {}
}