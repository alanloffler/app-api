import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Index } from "typeorm";

import { User } from "@users/entities/user.entity";

@Entity("events")
@Index("idx_events_professional_start", ["professionalId", "startDate"])
@Index("idx_events_user_start", ["userId", "startDate"])
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ name: "start_date", type: "timestamptz", nullable: false })
  startDate: Date;

  @Column({ name: "end_date", type: "timestamptz", nullable: false })
  endDate: Date;

  @Column({ name: "professional_id", type: "uuid", nullable: false })
  professionalId: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;
}
