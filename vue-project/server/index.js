import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();

app.use(cors());
app.use(express.json());

// Configuración SMTP para MailHog (por defecto: localhost:1025)
const SMTP_HOST = process.env.SMTP_HOST || 'localhost';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '1025', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: SMTP_USER
    ? {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    : undefined
});

// Endpoint para enviar correos desde el frontend
app.post('/email/send', async (req, res) => {
  const { to, subject, text } = req.body || {};

  if (!to || !subject || !text) {
    return res.status(400).json({
      success: false,
      error: 'Faltan campos requeridos: to, subject, text'
    });
  }

  try {
    const info = await transporter.sendMail({
      from: 'sistema@cartelcoches.es',
      to,
      subject,
      text
    });

    console.log('📧 Email enviado vía MailHog:', {
      to,
      subject,
      messageId: info.messageId
    });

    return res.json({
      success: true,
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error enviando email vía MailHog:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al enviar el email'
    });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Backend de email escuchando en http://localhost:${PORT}`);
  console.log(
    `   Usando MailHog en ${SMTP_HOST}:${SMTP_PORT} (puerto SMTP, no el puerto web 8025)`
  );
});

