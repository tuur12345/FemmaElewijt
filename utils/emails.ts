export function getRegistrationEmailHtml(activityTitle: string, date: string, userName: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #be185d;">Inschrijving Bevestigd</h1>
      <p>Dag ${userName},</p>
      <p>Je bent succesvol ingeschreven voor de activiteit: <strong>${activityTitle}</strong>.</p>
      <p><strong>Datum:</strong> ${date}</p>
      <p>We kijken ernaar uit je te verwelkomen!</p>
      <p>Met vriendelijke groeten,<br>Femma Elewijt</p>
    </div>
  `
}

export function getUnregistrationEmailHtml(activityTitle: string, userName: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #be185d;">Uitschrijving Bevestigd</h1>
      <p>Dag ${userName},</p>
      <p>Je bent uitgeschreven voor de activiteit: <strong>${activityTitle}</strong>.</p>
      <p>Jammer dat je er niet bij kan zijn.</p>
      <p>Met vriendelijke groeten,<br>Femma Elewijt</p>
    </div>
  `
}

import nodemailer from 'nodemailer'

export async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Femma Elewijt" <noreply@femmaelewijt.be>',
      to,
      subject,
      html,
    })
    console.log('Message sent: %s', info.messageId)
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}
