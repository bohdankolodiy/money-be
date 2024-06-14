import { FastifyReply } from "fastify";
import { IEmailTemplate } from "../../../interfaces/email.interface";
import { EmailTemplate } from "../../../models/email.model";

export class AuthService {
  async sendMail(mailer: any, email: string, reply: FastifyReply) {
    const varificationLink = `http://localhost:4200/callback?email=${email}`;
    const html = `<b>Hi, from Money Inc</b> <br>
        <p>Please click at link for verification you email:</p> <br>
        <a href="${varificationLink}">${varificationLink}</a>`;
    const mail: IEmailTemplate = new EmailTemplate(
      email,
      "Varification Link",
      varificationLink,
      html
    );

    return await mailer.sendMail(mail, (errors: Error) => {
      if (errors) {
        reply.code(500).send(errors);
      }
    });
  }
}
