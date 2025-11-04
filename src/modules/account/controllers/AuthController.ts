import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import type { LoginService } from "../services/LoginService";
import { env } from "../../../config/env";

export class AuthController {
  private loginService: LoginService;
  constructor(loginService: LoginService) {
    this.loginService = loginService;
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const createAccountSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = createAccountSchema.parse(request.body);

    const account = await this.loginService.login(email, password);

    const token = request.server.jwt.sign({
      id: account.id,
      email: account.email,
    });

    reply.setCookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return reply.status(200).send({
      message: "Login successful",
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        plan: account.plan,
      },
      token,
    });
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie("token", { path: "/" });
    return reply.status(200).send({ message: "Logout successful" });
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(200).send({
      userId: request.userId,
    });
  }
}
