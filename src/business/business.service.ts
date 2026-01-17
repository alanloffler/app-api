import { Injectable } from "@nestjs/common";

import { CreateBusinessDto } from "@business/dto/create-business.dto";
import { UpdateBusinessDto } from "@business/dto/update-business.dto";

@Injectable()
export class BusinessService {
  create(createBusinessDto: CreateBusinessDto) {
    return "This action adds a new business";
  }

  findAll() {
    return `This action returns all business`;
  }

  findOne(id: string) {
    return `This action returns a #${id} business`;
  }

  update(id: string, updateBusinessDto: UpdateBusinessDto) {
    return `This action updates a #${id} business`;
  }

  remove(id: string) {
    return `This action removes a #${id} business`;
  }
}
