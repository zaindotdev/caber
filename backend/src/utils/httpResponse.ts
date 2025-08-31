export class HttpResponse {
  public static ok(data: any) {
    return {
      status: 200,
      data,
    };
  }

  public static badRequest(data: any) {
    return {
      status: 400,
      data,
    };
  }

  public static notFound(data: any) {
    return {
      status: 404,
      data,
    };
  }

  public static serverError(data: any) {
    return {
      status: 500,
      data,
    };
  }

  public static unauthorized(data: any) {
    return {
      status: 401,
      data,
    };
  }

  public static created(data: any) {
    return {
      status: 201,
      data,
    };
  }
}
