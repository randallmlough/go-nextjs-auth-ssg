export class ResponseError extends Error {
  status: number;
  info: any;
  constructor(msg: string) {
    super(msg);
  }
}
