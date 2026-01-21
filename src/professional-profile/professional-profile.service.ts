import { Injectable } from "@nestjs/common";

import { CreateProfessionalProfileDto } from "@professional-profile/dto/create-professional-profile.dto";
import { UpdateProfessionalProfileDto } from "@professional-profile/dto/update-professional-profile.dto";

@Injectable()
export class ProfessionalProfileService {
  create(createProfessionalProfileDto: CreateProfessionalProfileDto) {
    return "This action adds a new professionalProfile";
  }

  findAll() {
    return `This action returns all professionalProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} professionalProfile`;
  }

  update(id: number, updateProfessionalProfileDto: UpdateProfessionalProfileDto) {
    return `This action updates a #${id} professionalProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} professionalProfile`;
  }
}
