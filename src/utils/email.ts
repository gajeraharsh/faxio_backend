import nodemailer from "nodemailer"

export type EmailPayload = {
  to: string
  subject: string
  text?: string
  html?: string
}

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  }
  // Fallback transport that logs to console for local dev
  return {
    async sendMail(opts: any) {
      // eslint-disable-next-line no-console
      console.log("[DEV EMAIL]", {
        from: opts.from,
        to: opts.to,
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
      })
      return { messageId: "dev-logged" }
    },
  } as any
}

export async function sendEmail({ to, subject, text, html }: EmailPayload) {
  const from = process.env.SMTP_FROM || "no-reply@localhost"
  const transporter = getTransport()
  await transporter.sendMail({ from, to, subject, text, html })
}

export async function sendOtpEmail(to: string, code: string) {
  const subject = "Your verification code"
  const text = `Your OTP code is ${code}. It expires in 10 minutes.`
  const html = `<p>Your OTP code is <b>${code}</b>.</p><p>It expires in 10 minutes.</p>`
  await sendEmail({ to, subject, text, html })
}

export async function sendResetPasswordEmail(to: string, link: string) {
  const subject = "Reset your password"
  const text = `We received a request to reset your password. Click the link to proceed: ${link}. If you didn't request this, you can ignore this email.`
  const html = `<p>We received a request to reset your password.</p><p><a href="${link}">Click here to reset your password</a></p><p>If you didn't request this, you can ignore this email.</p>`
  await sendEmail({ to, subject, text, html })
}
