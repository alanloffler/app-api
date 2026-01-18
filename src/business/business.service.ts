import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ApiResponse } from "@common/helpers/api-response.helper";
import { Business } from "@business/entities/business.entity";
import { CreateBusinessDto } from "@business/dto/create-business.dto";
import { UpdateBusinessDto } from "@business/dto/update-business.dto";

@Injectable()
export class BusinessService {
  constructor(@InjectRepository(Business) private readonly businessRepository: Repository<Business>) {}

  async create(createBusinessDto: CreateBusinessDto): Promise<ApiResponse<Business>> {
    const business = this.businessRepository.create(createBusinessDto);
    const saveBusiness = await this.businessRepository.save(business);
    if (!saveBusiness) throw new HttpException("Error al crear negocio", HttpStatus.BAD_REQUEST);
    console.log(saveBusiness);

    return ApiResponse.created<Business>("Negocio creado", saveBusiness);
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

  // Without controller, for local strategy use
  public async findBySlug(slug: string): Promise<Business | null> {
    return await this.businessRepository.findOne({ where: { slug }, select: ["id", "slug", "tradeName"] });
  }
}
