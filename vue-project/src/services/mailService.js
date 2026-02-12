// src/services/mailService.js

// Endpoint del backend ligero de email.
// - En desarrollo: pasa por el proxy de Vite (/email-api)
// - En producción (Docker / build): llama directamente a localhost:4000
const EMAIL_BACKEND_URL = import.meta.env?.DEV
  ? '/email-api/email/send'
  : 'http://localhost:4000/email/send';

export async function enviarNotificacionCambioEstado(cliente, nuevoEstado) {
  const asunto = `Actualización de estado: ${nuevoEstado}`;
  const cuerpo = `Hola ${cliente.Nombre},\n\nEl estado de su reclamación ha cambiado a: ${nuevoEstado}.\n\nAtentamente,\nEl equipo de gestión.`;

  // Log en consola para verificar funcionamiento
  console.log(`📧 [Email] Cambio de estado para ${cliente.Nombre} <${cliente.Email}> → ${nuevoEstado}`);

  // Enviamos el correo al backend, que a su vez lo manda a MailHog (SMTP)
  try {
    const resp = await fetch(EMAIL_BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: cliente.Email,
        subject: asunto,
        text: cuerpo
      })
    });

    if (!resp.ok) {
      console.warn('El backend de email respondió con un estado no OK:', resp.status);
    } else {
      console.log("📧 Notificación de cambio de estado enviada vía backend de email");
    }
  } catch (error) {
    console.warn("No se ha podido contactar con el backend de email. ¿Está arrancado en localhost:4000?", error);
  }
}