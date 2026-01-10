import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";

import { CreateEventDto } from "@events/dto/create-event.dto";
import { EventsService } from "@events/events.service";
import { UpdateEventDto } from "@events/dto/update-event.dto";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.eventsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.eventsService.remove(+id);
  }
}
