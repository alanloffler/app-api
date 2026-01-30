import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "@users/entities/user.entity";

@Entity()
@Index("idx_prof_profile_business", ["businessId"])
@Index("idx_prof_profile_business_user", ["businessId", "userId"])
@Index("uq_prof_profile_business_license", ["businessId", "licenseId"], { unique: true })
export class ProfessionalProfile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // TODO: update professionals on database, then set nullable to false
  @Column({ type: "uuid", name: "business_id", nullable: true })
  businessId: string;

  @Column({ type: "uuid", name: "user_id", nullable: false })
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

  @Column({ type: "varchar", name: "slot_duration", nullable: false, default: "60" })
  slotDuration: string;

  @Column({ type: "varchar", name: "daily_exception_start", nullable: true })
  dailyExceptionStart: string;

  @Column({ type: "varchar", name: "daily_exception_end", nullable: true })
  dailyExceptionEnd: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
