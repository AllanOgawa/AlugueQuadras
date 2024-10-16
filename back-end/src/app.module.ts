import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { DomainsModule } from './domains/domains.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [ 
        'env/common.env',
        process.env.NODE_ENV === 'production' 
          ? 'env/.env.prod'
          : process.env.NODE_ENV === 'test' 
          ? 'env/.env.test' 
          : 'env/.env.dev',
      ],
      isGlobal: true,
    }),
    DatabaseModule,
    DomainsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

