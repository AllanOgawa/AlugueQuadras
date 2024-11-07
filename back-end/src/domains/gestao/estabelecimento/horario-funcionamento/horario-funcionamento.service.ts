import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HorarioFuncionamento } from './entities/horario-funcionamento.entity';
import { DataSource, In, Repository } from 'typeorm';
import { UpdateHorarioFuncionamentoDto } from './dto/update-horario-funcionamento.dto';

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
