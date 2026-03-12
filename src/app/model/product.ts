export class Product {
  constructor(
    public _id: any = null,
    public productName: string = '',
    public price: number = 0,
    public quantity: number = 0,
    public description: string = '',
    public imageUrl: string = '',
    public model: string = '',
    public made: string = '',
    public categoryName: string = ''
  ) {}
}