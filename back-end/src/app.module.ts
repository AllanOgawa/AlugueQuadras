import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { AdminModule } from './admin/admin.module';

  @Module({
    imports: [
      ConfigModule.forRoot({
        envFilePath:  process.env.NODE_ENV === 'production' ? '.env.prod'
          : process.env.NODE_ENV === 'test' ? '.env.test' 
          : '.env',
        isGlobal: true, 
      }),
      DatabaseModule,
      AdminModule
    ],
    controllers: [],
    providers: [],
  })
  export class AppModule { }

