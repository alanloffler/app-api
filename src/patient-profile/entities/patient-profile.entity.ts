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
export class PatientProfile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "user_id", nullable: false, unique: true })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ nullable: false })
  gender: string;

  @Column({ name: "birth_day", type: "date", nullable: false })
  birthDay: Date;

  @Column({ name: "blood_type", nullable: false })
  bloodType: string;

  @Column({ nullable: false })
  weight: number;

  @Column({ nullable: false })
  height: number;

  @Column({ name: "emergency_contact_name", nullable: false })
  emergencyContactName: string;

  @Column({ name: "emergency_contact_phone", nullable: false })
  emergencyContactPhone: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
