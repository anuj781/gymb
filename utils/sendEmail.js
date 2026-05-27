import nodemailer from 'nodemailer'

const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  try {
    /* CHECK ENV VARIABLES */

    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS
    ) {
      console.log(
        '❌ EMAIL_USER or EMAIL_PASS missing'
      )

      return {
        success: false,
        message:
          'Email credentials are missing',
      }
    }

    /* CREATE TRANSPORTER */

    const transporter =
      nodemailer.createTransport({
        service: 'gmail',

        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })

    /* VERIFY SMTP CONNECTION */

    await transporter.verify()

    console.log(
      '✅ Gmail SMTP Connected Successfully'
    )

    /* SEND EMAIL */

    const info =
      await transporter.sendMail({
        from: `"GYM PRO" <${process.env.EMAIL_USER}>`,

        to,

        subject,

        html,
      })

    console.log(
      '✅ Email Sent Successfully:',
      info.messageId
    )

    return {
      success: true,
      message: 'Email sent successfully',
      info,
    }
  } catch (error) {
    console.log(
      '❌ Email Sending Error:',
      error.message
    )

    /* IMPORTANT:
       NEVER CRASH THE SERVER
    */

    return {
      success: false,
      message:
        error.message ||
        'Failed to send email',
    }
  }
}

export default sendEmail