import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AdminsController } from './admins.controller'
import { AdminsService } from './admins.service'
import { Admin, AdminSchema } from './schemas/admin.schema'
import {
  EmailModule,
} from '../email/email.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Admin.name,
        schema: AdminSchema,
      },
    ]),
    EmailModule
  ],

  controllers: [AdminsController],
  providers: [AdminsService],

  exports: [
    AdminsService,
    MongooseModule,
  ],
})
export class AdminsModule {}