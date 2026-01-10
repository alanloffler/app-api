import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { CreateEventDto } from "@events/dto/create-event.dto";
import { Event } from "@events/entities/event.entity";
import { UpdateEventDto } from "@events/dto/update-event.dto";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  create(createEventDto: CreateEventDto) {
    return "This action adds a new event";
  }

  findAll() {
    return this.eventRepository.find({
      relations: ["user"],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
