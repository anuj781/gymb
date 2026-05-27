import nodemailer from 'nodemailer'

const sendEmail = async ({ to, subject, html }) => {
  try {
    /* CHECK REQUIRED DATA */

    if (!to || !subject || !html) {
      console.log('❌ Missing email data')

      return {
        success: false,
        message: 'Email to, subject or html is missing',
      }
    }

    /* CHECK ENV VARIABLES */

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('❌ EMAIL_USER or EMAIL_PASS missing')

      return {
        success: false,
        message: 'EMAIL_USER or EMAIL_PASS missing in environment variables',
      }
    }

    /* CREATE GMAIL SMTP TRANSPORTER */

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    /* VERIFY SMTP CONNECTION */

    await transporter.verify()

    console.log('✅ Gmail SMTP Connected Successfully')

    /* SEND EMAIL */

    const info = await transporter.sendMail({
      from: `"GYM PRO" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    })

    console.log('✅ Email Sent Successfully:', info.messageId)

    return {
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
    }
  } catch (error) {
    console.log('\n❌ EMAIL SENDING ERROR')
    console.log('MESSAGE:', error.message)
    console.log('CODE:', error.code)
    console.log('COMMAND:', error.command)
    console.log('RESPONSE:', error.response)
    console.log('STACK:', error.stack)

    return {
      success: false,
      message: error.message || 'Failed to send email',
      code: error.code || null,
      command: error.command || null,
      response: error.response || null,
    }
  }
}

export default sendEmail