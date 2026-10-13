import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import {
  ConfigService,
} from '@nestjs/config'
import * as nodemailer from 'nodemailer'
import type {
  Transporter,
} from 'nodemailer'

@Injectable()
export class EmailService {
  private readonly transporter:
    Transporter

  constructor(
    private readonly configService:
      ConfigService,
  ) {
    this.transporter =
      nodemailer.createTransport({
        host:
          this.configService.getOrThrow<string>(
            'BREVO_SMTP_HOST',
          ),

        port: Number(
          this.configService.getOrThrow<string>(
            'BREVO_SMTP_PORT',
          ),
        ),

        secure: false,

        auth: {
          user:
            this.configService.getOrThrow<string>(
              'BREVO_SMTP_USER',
            ),

          pass:
            this.configService.getOrThrow<string>(
              'BREVO_SMTP_KEY',
            ),
        },
      })
  }

  async sendAdminInvite(params: {
    name: string
    email: string
    inviteToken: string
  }) {
    const adminAppUrl =
      this.configService.getOrThrow<string>(
        'ADMIN_URL',
      )

    const inviteUrl =
      `${adminAppUrl}/setup-account?token=` +
      encodeURIComponent(
        params.inviteToken,
      )

    try {
      const result =
        await this.transporter.sendMail({
          /*
           * Development sender.
           *
           * Later we can use:
           * Vedic Journey
           * <noreply@vedicjourney.in>
           * after domain verification.
           */
          from: {
            name: 'Vedic Journey',
            address:
              this.configService
                .getOrThrow<string>(
                  'BREVO_SMTP_USER',
                ),
          },

          to: params.email,

          subject:
            'You are invited to Vedic Journey',

          html: `
            <div
              style="
                max-width: 600px;
                margin: 0 auto;
                padding: 40px 24px;
                font-family: Arial, sans-serif;
                color: #211d21;
              "
            >
              <div
                style="
                  margin-bottom: 32px;
                  font-size: 22px;
                  font-weight: 700;
                "
              >
                VEDIC JOURNEY
              </div>

              <h1
                style="
                  margin: 0 0 18px;
                  font-size: 28px;
                "
              >
                You're invited
              </h1>

              <p
                style="
                  margin: 0 0 16px;
                  font-size: 16px;
                  line-height: 1.7;
                "
              >
                Hi ${this.escapeHtml(params.name)},
              </p>

              <p
                style="
                  margin: 0 0 28px;
                  font-size: 16px;
                  line-height: 1.7;
                "
              >
                You've been invited to access the
                Vedic Journey Travel Console.
                Set up your password to activate
                your admin account.
              </p>

              <a
                href="${inviteUrl}"
                style="
                  display: inline-block;
                  padding: 14px 22px;
                  border-radius: 9px;
                  background: #d80bb9;
                  color: #ffffff;
                  font-size: 15px;
                  font-weight: 700;
                  text-decoration: none;
                "
              >
                Set Up Account
              </a>

              <p
                style="
                  margin: 28px 0 0;
                  color: #80777f;
                  font-size: 14px;
                  line-height: 1.6;
                "
              >
                This invitation expires in
                24 hours.
              </p>

              <p
                style="
                  margin: 32px 0 0;
                  color: #80777f;
                  font-size: 13px;
                  line-height: 1.6;
                "
              >
                If you weren't expecting this
                invitation, you can ignore this
                email.
              </p>
            </div>
          `,
        })

      return {
        messageId: result.messageId,
      }
    } catch (error) {
      console.error(
        'Brevo admin invite email failed:',
        error,
      )

      throw new InternalServerErrorException(
        'Unable to send admin invitation email',
      )
    }
  }

  private escapeHtml(
    value: string,
  ) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;')
  }
}