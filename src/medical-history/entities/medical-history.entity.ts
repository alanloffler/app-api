import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Event } from "@events/entities/event.entity";
import { User } from "@users/entities/user.entity";

@Entity("medical_history")
@Index("idx_medical_history_user", ["userId"])
@Index("idx_medical_history_event", ["eventId"])
@Index("idx_medical_history_user_created", ["userId", "createdAt"])
export class MedicalHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "event_id", type: "uuid", nullable: true })
  eventId: string;

  @ManyToOne(() => Event, { onDelete: "SET NULL" })
  @JoinColumn({ name: "event_id" })
  event: Event;

  @Column({ type: "varchar", nullable: false })
  reason: string;

  @Column({ default: false, type: "boolean", nullable: false })
  recipe: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;
}
