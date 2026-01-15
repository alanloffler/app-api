import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from "@nestjs/common";

import { CreateUserDto } from "@users/dto/create-user.dto";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "@auth/guards/permissions.guard";
import { RequiredPermissions } from "@auth/decorators/required-permissions.decorator";
import { UpdateUserDto } from "@users/dto/update-user.dto";
import { UsersService } from "@users/users.service";

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @RequiredPermissions(["patient-create", "professional-create"], "some")
  @Post()
  create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @RequiredPermissions(["patient-view", "professional-view"], "some")
  @Get(":role")
  findAll(@Param("role") role: string) {
    return this.usersService.findAll(role);
  }

  @RequiredPermissions(["patient-view", "professional-view"], "some")
  @Get("soft-removed/:role")
  findAllSoftRemoved(@Param("role") role: string) {
    return this.usersService.findAllSoftRemoved(role);
  }

  @RequiredPermissions(["patient-view", "professional-view"], "some")
  @Get(":id/credentials")
  findOneWithCredentials(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.findOneWithCredentials(id);
  }

  @RequiredPermissions(["patient-view", "professional-view"], "some")
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @RequiredPermissions(["patient-view", "professional-view"], "some")
  @Get(":id/soft-removed")
  findOneSoftRemoved(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.findOneSoftRemoved(id);
  }

  @RequiredPermissions(["patient-update", "professional-update"], "some")
  @Patch(":id")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @RequiredPermissions(["patient-delete", "professional-delete"], "some")
  @Delete("soft-remove/:id")
  softRemove(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.softRemove(id);
  }

  @RequiredPermissions(["patient-delete-hard", "professional-delete-hard"], "some")
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  @RequiredPermissions(["patient-restore", "professional-restore"], "some")
  @Patch("restore/:id")
  restore(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.restore(id);
  }

  // TODO: manage multi permissions (here: admin-create, admin-update)
  @Get("/email-availability/:email")
  checkEmailAvailability(@Param("email") email: string) {
    return this.usersService.checkEmailAvailability(email);
  }

  // TODO: manage multi permissions (here: admin-create, admin-update)
  @Get("/ic-availability/:ic")
  checkIcAvailability(@Param("ic") id: string) {
    return this.usersService.checkIcAvailability(id);
  }

  // TODO: manage multi permissions (here: admin-create, admin-update)
  @Get("/username-availability/:userName")
  checkUsernameAvailability(@Param("userName") userName: string) {
    return this.usersService.checkUsernameAvailability(userName);
  }
}
