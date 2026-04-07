const pool = require('../configs/database_config');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');
const { sendVerifyEmail } = require('../configs/email_config');
const { generateAcessToken, generateToken } = require('../utils/Token_generation'); 



// Funções para cadastrar usuario 

class AuthCadastroLoginService { 
    static async buscarPorEmail(email){
        try{ 
            const connection = await pool.getConnection();
            const [usuarios] = await connection.query('Select * from usuarios where email = ?', [email]);
            connection.release();

            if (usuarios.length === 0) {
                return null; 
            } 

            const user = usuarios[0];
            return new UserModel(
                user.id,
                user.nome,
                user.email,
                user.senha,
                user.telefone,
                user.foto_perfil,
                user.email_verificado,
                user.token_verificacao,
                user.data_criacao,
                user.data_atualizacao
            );
        } catch (error) {
            console.error('Erro ao buscar usuário por email:', error);
            throw error;     
        }   
    } 

    static async buscarPorId(id){
        try{ 
            const connection = await pool.getConnection();
            const [usuarios] = await connection.query('Select * from usuarios where id = ?', [id]);
            connection.release();

            const user = usuarios[0];
            return new UserModel(
            user.id,
            user.nome,
            user.email,
            'Senha não pode ser retornada', // não retorna senha por segurança
            user.telefone,
            user.foto_perfil,
            user.email_verificado,
            null,
            user.data_criacao,
            user.data_atualizacao
          ); 

        } catch (error) {
            console.error('Erro ao buscar usuário por id:', error);
            throw error;     
        } 
    } 

    static validarCadastro(nome, email, senha) { 
        const erros = [];

        if (!nome || nome.trim() === '') {
            erros.push('O nome é obrigatório.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || email.trim() === '') {
            erros.push('O email é obrigatório.');
        }

        if (email && !emailRegex.test(email)) {
            erros.push('O email deve ser válido.');
        }

        if (!senha || senha.trim() === '') {    
            erros.push('A senha é obrigatória.');
        } else if (senha.length < 6) {
            erros.push('A senha deve conter pelo menos 6 caracteres.');
        } 

        if (erros.length > 0) {
          throw new Error(erros.join(', '));
        } 
    } 

    static async cadastrar (nome, email, senha, telefone) { 
        try {
            AuthCadastroLoginService.validarCadastro(nome, email, senha);
        
            const usuarioExistente = await AuthCadastroLoginService.buscarPorEmail(email);
            if (usuarioExistente) {
                throw new Error('Email já cadastrado. Por favor, use outro email.');
            } 

            const senhaHash = await bcrypt.hash(senha, 10);

            const token = generateToken();  


            const connection = await pool.getConnection();
            const [result] = await connection.query(
                'INSERT INTO usuarios (nome, email, senha, telefone, token_verificacao) VALUES (?, ?, ?, ?, ?)', 
                [nome, email, senhaHash, telefone, token]
            );
            connection.release(); 

            await sendVerifyEmail(email, token);

            return {
                success: true,
                message: 'Usuário cadastrado com sucesso! Por favor, verifique seu email para confirmar seu cadastro.',
                userid : result.insertId,
                email : email,
            };

         
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            throw error; 
        } 
    } 


    static async login (email, senha) {
        try {
            const usuario = await AuthCadastroLoginService.buscarPorEmail(email);
            if (!usuario) {
                throw new Error('Email ou senha inválidos.');
            } 

            if(!email || !senha) {
                throw new Error('Email e senha são obrigatórios para login.');
            } 

            if (usuario.emailVerificado == 0) {
                throw new Error('Email não verificado. Por favor, verifique seu email para confirmar seu cadastro.');
            }
            
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                throw new Error('Email ou senha inválidos.');
            } 

            const acessToken = generateAcessToken(usuario.id);
           
            return {
                success : true,
                message : 'Login realizado com sucesso!',
                token : acessToken,
                user : {
                    id : usuario.id,
                    nome : usuario.nome,
                    email : usuario.email,
                    telefone : usuario.telefone,
                    fotoPerfil : usuario.fotoPerfil,
                }
            }
        } catch (error) {
            console.error('Erro ao realizar login:', error);
            throw error; 
        }   
    } 

    static async verificarCodigo(email, otp) {
        try {
            // 1. Busca o usuário pelo email
            const usuario = await AuthCadastroLoginService.buscarPorEmail(email);
            
            if (!usuario) {
                throw new Error('Usuário não encontrado.');
            }

            // 2. Verifica se já está verificado
            if (usuario.emailVerificado == 1 || usuario.emailVerificado === true) {
                throw new Error('Este email já foi verificado anteriormente. Você já pode fazer login!');
            }

            // 3. Compara o código digitado com o código salvo no banco (tokenVerificacao)
            if (usuario.tokenVerificacao !== String(otp)) {
                throw new Error('Código de verificação inválido.');
            }

            // 4. Se tudo deu certo, atualiza o banco: 
            // Muda email_verificado para 1 (true) e limpa o código (NULL)
            const connection = await pool.getConnection();
            await connection.query(
                'UPDATE usuarios SET email_verificado = 1, token_verificacao = NULL, data_atualizacao = NOW() WHERE email = ?',
                [email]
            );
            connection.release();

            // 5. Retorna o sucesso para o Controller
            return {
                success: true,
                message: 'Email verificado com sucesso! Seu cadastro está completo.'
            };

        } catch (error) {
            console.error('Erro ao verificar código:', error);
            throw error;
        }
    }

}
module.exports = AuthCadastroLoginService; 

 
