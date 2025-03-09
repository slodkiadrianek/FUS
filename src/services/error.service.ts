export class AppError {
  constructor(
    public statusCode: number,
    public redirect: string,
    public errorDescription: string
  ) {}
}
