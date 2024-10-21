import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { DomainsModule } from './domains/domains.module';
import { HealthModule } from './common/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        process.env.NODE_ENV === 'production' 
          ? 'env/production.env'
          : process.env.NODE_ENV === 'test' 
          ? 'env/test.env' 
          : process.env.NODE_ENV === 'homologation' 
          ? 'env/homologation.env' 
          : 'env/development.env' 
      ],
    }),
    DatabaseModule,
    DomainsModule,
    HealthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

