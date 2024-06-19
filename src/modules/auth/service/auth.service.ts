import { IEmailTemplate } from "../../../interfaces/email.interface";
import { EmailTemplate } from "../../../models/email.model";
import { Transporter } from "nodemailer";
import { IUser } from "../../../interfaces/user.interface";
import { QueryResult } from "pg";
import { PostgresDb } from "@fastify/postgres";

class AuthService {
  async createUser(db: PostgresDb, data: IUser): Promise<{ id: string }> {
    return (
      await db.query(
        `INSERT INTO users(id, email, password, wallet, balance, isVerify) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          data.id,
          data.email,
          data.password,
          data.wallet,
          data.balance,
          data.isVerify,
        ]
      )
    ).rows[0];
  }

  async findOne(db: PostgresDb, email: string): Promise<IUser> {
    return (await db.query(`Select * from users where email=$1`, [email]))
      .rows[0];
  }

  async verifyUser(db: PostgresDb, userId: string): Promise<QueryResult> {
    return db.query(`Update users Set isVerify = true where id=$1`, [userId]);
  }

  sendMail(mailer: Transporter, user: IUser): Promise<undefined> {
    const varificationLink = `http://localhost:4200/callback?id=${user.id}`;
    const html = `<b>Hi, from Money Inc</b> <br>
        <p>Please click at link for verification you email:</p> <br>
        <a href="${varificationLink}">${varificationLink}</a>`;
    const mail: IEmailTemplate = new EmailTemplate(
      user.email,
      "Varification Link",
      varificationLink,
      html
    );

    return mailer.sendMail(mail);
  }
}

export const authService = new AuthService();
