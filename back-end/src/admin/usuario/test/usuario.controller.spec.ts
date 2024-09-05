import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';

import { UsuarioController } from '../usuario.controller';
import { UsuarioService } from '../usuario.service';
import { TipoUsuarioService } from '../../tipo-usuario/tipo-usuario.service';

import { Usuario } from '../entities/usuario.entity';
import { TipoUsuario } from '../../tipo-usuario/entities/tipo-usuario.entity';

import { CreateUsuarioDto } from '../dto/create-usuario.dto';

// Importação dos mocks
import { createUsuarioSuccess } from './mock/create-usuario-sucess.mock';
import { createTipoUsuarioSucess } from '../../tipo-usuario/test/mock/create-tipo-usuario-sucess.mock';

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let service: UsuarioService;
  let tipoUsuarioService: TipoUsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useValue: {
            create:  jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update:  jest.fn(),
            remove:  jest.fn(),
          },
        },
        {
          provide: TipoUsuarioService,
          useValue: {
            create:  jest.fn(),
            findOne: jest.fn(),
            remove:  jest.fn()
          },
        },
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
    usuarioService = module.get<UsuarioService>(UsuarioService);
    tipoUsuarioService = module.get<TipoUsuarioService>(TipoUsuarioService); // Obtenção do serviço de TipoUsuario
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deverá criar um novo Usuário', async () => {
      const createDto: CreateUsuarioDto = createUsuarioSuccess;  // Mock para criar o usuário
      const createTipoUsuarioDto = createTipoUsuarioSucess; // Mock para criar o tipo de usuário
  
      const tipoUsuario = new TipoUsuario();
      tipoUsuario.idkey = 1;
      tipoUsuario.descricao = createTipoUsuarioSucess.descricao;
  
      const usuario = new Usuario();
      usuario.idkey_tipo_usuario = tipoUsuario.idkey;  // Associando o tipo de usuário ao usuário
      usuario.email = createDto.email;
      usuario.senha = createDto.senha;
  
      // Simula a criação de um TipoUsuario
      jest.spyOn(tipoUsuarioService, 'create').mockResolvedValue(tipoUsuario);
  
      // Simula a criação do Usuario
      jest.spyOn(service, 'create').mockResolvedValue(usuario);
  
      // Executa a criação de um TipoUsuario e a criação do Usuario
      expect(await tipoUsuarioService.create(createTipoUsuarioDto)).toEqual(tipoUsuario);
      expect(await controller.create(createDto)).toEqual(usuario);
    });
  
    it('deve gerar um erro se a criação falhar', async () => {
      const createDto: CreateUsuarioDto = createUsuarioSuccess;
      jest.spyOn(service, 'create').mockRejectedValue(new Error());
  
      await expect(controller.create(createDto)).rejects.toThrow(HttpException);
    });
  });
  

  // describe('findOne', () => {
  //   it('should return a usuario', async () => {
  //     const result = new Usuario();
  //     jest.spyOn(service, 'findOne').mockResolvedValue(result);

  //     expect(await controller.findOne('1')).toEqual(result);
  //   });

  //   it('should throw a 404 error if usuario not found', async () => {
  //     jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

  //     await expect(controller.findOne('1')).rejects.toThrow(HttpException);
  //   });

  //   it('should throw an error if findOne fails', async () => {
  //     jest.spyOn(service, 'findOne').mockRejectedValue(new Error());

  //     await expect(controller.findOne('1')).rejects.toThrow(HttpException);
  //   });
  // });

  // describe('remove', () => {
  //   it('should remove a usuario', async () => {
  //     jest.spyOn(service, 'remove').mockResolvedValue(undefined);

  //     await expect(controller.remove('1')).resolves.toBeUndefined();
  //   });

  //   it('should throw a 404 error if usuario not found during remove', async () => {
  //     jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

  //     await expect(controller.remove('1')).rejects.toThrow(HttpException);
  //   });

  //   it('should throw an error if remove fails', async () => {
  //     jest.spyOn(service, 'remove').mockRejectedValue(new Error());

  //     await expect(controller.remove('1')).rejects.toThrow(HttpException);
  //   });
  // });
});
