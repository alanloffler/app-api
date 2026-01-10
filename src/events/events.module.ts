import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Event } from "@events/entities/event.entity";
import { EventsController } from "@events/events.controller";
import { EventsService } from "@events/events.service";

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
