import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { DatabaseModule } from './database/database.module';
import { AdminModule } from './admin/admin.module';

  @Module({
    imports: [
      ConfigModule.forRoot({
        envFilePath: '.env',
        isGlobal: true, 
      }),
      DatabaseModule,
      AdminModule
    ],
    controllers: [],
    providers: [
    //   {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
    ],
  })
  export class AppModule { }

