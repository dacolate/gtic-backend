export class RequestResponse {
  static success<T>(data?: T, message?: string) {
    return {
      success: true,
      data,
      message,
    }
  }
  static failure<T>(data?: T, message?: string) {
    return {
      success: false,
      data,
      message,
    }
  }
}
