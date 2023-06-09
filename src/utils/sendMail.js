import nodemailer from 'nodemailer';
import config from '../config/config';
import logger from './logger';

export function sendMail(mailto, subject, text){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.MAIL_EMAIL,
            pass: config.MAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: config.MAIL_EMAIL,
        to: mailto,
        subject: subject,
        html: text
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return logger.error(JSON.stringify(error));
        }
    });
}


export function buildMailTemplate(fullname, link){
    return `<div style="background-color: #f2f2f2; padding: 20px;">
                <div style="background-color: #fff; padding: 20px; border-radius: 5px; max-width: 500px; margin: 0 auto;">
                    <div style="text-align: center;">
                        <img src="${config.HOST_DOMAIN}/img/cheems-logo.png" alt="Logo" style="width: 150px;">
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <h1 style="font-size: 1.5rem; font-weight: 600; color: #333;">${fullname}</h1>
                        <p style="font-size: 1rem; font-weight: 400; color: #333;">Puedes verificar tu cuenta haciendo clic en el siguiente botón:</p>
                        <a href="${link}" style="display: inline-block; background-color: #016CFD; padding: 10px 20px; border-radius: 5px; text-decoration: none; color: white; font-size: 1rem; font-weight: 600; margin-top: 20px;">Verificar cuenta</a>
                    </div>
                </div>
            </div>
            `;
}