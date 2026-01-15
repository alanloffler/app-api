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

  @RequiredPermissions(["admin-create", "patient-create", "professional-create"], "some")
  @Post()
  create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @RequiredPermissions(
    ["admin-create", "admin-update", "patient-create", "patient-update", "professional-create", "professional-update"],
    "some",
  )
  @Get("check/email/:email")
  checkEmailAvailability(@Param("email") email: string) {
    return this.usersService.checkEmailAvailability(email);
  }

  @RequiredPermissions(
    ["admin-create", "admin-update", "patient-create", "patient-update", "professional-create", "professional-update"],
    "some",
  )
  @Get("check/ic/:ic")
  checkIcAvailability(@Param("ic") id: string) {
    return this.usersService.checkIcAvailability(id);
  }

  @RequiredPermissions(
    ["admin-create", "admin-update", "patient-create", "patient-update", "professional-create", "professional-update"],
    "some",
  )
  @Get("check/username/:username")
  checkUsernameAvailability(@Param("username") userName: string) {
    return this.usersService.checkUsernameAvailability(userName);
  }

  @RequiredPermissions(["admin-view", "patient-view", "professional-view"], "some")
  @Get("role/:role")
  findAll(@Param("role") role: string) {
    return this.usersService.findAll(role);
  }

  @RequiredPermissions(["admin-view", "patient-view", "professional-view"], "some")
  @Get("all-soft-remove/:role")
  findAllSoftRemoved(@Param("role") role: string) {
    return this.usersService.findAllSoftRemoved(role);
  }

  @RequiredPermissions(["admin-view", "patient-view", "professional-view"], "some")
  @Get("soft-remove/:id")
  findOneSoftRemoved(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.findOneSoftRemoved(id);
  }

  @RequiredPermissions(["admin-view", "patient-view", "professional-view"], "some")
  @Get("credential/:id")
  findOneWithCredentials(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.findOneWithCredentials(id);
  }

  @RequiredPermissions(["admin-view", "patient-view", "professional-view"], "some")
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @RequiredPermissions(["admin-update", "patient-update", "professional-update"], "some")
  @Patch(":id")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @RequiredPermissions(["admin-restore", "patient-restore", "professional-restore"], "some")
  @Patch("restore/:id")
  restore(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.restore(id);
  }

  @RequiredPermissions(["admin-delete", "patient-delete", "professional-delete"], "some")
  @Delete("soft-remove/:id")
  softRemove(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.softRemove(id);
  }

  @RequiredPermissions(["admin-delete-hard", "patient-delete-hard", "professional-delete-hard"], "some")
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
