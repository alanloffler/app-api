import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { ApiResponse } from "@common/helpers/api-response.helper";
import { CreateProfessionalDto } from "@users/dto/create-professional.dto";
import { ProfessionalProfile } from "@professional-profile/entities/professional-profile.entity";
import { ProfessionalProfileService } from "@professional-profile/professional-profile.service";
import { User } from "@users/entities/user.entity";
import { UsersService } from "@users/users.service";

@Injectable()
export class CreateProfessionalUseCase {
  constructor(
    private readonly dataSource: DataSource,
    private readonly professionalProfileService: ProfessionalProfileService,
    private readonly usersService: UsersService,
  ) {}

  async execute(
    professionalDto: CreateProfessionalDto,
    businessId: string,
  ): Promise<ApiResponse<{ user: User; profile: ProfessionalProfile }>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.usersService.createProfessional(professionalDto.user, businessId, queryRunner.manager);

      const profile = await this.professionalProfileService.create(
        professionalDto.profile,
        user.id,
        businessId,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

      return ApiResponse.created("Profesional creado", { user, profile });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
