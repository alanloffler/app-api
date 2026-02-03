import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";

import { ApiResponse } from "@common/helpers/api-response.helper";
import { ProfessionalProfileService } from "@professional-profile/professional-profile.service";
import { UsersService } from "@users/users.service";

@Injectable()
export class RemoveProfessionalUseCase {
  constructor(
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
    private readonly professionalProfileService: ProfessionalProfileService,
  ) {}

  async execute(userId: string, businessId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.professionalProfileService.remove(userId, businessId, queryRunner.manager);
      await this.usersService.remove(userId, businessId, queryRunner.manager);

      await queryRunner.commitTransaction();
      return ApiResponse.success("Profesional eliminado");
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
