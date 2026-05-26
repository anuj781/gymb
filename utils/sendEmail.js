import nodemailer from 'nodemailer'

const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  try {
    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS
    ) {
      throw new Error(
        'EMAIL_USER or EMAIL_PASS missing in environment variables'
      )
    }

    const transporter =
      nodemailer.createTransport({
        host: 'smtp.gmail.com',

        port: 465,

        secure: true,

        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })

    await transporter.verify()

    console.log(
      '✅ Gmail SMTP Connected Successfully'
    )

    const info =
      await transporter.sendMail({
        from: `"GYM PRO" <${process.env.EMAIL_USER}>`,

        to,

        subject,

        html,
      })

    console.log(
      '✅ Email Sent:',
      info.messageId
    )

    return info
  } catch (error) {
    console.log(
      '❌ Email Sending Error:',
      error
    )

    throw new Error(
      error.message || 'Failed to send email'
    )
  }
}

export default sendEmail