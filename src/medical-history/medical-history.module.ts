import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MedicalHistory } from "@medical-history/entities/medical-history.entity";
import { MedicalHistoryController } from "@medical-history/medical-history.controller";
import { MedicalHistoryService } from "@medical-history/medical-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([MedicalHistory])],
  controllers: [MedicalHistoryController],
  providers: [MedicalHistoryService],
})
export class MedicalHistoryModule {}
