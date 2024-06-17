import { FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";

const jwtPlugin: FastifyPluginCallback = async (fastify, opts, done) => {
  fastify.decorate(
    "authenticate",
    async function (
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<any> {
      try {
        await request.jwtVerify();
        // const token = request.headers.access_token;
        // if (!token) {
        //   return reply.status(401).send({ message: "Authentication required" });
        // }
        // // here decoded will be a different type by default but we want it to be of user-payload type
        // const decoded = fastify.jwt.verify(token.toString());
        // request.user = decoded;
      } catch (err) {
        reply.send(err);
      }
    }
  );

  done();
};

export default jwtPlugin;
