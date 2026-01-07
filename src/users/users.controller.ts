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

  @RequiredPermissions("users-create")
  @Post()
  create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @RequiredPermissions("users-view")
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @RequiredPermissions("users-view")
  @Get("soft-removed")
  findAllSoftRemoved() {
    return this.usersService.findAllSoftRemoved();
  }

  @RequiredPermissions("users-view")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @RequiredPermissions("users-view")
  @Get(":id/soft-removed")
  findOneSoftRemoved(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.findOneSoftRemoved(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @RequiredPermissions("users-delete")
  @Delete("soft-remove/:id")
  softRemove(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.softRemove(id);
  }

  @RequiredPermissions("users-delete-hard")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  @RequiredPermissions("users-restore")
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
