import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from "@nestjs/common";

import { BusinessId } from "@common/decorators/business-id.decorator";
import { CreateEventDto } from "@events/dto/create-event.dto";
import { EventsService } from "@events/events.service";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "@auth/guards/permissions.guard";
import { RequiredPermissions } from "@auth/decorators/required-permissions.decorator";
import { UpdateEventDto } from "@events/dto/update-event.dto";

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @RequiredPermissions("events-create")
  @Post()
  create(@Body() createEventDto: CreateEventDto, @BusinessId(ParseUUIDPipe) businessId: string) {
    return this.eventsService.create(createEventDto, businessId);
  }

  @RequiredPermissions("events-view")
  @Get()
  findAll(@BusinessId(ParseUUIDPipe) businessId: string) {
    return this.eventsService.findAll(businessId);
  }

  @RequiredPermissions("events-view")
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.eventsService.findOne(id);
  }

  @RequiredPermissions("events-update")
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
    @BusinessId(ParseUUIDPipe) businessId: string,
  ) {
    return this.eventsService.update(id, updateEventDto, businessId);
  }

  @RequiredPermissions("events-delete-hard")
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @BusinessId(ParseUUIDPipe) businessId: string) {
    return this.eventsService.remove(id, businessId);
  }
}
