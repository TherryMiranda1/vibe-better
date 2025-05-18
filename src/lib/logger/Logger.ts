export interface WebhookLoggerData {
  eventId?: string;
  [key: string]: any;
}

export const logger = {
  info: (message: string, data?: WebhookLoggerData, endpoint = "API") => {
    const timestamp = new Date().toISOString();
    console.log(
      `[${endpoint}][${timestamp}][INFO] ${message}`,
      data ? data : "",
    );
  },
  success: (message: string, data?: WebhookLoggerData, endpoint = "API") => {
    const timestamp = new Date().toISOString();
    console.log(
      `[${endpoint}][${timestamp}][SUCCESS] ${message}`,
      data ? data : "",
    );
  },
  warn: (message: string, data?: WebhookLoggerData, endpoint = "API") => {
    const timestamp = new Date().toISOString();
    console.warn(
      `[${endpoint}][${timestamp}][WARN] ${message}`,
      data ? data : "",
    );
  },
  error: (message: string, error?: Error | any, endpoint = "API") => {
    const timestamp = new Date().toISOString();
    console.error(
      `[${endpoint}][${timestamp}][ERROR] ${message}`,
      error ? (error.stack || error.message || error) : "",
    );
  },
};
