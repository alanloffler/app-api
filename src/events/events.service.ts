import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ApiResponse } from "@common/helpers/api-response.helper";
import { CreateEventDto } from "@events/dto/create-event.dto";
import { Event } from "@events/entities/event.entity";
import { UpdateEventDto } from "@events/dto/update-event.dto";
import { UsersService } from "@users/users.service";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly userService: UsersService,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const eventExists = await this.checkEventExistence(createEventDto.startDate);

    if (eventExists) {
      throw new HttpException("El turno ya existe en la agenda", HttpStatus.BAD_REQUEST);
    }

    // Already handle http exception
    await this.userService.findOneById(createEventDto.userId);

    // TODO: 3. Check if professional exists (must create module!)

    const newEvent = this.eventRepository.create(createEventDto);
    const saveEvent = await this.eventRepository.save(newEvent);

    if (!saveEvent) {
      throw new HttpException("Error al crear el turno", HttpStatus.BAD_REQUEST);
    }

    return ApiResponse.created<Event>("Turno creado", saveEvent);
  }

  async findAll() {
    // throw new HttpException("Error al obtener los turnos", HttpStatus.BAD_REQUEST);
    const events = await this.eventRepository.find({
      relations: ["user", "user.role"],
      select: {
        user: {
          id: true,
          ic: true,
          phoneNumber: true,
          email: true,
          firstName: true,
          lastName: true,
          role: {
            name: true,
            value: true,
          },
        },
      },
    });
    if (!events) throw new HttpException("Error al obtener los turnos", HttpStatus.NOT_FOUND);

    return ApiResponse.success<Event[]>("Turnos encontrados", events);
  }

  findOne(id: string) {
    return `This action returns a #${id} event`;
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  async remove(id: string): Promise<ApiResponse<Event>> {
    const userToRemove = await this.findOneById(id);

    const result = await this.eventRepository.remove(userToRemove);
    if (!result) throw new HttpException("Error al eliminar turno", HttpStatus.BAD_REQUEST);

    return ApiResponse.removed<Event>("Turno eliminado", result);
  }

  // Private methods
  private async findOneById(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new HttpException("Turno no encontrado", HttpStatus.NOT_FOUND);

    return event;
  }

  private async checkEventExistence(startDate: Date): Promise<boolean> {
    const event = await this.eventRepository.findOne({ where: { startDate } });
    return event ? true : false;
  }
}
