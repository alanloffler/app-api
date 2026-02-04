import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";

import { ApiResponse } from "@common/helpers/api-response.helper";
import { ProfessionalProfileService } from "@professional-profile/professional-profile.service";
import { UsersService } from "@users/users.service";

@Injectable()
export class SoftRemoveProfessionalUserCase {
  constructor(
    private readonly dataSource: DataSource,
    private readonly professionalProfileService: ProfessionalProfileService,
    private readonly usersService: UsersService,
  ) {}

  async execute(userId: string, businessId: string): Promise<ApiResponse<void>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.professionalProfileService.softRemove(userId, businessId, queryRunner.manager);
      await this.usersService.softRemove(userId, businessId, queryRunner.manager);

      await queryRunner.commitTransaction();

      return ApiResponse.success("Profesional eliminado");
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      queryRunner.release();
    }
  }
}
