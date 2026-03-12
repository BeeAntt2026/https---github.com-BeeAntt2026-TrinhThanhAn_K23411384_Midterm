export class Customer {
  constructor(
    public _id: any = null,
    public customerName: string = '',
    public email: string = '',
    public password: string = '',
    public phone: string = '',
    public address: string = ''
  ) {}
}