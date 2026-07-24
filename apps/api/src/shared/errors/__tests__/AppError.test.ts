import { describe, it, expect } from "vitest";
import {
  AppError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  TooManyRequestsError,
} from "../AppError";

describe("AppError", () => {
  it("creates error with correct properties", () => {
    const err = new AppError("Something failed", 500, "INTERNAL");
    expect(err.message).toBe("Something failed");
    expect(err.statusCode).toBe(500);
    expect(err.code).toBe("INTERNAL");
    expect(err.isOperational).toBe(true);
  });

  it("is an instance of Error", () => {
    const err = new AppError("test", 400);
    expect(err).toBeInstanceOf(Error);
  });
});

describe("UnauthorizedError", () => {
  it("has correct status and default message", () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe("Unauthorized");
    expect(err.code).toBe("UNAUTHORIZED");
  });

  it("accepts custom message", () => {
    const err = new UnauthorizedError("Token expired");
    expect(err.message).toBe("Token expired");
  });
});

describe("ForbiddenError", () => {
  it("has correct status code", () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe("FORBIDDEN");
  });
});

describe("NotFoundError", () => {
  it("formats resource name into message", () => {
    const err = new NotFoundError("User");
    expect(err.message).toBe("User not found");
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe("NOT_FOUND");
  });

  it("uses default resource name", () => {
    const err = new NotFoundError();
    expect(err.message).toBe("Resource not found");
  });
});

describe("ConflictError", () => {
  it("has correct status code", () => {
    const err = new ConflictError("Email already exists");
    expect(err.statusCode).toBe(409);
    expect(err.message).toBe("Email already exists");
  });
});

describe("ValidationError", () => {
  it("has correct status code", () => {
    const err = new ValidationError("Invalid email");
    expect(err.statusCode).toBe(422);
    expect(err.code).toBe("VALIDATION_ERROR");
  });
});

describe("TooManyRequestsError", () => {
  it("has correct status code", () => {
    const err = new TooManyRequestsError();
    expect(err.statusCode).toBe(429);
    expect(err.code).toBe("RATE_LIMIT_EXCEEDED");
  });
});
