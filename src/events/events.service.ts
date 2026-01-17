import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, MoreThan, Not, Repository } from "typeorm";

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

  async create(createEventDto: CreateEventDto, businessId: string) {
    const slotAvailable = await this.checkSlotAvailable(createEventDto);

    if (!slotAvailable) {
      throw new HttpException("El turno ya existe en la agenda", HttpStatus.BAD_REQUEST);
    }

    // Already handle http exception
    await this.userService.findOneById(createEventDto.userId, businessId);

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

  async findOne(id: string): Promise<ApiResponse<Event>> {
    const event = await this.eventRepository.findOneBy({ id });
    if (!event) throw new HttpException("Turno no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<Event>("Turno encontrado", event);
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<ApiResponse<Event>> {
    const event = await this.findOneById(id);

    const newStart = updateEventDto.startDate || event.startDate;
    const newEnd = updateEventDto.endDate || event.endDate;
    const newProfessional = updateEventDto.professionalId || event.professionalId;

    const slotAvailable = await this.checkSlotAvailable(
      {
        professionalId: newProfessional,
        startDate: newStart,
        endDate: newEnd,
      },
      event.id,
    );

    if (!slotAvailable) {
      throw new HttpException("El turno se superpone con otro existente", HttpStatus.BAD_REQUEST);
    }

    const result = await this.eventRepository.update(id, updateEventDto);
    if (!result) throw new HttpException("Error al actualizar turno", HttpStatus.BAD_REQUEST);

    const updatedEvent = await this.findOneById(id);

    return ApiResponse.success<Event>("Turno actualizado", updatedEvent);
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

  // Check to not overlap events, by professional id, start date and end date
  // TODO: check if professional exists (must create module!)
  private async checkSlotAvailable(
    data: { professionalId: string; startDate: Date; endDate: Date },
    excludeId?: string,
  ): Promise<boolean> {
    const overlappingEvent = await this.eventRepository.findOne({
      where: {
        professionalId: data.professionalId,
        startDate: LessThan(data.endDate),
        endDate: MoreThan(data.startDate),
        ...(excludeId && { id: Not(excludeId) }),
      },
    });

    return !overlappingEvent;
  }
}
