import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";

import { ApiResponse } from "@common/helpers/api-response.helper";
import { ProfessionalProfileService } from "@professional-profile/professional-profile.service";
import { UpdateProfessionalDto } from "@users/dto/update-professional.dto";
import { UsersService } from "@users/users.service";

@Injectable()
export class UpdateProfessionalUseCase {
  constructor(
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
    private readonly professionalProfileService: ProfessionalProfileService,
  ) {}

  async execute(userId: string, businessId: string, updateDto: UpdateProfessionalDto): Promise<ApiResponse<void>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (updateDto.user) {
        await this.usersService.updateUser(userId, businessId, updateDto.user, queryRunner.manager);
      }

      if (updateDto.profile) {
        await this.professionalProfileService.update(userId, businessId, updateDto.profile, queryRunner.manager);
      }

      await queryRunner.commitTransaction();
      return ApiResponse.success("Profesional actualizado");
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
