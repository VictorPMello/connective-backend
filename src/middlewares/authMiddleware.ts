import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    let token = request.cookies.token;

    if (!token) {
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.substring(7);
      }
    }

    if (!token)
      return reply.status(401).send({ message: "Token not provided" });

    const decoded = request.server.jwt.verify(token) as {
      id: string;
      email: string;
    };

    request.userId = decoded.id;
  } catch (error) {
    return reply.status(401).send({ message: "Invalid or expired token" });
  }
}
