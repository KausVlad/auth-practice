import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [CoffeesModule, UsersModule, PrismaModule, IamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
