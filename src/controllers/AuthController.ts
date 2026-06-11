import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import { LoginRepository } from "../repository/LoginRepository";
import { JwtService } from "../utils/JwtService";


export class AuthController {
    private loginRepo: LoginRepository;
    private jwtService: JwtService;
    private bcryptRounds: number;

    constructor() {
        this.loginRepo = new LoginRepository();
        this.jwtService = new JwtService();
        this.bcryptRounds = Number(process.env.BCRYPT_ROUNDS) || 10;
    }

    // criar = async (req: Request, res: Response) => {
    //     try {
    //         const { username, password } = req.body;

    //         if (!username || !password)
    //             return res.status(400).json({ message: 'Usuario e senha são obrigatorios' });

    //         if (password.length < 6)
    //             return res.status(400).json({ message: 'A senha deve ter ao menos 6 caracteres' });

    //         const userExisting = await this.loginRepo.findByUsername(username.trim());
    //         if (userExisting)
    //             return res.status(409).json({ message: 'Username já existe' });

    //         const password_hash = await bcrypt.hash(password, this.bcryptRounds);
    //         const login_id = await this.loginRepo.create(username, password_hash);

    //         res.status(201).json({ message: 'Usuario criado com sucesso', data: { login_id, username } });
    //     } catch (error: unknown) {
    //         console.error(error);
    //         if (error instanceof Error) {
    //             res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    //         }
    //         res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
    //     }
    // }

    login = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;

            if (!username || !password)
                return res.status(400).json({ message: 'Usuario e senha são obrigatorios' });

            const user = await this.loginRepo.findByUsername(username.trim());
            if (!user)
                return res.status(400).json({ message: 'Usuario não encontrado' });

            const passwordMatch = await bcrypt.compare(password, user.password_hash);
            if (!passwordMatch)
                return res.status(400).json({ message: 'Credenciais inválidas' });

            const payload = { login_id: user.id_login!, username: user.username };
            const accessToken = this.jwtService.gerarTokenAcesso(payload)

            res.status(201).json({ message: 'Login realizado com sucesso', data: { token_acesso: accessToken, expira_em: process.env.JWT_EXPIRES_IN } });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
        }
    }

    rotaProtegida = async (req: Request, res: Response) => {
        try {

            res.status(201).json({
                message: 'Você acesso um recurso protegido'
            });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
        }
    }
}