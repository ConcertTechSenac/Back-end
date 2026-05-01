require('dotenv').config();
const nodemailer = require ('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASSWORD_USER
    }
}); 

const sendVerifyEmail = async (email, verifyCode) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject : 'Seu código de verificação Hard Tech', 
        html : `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>Bem-vindo à Hard Tech!</h2>
        <p>Seu código de verificação é:</p>
        <h1 style="color: #007bff; font-size: 48px; letter-spacing: 5px;">${verifyCode}</h1>
        <p style="color: #666;">Este código expira em <strong>15 minutos</strong></p>
        <p style="color: #999; font-size: 12px;">Se você não solicitou este código, ignore este email.</p>
      </div>
    `, 
    });

     console.log(`Email enviado! O codigo ${verifyCode} foi enviado para ${email}`);

};

module.exports = {transporter, sendVerifyEmail};