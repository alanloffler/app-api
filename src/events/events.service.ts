import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, MoreThan, Not, Repository } from "typeorm";

import { ApiResponse } from "@common/helpers/api-response.helper";
import { BusinessService } from "@business/business.service";
import { CreateEventDto } from "@events/dto/create-event.dto";
import { Event } from "@events/entities/event.entity";
import { UpdateEventDto } from "@events/dto/update-event.dto";
import { UsersService } from "@users/users.service";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    private readonly businessService: BusinessService,
    private readonly usersService: UsersService,
  ) {}

  async create(createEventDto: CreateEventDto, businessId: string): Promise<ApiResponse<Event>> {
    await this.checkBusiness(businessId);
    await this.checkProfessional(createEventDto.professionalId, businessId);
    await this.checkPatient(createEventDto.userId, businessId);

    const slotAvailable = await this.checkSlotAvailable(createEventDto, businessId);
    if (!slotAvailable) throw new HttpException("El turno ya existe en la agenda", HttpStatus.BAD_REQUEST);

    const fullDto = { ...createEventDto, businessId };
    const newEvent = this.eventRepository.create(fullDto);
    const saveEvent = await this.eventRepository.save(newEvent);
    if (!saveEvent) throw new HttpException("Error al crear el turno", HttpStatus.BAD_REQUEST);

    return ApiResponse.created<Event>("Turno creado", saveEvent);
  }

  async findAll(businessId: string): Promise<ApiResponse<Event[]>> {
    const events = await this.eventRepository
      .createQueryBuilder("event")
      .leftJoin("event.user", "user")
      .leftJoin("user.role", "role")
      .select([
        "event",
        "user.id",
        "user.ic",
        "user.phoneNumber",
        "user.email",
        "user.firstName",
        "user.lastName",
        "role.name",
        "role.value",
      ])
      .where("event.businessId = :businessId", { businessId })
      .getMany();
    if (!events) throw new HttpException("Error al obtener los turnos", HttpStatus.NOT_FOUND);

    return ApiResponse.success<Event[]>("Turnos encontrados", events);
  }

  async findOne(id: string, businessId: string): Promise<ApiResponse<Event>> {
    const event = await this.findOneById(id, businessId);
    if (!event) throw new HttpException("Turno no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<Event>("Turno encontrado", event);
  }

  async update(id: string, updateEventDto: UpdateEventDto, businessId: string): Promise<ApiResponse<Event>> {
    await this.checkBusiness(businessId);
    await this.checkProfessional(updateEventDto?.professionalId, businessId);
    await this.checkPatient(updateEventDto?.userId, businessId);

    const event = await this.findOneById(id, businessId);
    const newStart = updateEventDto.startDate || event.startDate;
    const newEnd = updateEventDto.endDate || event.endDate;
    const newProfessional = updateEventDto.professionalId || event.professionalId;

    const slotAvailable = await this.checkSlotAvailable(
      {
        professionalId: newProfessional,
        startDate: newStart,
        endDate: newEnd,
      },
      businessId,
      event.id,
    );

    if (!slotAvailable) throw new HttpException("El turno se superpone con otro existente", HttpStatus.BAD_REQUEST);

    const result = await this.eventRepository.update(id, updateEventDto);
    if (!result) throw new HttpException("Error al actualizar turno", HttpStatus.BAD_REQUEST);

    const updatedEvent = await this.findOneById(id, businessId);

    return ApiResponse.success<Event>("Turno actualizado", updatedEvent);
  }

  async remove(id: string, businessId: string): Promise<ApiResponse<Event>> {
    const userToRemove = await this.findOneById(id, businessId);

    const result = await this.eventRepository.remove(userToRemove);
    if (!result) throw new HttpException("Error al eliminar turno", HttpStatus.BAD_REQUEST);

    return ApiResponse.removed<Event>("Turno eliminado", result);
  }

  // Private methods
  private async findOneById(id: string, businessId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { businessId, id } });
    if (!event) throw new HttpException("Turno no encontrado", HttpStatus.NOT_FOUND);

    return event;
  }

  private async checkBusiness(businessId?: string): Promise<void> {
    if (!businessId) throw new HttpException("Negocio no encontrado al crear el turno", HttpStatus.NOT_FOUND);

    const business = await this.businessService.findOne(businessId);
    if (!business) throw new HttpException("Negocio no encontrado al crear el turno", HttpStatus.NOT_FOUND);
  }

  private async checkProfessional(professionalId?: string, businessId?: string): Promise<void> {
    if (!professionalId || !businessId) return;

    const professional = await this.usersService.findOneById(professionalId, businessId);
    if (!professional) throw new HttpException("Profesional no encontrado al crear el turno", HttpStatus.NOT_FOUND);
  }

  private async checkPatient(userId?: string, businessId?: string): Promise<void> {
    if (!userId || !businessId) return;

    const user = await this.usersService.findOneById(userId, businessId);
    if (!user) throw new HttpException("Paciente no encontrado al crear el turno", HttpStatus.NOT_FOUND);
  }

  private async checkSlotAvailable(
    data: { professionalId: string; startDate: Date; endDate: Date },
    businessId: string,
    excludeId?: string,
  ): Promise<boolean> {
    const overlappingEvent = await this.eventRepository.findOne({
      where: {
        businessId,
        professionalId: data.professionalId,
        startDate: LessThan(data.endDate),
        endDate: MoreThan(data.startDate),
        ...(excludeId && { id: Not(excludeId) }),
      },
    });

    return !overlappingEvent;
  }
}
