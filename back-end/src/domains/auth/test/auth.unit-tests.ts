import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { ChangePasswordDTO } from '../dto/change-password.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { GetProfileDto } from '../dto/get-profile.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usuarioService: Partial<UsuarioService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    // Mock das dependências
    usuarioService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      findByIdkey: jest.fn(),
      updatePassword: jest.fn(),
      update: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsuarioService, useValue: usuarioService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('deve registrar um novo usuário sem validar a senha', async () => {
      const createProfileDto: CreateProfileDto = {
        nome: 'Eduardo',
        username: 'eduardo',
        email: 'eduardo@example.com',
        senha: 'password123',
        cpf: '12345678901',
        dataNascimento: '1990-01-01',
      };

      const hashedPassword = await bcrypt.hash(createProfileDto.senha, 10);
      const usuarioCriado = {
        nome: createProfileDto.nome,
        username: createProfileDto.username,
        email: createProfileDto.email,
        senha: hashedPassword,
        cpf: createProfileDto.cpf,
        dataNascimento: createProfileDto.dataNascimento,
      };

      (usuarioService.create as jest.Mock).mockResolvedValue(usuarioCriado);

      const result = await authService.register(createProfileDto);


      const { senha: senhaResult, ...resultCreated } = result;
      const { senha, ...expectedPayload } = createProfileDto;

      expect(usuarioService.create).toHaveBeenCalledWith({
        ...expectedPayload,
        senha: expect.any(String), // Ignora o valor exato, mas verifica se é uma string
      });

      const { senha: _, ...expectedResult } = usuarioCriado;

      expect(resultCreated).toEqual(expectedResult);
    });
  });

  describe('validateUser', () => {
    it('deve validar o usuário com email e senha corretos', async () => {
      const login = 'eduardo@example.com';
      const senha = 'password123';
      const hashedPassword = await bcrypt.hash(senha, 10);

      const usuario = {
        idkey: 1,
        nome: 'Eduardo',
        username: 'eduardo',
        email: 'eduardo@example.com',
        senha: hashedPassword,
        cpf: '12345678901',
      };

      (usuarioService.findByEmail as jest.Mock).mockResolvedValue(usuario);

      const result = await authService.validateUser(login, senha);

      expect(usuarioService.findByEmail).toHaveBeenCalledWith(login);

      const { senha: _, ...expectedUser } = usuario;

      expect(result).toEqual(expectedUser);
    });

    it('deve validar o usuário com username e senha corretos', async () => {
      const login = 'eduardo';
      const senha = 'password123';
      const hashedPassword = await bcrypt.hash(senha, 10);

      const usuario = {
        idkey: 1,
        nome: 'Eduardo',
        username: 'eduardo',
        email: 'eduardo@example.com',
        senha: hashedPassword,
        cpf: '12345678901'
      };

      (usuarioService.findByUsername as jest.Mock).mockResolvedValue(usuario);

      const result = await authService.validateUser(login, senha);

      expect(usuarioService.findByUsername).toHaveBeenCalledWith(login);

      const { senha: _, ...expectedUser } = usuario;

      expect(result).toEqual(expectedUser);
    });

    it('deve retornar null se a senha estiver incorreta', async () => {
      const login = 'eduardo@example.com';
      const senha = 'wrongpassword';
      const hashedPassword = await bcrypt.hash('password123', 10);

      const usuario = {
        idkey: 1,
        nome: 'Eduardo',
        username: 'eduardo',
        email: 'eduardo@example.com',
        senha: hashedPassword,
        cpf: '12345678901',
      };

      (usuarioService.findByEmail as jest.Mock).mockResolvedValue(usuario);

      const result = await authService.validateUser(login, senha);

      expect(usuarioService.findByEmail).toHaveBeenCalledWith(login);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('deve gerar um token JWT para o usuário autenticado', async () => {
      const usuario = {
        idkey: 1,
        username: 'eduardo',
        email: 'eduardo@example.com',
      };

      const token = 'jwt.token.here';
      (jwtService.sign as jest.Mock).mockReturnValue(token);

      const result = await authService.login(usuario);

      expect(jwtService.sign).toHaveBeenCalledWith({
        idkey: usuario.idkey,
        username: usuario.username,
        email: usuario.email
      });
      expect(result).toEqual({ access_token: token });
    });
  });

  describe('changePassword', () => {
    it('deve alterar a senha do usuário quando as senhas forem válidas', async () => {
      const idkey = 1;
      const changePasswordDTO: ChangePasswordDTO = {
        senhaAtual: 'password123',
        senhaNova: 'newpassword456',
      };

      const hashedSenhaAtual = await bcrypt.hash(changePasswordDTO.senhaAtual, 10);
      const usuario = {
        idkey: 1,
        senha: hashedSenhaAtual,
      };

      (usuarioService.findByIdkey as jest.Mock).mockResolvedValue(usuario);
      (usuarioService.updatePassword as jest.Mock).mockResolvedValue(undefined);

      await authService.changePassword(idkey, changePasswordDTO);

      expect(usuarioService.findByIdkey).toHaveBeenCalledWith(idkey);
      expect(usuarioService.updatePassword).toHaveBeenCalled();

      const [id, newHashedPassword] = (usuarioService.updatePassword as jest.Mock).mock.calls[0];
      expect(id).toBe(idkey);
      expect(await bcrypt.compare(changePasswordDTO.senhaNova, newHashedPassword)).toBe(true);
    });
  });

  describe('getProfile', () => {
    it('deve retornar o perfil do usuário', async () => {
      const idkey = 1;
      const usuario = {
        idkey: 1,
        nome: 'Eduardo',
        username: 'eduardo',
        email: 'eduardo@example.com',
        cpf: '12345678901',
        dataNascimento: new Date('1990-01-01'),
        imagens: [
          {
            idkey: 1,
            path: 'path/to/image.png',
            dataCadastro: new Date(),
          },
        ],
      };

      (usuarioService.findByIdkey as jest.Mock).mockResolvedValue(usuario);

      const result = await authService.getProfile(idkey);

      expect(usuarioService.findByIdkey).toHaveBeenCalledWith(idkey);
      expect(result).toEqual({
        idkey: usuario.idkey,
        nome: usuario.nome,
        username: usuario.username,
        email: usuario.email,
        cpf: usuario.cpf,
        dataNascimento: usuario.dataNascimento,
        imagens: [
          {
            idkey: usuario.imagens[0].idkey,
            path: usuario.imagens[0].path,
            dataCadastro: usuario.imagens[0].dataCadastro,
          },
        ],
      });
    });

    it('deve lançar UnauthorizedException se o usuário não for encontrado', async () => {
      const idkey = 1;

      (usuarioService.findByIdkey as jest.Mock).mockResolvedValue(null);

      await expect(authService.getProfile(idkey)).rejects.toThrow(UnauthorizedException);

      expect(usuarioService.findByIdkey).toHaveBeenCalledWith(idkey);
    });
  });

  describe('updateProfile', () => {
    it('deve atualizar o perfil do usuário', async () => {
      const idkey = 1;
      const updateProfileDto: UpdateProfileDto = {
        nome: 'Eduardo Atualizado',
        username: 'eduardo.atualizado',
        imagensToAdd: ['nova/imagem1.jpg'],
        imagensToRemove: ['antiga/imagem2.jpg'],
      };

      const usuario = {
        idkey: 1,
        nome: 'Eduardo',
        username: 'eduardo',
        email: 'eduardo@example.com',
        cpf: '12345678901',
        dataNascimento: new Date('1990-01-01'),
        imagens: [],
      };

      const usuarioAtualizado = {
        ...usuario,
        ...updateProfileDto,
      };

      (usuarioService.findByIdkey as jest.Mock).mockResolvedValue(usuario);
      (usuarioService.update as jest.Mock).mockResolvedValue(usuarioAtualizado);

      const result = await authService.updateProfile(idkey, updateProfileDto);

      expect(usuarioService.findByIdkey).toHaveBeenCalledWith(idkey);
      expect(usuarioService.update).toHaveBeenCalledWith(idkey, updateProfileDto);
      expect(result).toEqual(usuarioAtualizado);
    });
  });

});
