import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from "@nestjs/common";

import { BusinessService } from "@business/business.service";
import { CreateBusinessDto } from "@business/dto/create-business.dto";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "@auth/guards/permissions.guard";
import { UpdateBusinessDto } from "@business/dto/update-business.dto";

// TODO: add permissions
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller("business")
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessService.create(createBusinessDto);
  }

  @Get()
  findAll() {
    return this.businessService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.businessService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateBusinessDto: UpdateBusinessDto) {
    return this.businessService.update(id, updateBusinessDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.businessService.remove(id);
  }
}
