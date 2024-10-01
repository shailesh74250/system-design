// Node.js Error Handling Basics

// Synchronous Code: Use try/catch blocks to handle errors.
try {
    // Synchronous code that may throw an error
    const result = riskyOperation();
} catch (error) {
    // Handle the error
    console.error(error);
}

// Asynchronous Code: For callbacks, pass errors to the callback function. With Promises and async/await, use try/catch.
// Using Promises
riskyAsyncOperation()
    .then(result => {
        // Handle success
    })
    .catch(error => {
        // Handle error
        console.error(error);
    });

// Using async/await
async function execute() {
    try {
        const result = await riskyAsyncOperation();
        // Handle success
    } catch (error) {
        // Handle error
        console.error(error);
    }
}


export class HttpError extends Error {
  private readonly status: number;
  private readonly error_code: string;
  private readonly details: any;
  constructor(status: number, error_code: string, message: string) {
    super(message);
    this.status = status;
    this.error_code = error_code;
    this.message = message;
    Error.captureStackTrace(this, HttpError);
  }
  public getErrorCode(): string {
    return this.error_code;
  }

  public getStatus(): number {
    return this.status;
  }

  public getMessage(): string {
    return this.message;
  }

  public getDetails(): any {
    return this.details;
  }
}
