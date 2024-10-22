import { Module } from '@nestjs/common';

import { AuthModule }           from './auth/auth.module';
import { StorageModule }        from './storage/storage.module';
import { GestaoModule }         from './gestao/gestao.module';
import { GeralModule }          from './geral/geral.module';

@Module({
  imports: [
    AuthModule,
    StorageModule,
    GestaoModule,
    GeralModule,
  ]
})
export class DomainsModule { }