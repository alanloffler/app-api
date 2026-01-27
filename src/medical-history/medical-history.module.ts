import { Module } from "@nestjs/common";

import { MedicalHistoryController } from "@medical-history/medical-history.controller";
import { MedicalHistoryService } from "@medical-history/medical-history.service";

@Module({
  controllers: [MedicalHistoryController],
  providers: [MedicalHistoryService],
})
export class MedicalHistoryModule {}
