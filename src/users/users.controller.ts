import { Controller, Get, Post, Body, Patch, Param, Request, Delete, UseGuards, ParseUUIDPipe } from "@nestjs/common";

import type { IRequest } from "@auth/interfaces/request.interface";
import { BusinessId } from "@common/decorators/business-id.decorator";
import { CreateProfessionalDto } from "@users/dto/create-professional.dto";
import { CreateProfessionalUseCase } from "@users/create-professional.use-case";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "@auth/guards/permissions.guard";
import { RequiredPermissions } from "@auth/decorators/required-permissions.decorator";
import { RestoreProfessionalUseCase } from "@users/restore-professional.use-case";
import { RemoveProfessionalUseCase } from "@users/remove-professional.use-case";
import { SoftRemoveProfessionalUserCase } from "@users/soft-remove-professional.use-case";
import { UpdateProfessionalDto } from "@users/dto/update-professional.dto";
import { UpdateProfessionalUseCase } from "@users/update-professional.use-case";
import { UpdateUserDto } from "@users/dto/update-user.dto";
import { UsersService } from "@users/users.service";

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller("users")
export class UsersController {
  constructor(
    private readonly createProfessionalUseCase: CreateProfessionalUseCase,
    private readonly removeProfessionalUseCase: RemoveProfessionalUseCase,
    private readonly restoreProfessionalUseCase: RestoreProfessionalUseCase,
    private readonly softRemoveProfessionalUseCase: SoftRemoveProfessionalUserCase,
    private readonly updateProfessionalUseCase: UpdateProfessionalUseCase,
    private readonly usersService: UsersService,
  ) {}

  @RequiredPermissions("professional-create")
  @Post("create-professional")
  createProfessional(@Body() professionalDto: CreateProfessionalDto, @BusinessId() businessId: string) {
    return this.createProfessionalUseCase.execute(professionalDto, businessId);
  }

  @RequiredPermissions(
    ["admin-create", "admin-update", "patient-create", "patient-update", "professional-create", "professional-update"],
    "some",
  )
  @Get("check/email/:email")
  checkEmailAvailability(@Param("email") email: string, @BusinessId() businessId: string) {
    return this.usersService.checkEmailAvailability(email, businessId);
  }

  @RequiredPermissions(
    ["admin-create", "admin-update", "patient-create", "patient-update", "professional-create", "professional-update"],
    "some",
  )
  @Get("check/ic/:ic")
  checkIcAvailability(@Param("ic") id: string, @BusinessId() businessId: string) {
    return this.usersService.checkIcAvailability(id, businessId);
  }

  @RequiredPermissions(
    ["admin-create", "admin-update", "patient-create", "patient-update", "professional-create", "professional-update"],
    "some",
  )
  @Get("check/username/:username")
  checkUsernameAvailability(@Param("username") userName: string, @BusinessId() businessId: string) {
    return this.usersService.checkUsernameAvailability(userName, businessId);
  }

  // Without permissions, user can view his own profile
  // CHECK USE OF THIS CONTROLLER: this is the only which must
  // retrieve data with permissions!
  @Get("profile")
  findMe(@Request() req: IRequest, @BusinessId() businessId: string) {
    const userId = req.user.id;
    return this.usersService.findOne(userId, businessId);
  }

  // Without permissions, admin can update his own profile
  // TODO: MAKE SERVICE FOR THIS
  // @Patch("profile")
  // updateProfile(@Request() req: IRequest, @Body() user: UpdateUserDto, @BusinessId() businessId: string) {
  //   const userId = req.user.id;
  //   return this.usersService.update(userId, user, businessId);
  // }

  @RequiredPermissions(["admin-view", "patient-view", "professional-view"], "some")
  @Get("role/:role")
  findAll(@Param("role") role: string, @BusinessId() businessId: string) {
    return this.usersService.findAll(role, businessId);
  }

  @RequiredPermissions(["admin-view", "patient-view", "professional-view"], "some")
  @Get("all-soft-remove/:role")
  findAllSoftRemoved(@Param("role") role: string, @BusinessId() businessId: string) {
    return this.usersService.findAllSoftRemoved(role, businessId);
  }

  @RequiredPermissions("patient-view")
  @Get("patient-history/:id")
  findPatientWithHistory(@BusinessId() businessId: string, @Param("id") id: string) {
    return this.usersService.findPatientWithHistory(businessId, id);
  }

  @RequiredPermissions("patient-view")
  @Get("patient-soft-removed-history/:id")
  findPatientSoftRemovedWithHistory(@BusinessId() businessId: string, @Param("id") id: string) {
    return this.usersService.findPatientSoftRemovedWithHistory(businessId, id);
  }

  @RequiredPermissions(["admin-view", "patient-view", "professional-view"], "some")
  @Get("soft-remove/:id")
  findOneSoftRemoved(@Param("id", ParseUUIDPipe) id: string, @BusinessId() businessId: string) {
    return this.usersService.findOneSoftRemoved(id, businessId);
  }

  @RequiredPermissions(["admin-view", "patient-view", "professional-view"], "some")
  @Get("credential/:id")
  findOneWithCredentials(@Param("id", ParseUUIDPipe) id: string, @BusinessId() businessId: string) {
    return this.usersService.findOneWithCredentials(id, businessId);
  }

  // User by role with profile
  @RequiredPermissions("professional-view")
  @Get(":id/professional/profile/soft")
  findProfessionalSoftRemovedWithProfile(@BusinessId(ParseUUIDPipe) businessId: string, @Param("id") id: string) {
    return this.usersService.findProfessionalSoftRemovedWithProfile(businessId, id);
  }

  @RequiredPermissions(["admin-view", "patient-view", "professional-view"], "some")
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string, @BusinessId() businessId: string) {
    return this.usersService.findOne(id, businessId);
  }

  @RequiredPermissions("professional-update")
  @Patch(":id/professional")
  updateProfessional(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateProfessionalDto: UpdateProfessionalDto,
    @BusinessId() businessId: string,
  ) {
    return this.updateProfessionalUseCase.execute(id, businessId, updateProfessionalDto);
  }

  @RequiredPermissions("professional-restore")
  @Patch(":id/professional/restore")
  restoreProfessional(@Param("id", ParseUUIDPipe) id: string, @BusinessId(ParseUUIDPipe) businessId: string) {
    return this.restoreProfessionalUseCase.execute(id, businessId);
  }

  @RequiredPermissions(["admin-update", "patient-update", "professional-update"], "some")
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @BusinessId() businessId: string,
  ) {
    return this.usersService.update(id, businessId, updateUserDto);
  }

  @RequiredPermissions("professional-delete")
  @Delete(":id/professional/soft")
  softRemoveProfessional(@Param("id", ParseUUIDPipe) id: string, @BusinessId(ParseUUIDPipe) businessId: string) {
    return this.softRemoveProfessionalUseCase.execute(id, businessId);
  }

  @RequiredPermissions("professional-delete-hard")
  @Delete(":id/professional")
  removeProfessional(@Param("id", ParseUUIDPipe) id: string, @BusinessId(ParseUUIDPipe) businessId: string) {
    return this.removeProfessionalUseCase.execute(id, businessId);
  }
}
