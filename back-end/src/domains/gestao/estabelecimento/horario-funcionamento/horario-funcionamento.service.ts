import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HorarioFuncionamento } from './entities/horario-funcionamento.entity';
import { DataSource, In, Repository } from 'typeorm';
import { UpdateHorarioFuncionamentoDto } from './dto/update-horario-funcionamento.dto';
import { Estabelecimento } from '../entities/estabelecimento.entity';

@Injectable()
export class HorarioFuncionamentoService {
  constructor(
    @InjectRepository(HorarioFuncionamento)
    private readonly horarioFuncionamentoRepository: Repository<HorarioFuncionamento>,

    private readonly dataSource: DataSource,
  ) { }

  async updateBatch(updateBatchDtos: UpdateHorarioFuncionamentoDto[]): Promise<HorarioFuncionamento[]> {
    if (!Array.isArray(updateBatchDtos) || updateBatchDtos.length === 0) {
      throw new BadRequestException('O array de atualizações não pode estar vazio.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedHorarios: HorarioFuncionamento[] = [];

      for (const dto of updateBatchDtos) {
        const { idkey, ...updateData } = dto;

        const horario = await queryRunner.manager.findOne(HorarioFuncionamento, { where: { idkey } });

        if (!horario) {
          throw new NotFoundException(`Horário de funcionamento com idkey ${idkey} não encontrado.`);
        }

        Object.assign(horario, updateData);

        const updatedHorario = await queryRunner.manager.save(horario);
        updatedHorarios.push(updatedHorario);
      }

      await queryRunner.commitTransaction();

      return updatedHorarios;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao atualizar horários de funcionamento em lote:', error);
      throw new BadRequestException('Erro ao atualizar horários de funcionamento em lote.');
    } finally {
      await queryRunner.release();
    }
  }

  async syncHorariosFuncionamento(
    estabelecimento: Estabelecimento,
    horariosFuncionamentoDtos: UpdateHorarioFuncionamentoDto[]
  ): Promise<HorarioFuncionamento[]> {
    if (!Array.isArray(horariosFuncionamentoDtos)) {
      throw new BadRequestException('horariosFuncionamento deve ser um array.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Buscar todos os horários existentes para o estabelecimento
      const existingHorarios = await queryRunner.manager.find(HorarioFuncionamento, {
        where: { estabelecimento: { idkey: estabelecimento.idkey } },
      });

      const existingHorariosMap = new Map<number, HorarioFuncionamento>();
      existingHorarios.forEach(horario => existingHorariosMap.set(horario.idkey, horario));

      // 2. Processar os horários recebidos
      const incomingIds = new Set<number>();
      const horariosToUpdate: HorarioFuncionamento[] = [];
      const horariosToAdd: HorarioFuncionamento[] = [];

      for (const dto of horariosFuncionamentoDtos) {
        if (dto.idkey) {
          // Atualizar horário existente
          const existingHorario = existingHorariosMap.get(dto.idkey);
          if (!existingHorario) {
            throw new NotFoundException(`Horário de funcionamento com idkey ${dto.idkey} não encontrado.`);
          }

          // Atualizar os campos fornecidos
          Object.assign(existingHorario, dto);
          horariosToUpdate.push(existingHorario);
          incomingIds.add(dto.idkey);
        } else {
          // Adicionar novo horário
          const newHorario = this.horarioFuncionamentoRepository.create({
            ...dto,
            estabelecimento: estabelecimento,
          });
          horariosToAdd.push(newHorario);
        }
      }

      // 3. Remover horários que não estão no array recebido
      const existingIds = existingHorarios.map(h => h.idkey);
      const idsToRemove = existingIds.filter(id => !incomingIds.has(id));

      if (idsToRemove.length > 0) {
        // Remover horários inexistentes no array recebido
        await queryRunner.manager.delete(HorarioFuncionamento, idsToRemove);
      }

      // 4. Salvar atualizações
      if (horariosToUpdate.length > 0) {
        await queryRunner.manager.save(HorarioFuncionamento, horariosToUpdate);
      }

      // 5. Salvar novos horários
      if (horariosToAdd.length > 0) {
        await queryRunner.manager.save(HorarioFuncionamento, horariosToAdd);
      }

      // 6. Commit da transação
      await queryRunner.commitTransaction();

      // 7. Retornar os horários atualizados
      const updatedHorarios = await queryRunner.manager.find(HorarioFuncionamento, {
        where: { estabelecimento: { idkey: estabelecimento.idkey } },
      });

      return updatedHorarios;

    } catch (error) {
      // Reverter a transação em caso de erro
      await queryRunner.rollbackTransaction();
      console.error('Erro ao sincronizar horários de funcionamento:', error);
      throw new BadRequestException('Erro ao sincronizar horários de funcionamento.');
    } finally {
      // Liberar o QueryRunner
      await queryRunner.release();
    }
  }

  async findAllByEstabelecimento(idkey: number): Promise<HorarioFuncionamento[]> {
    return this.horarioFuncionamentoRepository.find({
      where: { estabelecimento: { idkey } }
    });
  }

  async removeBatch(idkeys: number[]): Promise<void> {
    if (!Array.isArray(idkeys) || idkeys.length === 0) {
      throw new BadRequestException('O array de idkeys não pode estar vazio.');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    // Conecta-se ao banco de dados e inicia uma transação
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verifica se todos os idkeys existem
      const existentes = await queryRunner.manager.find(HorarioFuncionamento, {
        where: { idkey: In(idkeys) },
      });

      const existentesIds = existentes.map(h => h.idkey);
      const missingIds = idkeys.filter(id => !existentesIds.includes(id));

      if (missingIds.length > 0) {
        throw new NotFoundException(`Horário(s) de funcionamento com idkey(s) ${missingIds.join(', ')} não encontrado(s).`);
      }

      // Remove os horários de funcionamento
      await queryRunner.manager.delete(HorarioFuncionamento, idkeys);

      // Confirma a transação
      await queryRunner.commitTransaction();
    } catch (error) {
      // Reverte a transação em caso de erro
      await queryRunner.rollbackTransaction();
      console.error('Erro ao remover horários de funcionamento em lote:', error);
      throw new BadRequestException('Erro ao remover horários de funcionamento em lote.');
    } finally {
      // Libera o query runner
      await queryRunner.release();
    }
  }
}
