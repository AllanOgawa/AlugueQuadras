import { Module }           from '@nestjs/common';
import { TypeOrmModule }    from '@nestjs/typeorm';

import { TipoEsporte }            from './entities/tipo-esporte.entity';
import { TipoEsporteService }     from './tipo-esporte.service';
import { TipoEsporteController }  from './tipo-esporte.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoEsporte])],
  controllers: [TipoEsporteController],
  providers: [TipoEsporteService],
  exports: [TipoEsporteService],
})
export class TipoEsporteModule {}
