import { Test, TestingModule } from '@nestjs/testing';
import { TipoUsuarioController } from './tipo-usuario.controller';
import { TipoUsuarioService } from './tipo-usuario.service';
import { CreateTipoUsuarioDto } from './dto/create-tipo-usuario.dto';
import { UpdateTipoUsuarioDto } from './dto/update-tipo-usuario.dto';
import { TipoUsuario } from './entities/tipo-usuario.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('TipoUsuarioController', () => {
  let controller: TipoUsuarioController;
  let service: TipoUsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoUsuarioController],
      providers: [
        {
          provide: TipoUsuarioService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TipoUsuarioController>(TipoUsuarioController);
    service = module.get<TipoUsuarioService>(TipoUsuarioService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new tipoUsuario', async () => {
      const createDto: CreateTipoUsuarioDto = {
        descricao: 'Admin',
      };
      const result = new TipoUsuario();
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createDto)).toEqual(result);
    });

    it('should throw an error if create fails', async () => {
      const createDto: CreateTipoUsuarioDto = {
        descricao: 'Admin',
      };
      jest.spyOn(service, 'create').mockRejectedValue(new Error());

      await expect(controller.create(createDto)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('should return an array of tipoUsuarios', async () => {
      const result = [new TipoUsuario()];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });

    it('should throw an error if findAll fails', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValue(new Error());

      await expect(controller.findAll()).rejects.toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    it('should return a single tipoUsuario', async () => {
      const result = new TipoUsuario();
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
    });

    it('should throw a 404 error if tipoUsuario not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      await expect(controller.findOne('1')).rejects.toThrow(HttpException);
    });

    it('should throw an error if findOne fails', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error());

      await expect(controller.findOne('1')).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a tipoUsuario', async () => {
      const updateDto: UpdateTipoUsuarioDto = { descricao: 'Updated Admin' };
      const result = new TipoUsuario();
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update('1', updateDto)).toEqual(result);
    });

    it('should throw a 404 error if tipoUsuario not found during update', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      await expect(controller.update('1', new UpdateTipoUsuarioDto())).rejects.toThrow(HttpException);
    });

    it('should throw an error if update fails', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new Error());

      await expect(controller.update('1', new UpdateTipoUsuarioDto())).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove a tipoUsuario', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await expect(controller.remove('1')).resolves.toBeUndefined();
    });

    it('should throw a 404 error if tipoUsuario not found during remove', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      await expect(controller.remove('1')).rejects.toThrow(HttpException);
    });

    it('should throw an error if remove fails', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new Error());

      await expect(controller.remove('1')).rejects.toThrow(HttpException);
    });
  });
});
