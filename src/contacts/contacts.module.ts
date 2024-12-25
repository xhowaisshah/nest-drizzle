import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  providers: [ContactsService],
  imports: [DrizzleModule],
  controllers: [ContactsController],
})
export class ContactModule {}