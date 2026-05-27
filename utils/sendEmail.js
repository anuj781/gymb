import transporter from '../config/email.js'

const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!to || !subject || !html) {
      return {
        success: false,
        message: 'Email to, subject or html is missing',
      }
    }

    const info = await transporter.sendMail({
      from: `"Gym App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: 'Please open this email in HTML mode to view the link.',
    })

    console.log('✅ Email sent:', info.messageId)

    return {
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
    }
  } catch (error) {
    console.log('❌ Email error:', error.message)

    return {
      success: false,
      message: error.message,
      code: error.code || null,
    }
  }
}

export default sendEmail