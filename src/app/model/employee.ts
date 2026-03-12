export class Employee {
  constructor(
    public _id: any = null,
    public employeeName: string = '',
    public email: string = '',
    public password: string = '',
    public role: string = '',
    public phone: string = ''
  ) {}
}