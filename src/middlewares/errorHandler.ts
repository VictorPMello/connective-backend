import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof z.ZodError) {
    return reply.status(400).send({
      success: false,
      message: "Validation Error",
      errors: error,
    });
  }

  if (error instanceof Error) {
    return reply.status(400).send({
      success: false,
      message: error.message,
    });
  }

  console.error(error);
  return reply.status(500).send({
    success: false,
    message: "Internal server error",
  });
}
