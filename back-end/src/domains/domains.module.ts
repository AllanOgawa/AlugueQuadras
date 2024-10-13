import { Module } from '@nestjs/common';

import { AuthModule }           from './auth/auth.module';
import { StorageModule }        from './storage/storage.module';
import { GestaoModule }         from './gestao/gestao.module';

@Module({
  imports: [
    AuthModule,
    StorageModule,
    GestaoModule,
  ]
})
export class DomainsModule { }