import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

interface EmailData {
    to: string;
    petName: string;
    reporterName: string;
    reporterPhone: string;
    location: string;
    message?: string;
}

export async function sendPetSightingEmail(data: EmailData) {
    try {
        const { to, petName, reporterName, reporterPhone, location, message } = data;
        
        if (!resend) {
            console.log('📧 [DEV] Email que se enviaría:', { to, petName, reporterName, reporterPhone, location });
            return { success: true, data: { id: 'dev-mode' } };
        }
        
        const emailResponse = await resend.emails.send({
            from: 'Pet Finder <onboarding@resend.dev>',
            to: [to],
            subject: `¡Alguien vio a ${petName}!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #00C897;">🐾 ¡Buenas noticias!</h1>
                    <p>Alguien reportó haber visto a <strong>${petName}</strong>.</p>
                    
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3>Información del avistamiento:</h3>
                        <p><strong>Reportado por:</strong> ${reporterName}</p>
                        <p><strong>Teléfono:</strong> ${reporterPhone}</p>
                        <p><strong>Ubicación:</strong> ${location}</p>
                        ${message ? `<p><strong>Mensaje:</strong> ${message}</p>` : ''}
                    </div>
                    
                    <p>Te recomendamos contactar a esta persona lo antes posible.</p>
                    
                    <p style="color: #888; font-size: 12px;">
                        Este email fue enviado por Pet Finder App
                    </p>
                </div>
            `
        });
        
        return { success: true, data: emailResponse };
    } catch (error) {
        console.error('Error enviando email:', error);
        return { success: false, error };
    }
}
