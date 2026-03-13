const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// Configuración del transporter de email
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',   // host explícito de Gmail
    port: 465,                // puerto SSL
    secure: true,             // true = SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    },
    tls: {
      rejectUnauthorized: false // evita el error del certificado
    }
  });
};

// Generar token de activación único
const generateActivationToken = () => {
  return uuidv4();
};

// Calcular fecha de expiración (24 horas)
const getTokenExpiration = () => {
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 24);
  return expiration;
};

// Plantilla de email de activación
const getActivationEmailTemplate = (userName, activationLink) => {
  return {
    subject: '🐕 Activa tu cuenta en Manage Dachshunds',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Activación de Cuenta</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .footer { background: #e9e9e9; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐕 ¡Bienvenido a Manage Dachshunds!</h1>
          </div>
          <div class="content">
            <h2>Hola ${userName},</h2>
            <p>¡Gracias por registrarte en nuestra plataforma de gestión de Dachshunds!</p>
            <p>Para completar tu registro y activar tu cuenta, haz clic en el siguiente botón:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${activationLink}" class="button">Activar mi cuenta</a>
            </p>
            <p><strong>⏰ Este enlace expira en 24 horas.</strong></p>
            <p>Si no puedes hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:</p>
            <p style="word-break: break-all; background: #fff; padding: 10px; border-left: 4px solid #667eea;">
              ${activationLink}
            </p>
            <p>Si no solicitaste esta cuenta, puedes ignorar este email.</p>
          </div>
          <div class="footer">
            <p>Este es un email automático, no respondas a este mensaje.</p>
            <p>© 2025 Manage Dachshunds - Sistema de Gestión</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      ¡Bienvenido a Manage Dachshunds!

      Hola ${userName},

      Gracias por registrarte en nuestra plataforma.
      Para activar tu cuenta, visita el siguiente enlace:

      ${activationLink}

      Este enlace expira en 24 horas.

      Si no solicitaste esta cuenta, puedes ignorar este email.

      © 2025 Manage Dachshunds
    `
  };
};

// Enviar email de activación
const sendActivationEmail = async (email, userName, activationToken) => {
  try {
    const transporter = createTransporter();
    const activationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/activate/${activationToken}`;
    const emailTemplate = getActivationEmailTemplate(userName, activationLink);

    const mailOptions = {
      from: `"Manage Dachshunds" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email de activación enviado:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateActivationToken,
  getTokenExpiration,
  sendActivationEmail
};