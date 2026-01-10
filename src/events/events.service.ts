import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ApiResponse } from "@common/helpers/api-response.helper";
import { CreateEventDto } from "@events/dto/create-event.dto";
import { Event } from "@events/entities/event.entity";
import { UpdateEventDto } from "@events/dto/update-event.dto";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    // TODO: 1. Check if event already exists (by startDate???)
    // TODO: 2. Check if user exists
    // TODO: 3. Check if professional exists

    const newEvent = this.eventRepository.create(createEventDto);
    const saveEvent = await this.eventRepository.save(newEvent);

    if (!saveEvent) {
      throw new HttpException("Error al crear el turno", HttpStatus.BAD_REQUEST);
    }

    return ApiResponse.created<Event>("Turno creado", saveEvent);
  }

  findAll() {
    return this.eventRepository.find({
      relations: ["user"],
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} event`;
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: string) {
    return `This action removes a #${id} event`;
  }
}
