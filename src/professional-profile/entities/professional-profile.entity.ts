import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "@users/entities/user.entity";

@Entity()
export class ProfessionalProfile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "user_id", unique: true })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "varchar", name: "license_id", nullable: false })
  licenseId: string;

  @Column({ type: "varchar", name: "professional_prefix", nullable: false })
  professionalPrefix: string;

  @Column({ type: "varchar", nullable: false })
  specialty: string;

  @Column({ type: "simple-array", name: "working_days", nullable: false })
  workingDays: number[];

  @Column({ type: "varchar", name: "start_hour", nullable: false, default: "07:00" })
  startHour: string;

  @Column({ type: "varchar", name: "end_hour", nullable: false, default: "20:00" })
  endHour: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
