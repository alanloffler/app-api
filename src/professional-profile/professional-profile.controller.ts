import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";

import { CreateProfessionalProfileDto } from "@professional-profile/dto/create-professional-profile.dto";
import { ProfessionalProfileService } from "@professional-profile/professional-profile.service";
import { UpdateProfessionalProfileDto } from "@professional-profile/dto/update-professional-profile.dto";

// TODO: auth decorators
@Controller("professional-profile")
export class ProfessionalProfileController {
  constructor(private readonly professionalProfileService: ProfessionalProfileService) {}

  @Post()
  create(@Body() createProfessionalProfileDto: CreateProfessionalProfileDto) {
    return this.professionalProfileService.create(createProfessionalProfileDto);
  }

  @Get()
  findAll() {
    return this.professionalProfileService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.professionalProfileService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProfessionalProfileDto: UpdateProfessionalProfileDto) {
    return this.professionalProfileService.update(+id, updateProfessionalProfileDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.professionalProfileService.remove(+id);
  }
}
