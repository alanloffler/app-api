import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";

import { ApiResponse } from "@common/helpers/api-response.helper";
import { CreatePatientDto } from "@users/dto/create-patient.dto";
import { PatientProfile } from "@patient-profile/entities/patient-profile.entity";
import { PatientProfileService } from "@patient-profile/patient-profile.service";
import { User } from "@users/entities/user.entity";
import { UsersService } from "@users/users.service";

@Injectable()
export class CreatePatientUseCase {
  constructor(
    private readonly dataSource: DataSource,
    private readonly patientProfileService: PatientProfileService,
    private readonly usersService: UsersService,
  ) {}

  async execute(
    patientDto: CreatePatientDto,
    businessId: string,
  ): Promise<ApiResponse<{ user: User; profile: PatientProfile }>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const patient = await this.usersService.createPatient(patientDto.user, businessId, queryRunner.manager);

      const profile = await this.patientProfileService.create(
        patientDto.profile,
        user.id,
        businessId,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

      // TODO: fix return type
      return ApiResponse.created("Paciente creado", {} as { user: User; profile: PatientProfile });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
