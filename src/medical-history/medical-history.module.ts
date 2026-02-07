import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MedicalHistory } from "@medical-history/entities/medical-history.entity";
import { MedicalHistoryController } from "@medical-history/medical-history.controller";
import { MedicalHistoryService } from "@medical-history/medical-history.service";
import { Permission } from "@permissions/entities/permission.entity";
import { Role } from "@roles/entities/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MedicalHistory, Role, Permission])],
  controllers: [MedicalHistoryController],
  providers: [MedicalHistoryService],
})
export class MedicalHistoryModule {}
