import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AdminModule } from './admin/admin.module';
import { EstabelecimentoModule } from './domains/gestao/estabelecimento/estabelecimento.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:  process.env.NODE_ENV === 'production' ? '.env.prod'
        : process.env.NODE_ENV === 'test' ? '.env.test' 
        : '.env',
      isGlobal: true, 
    }),
    DatabaseModule,
    AuthModule,
    AdminModule,
    EstabelecimentoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

