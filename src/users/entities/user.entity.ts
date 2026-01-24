import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

import { Business } from "@business/entities/business.entity";
import { ProfessionalProfile } from "@professional-profile/entities/professional-profile.entity";
import { Role } from "@roles/entities/role.entity";

@Entity()
@Unique(["businessId", "email"])
@Unique(["businessId", "ic"])
@Unique(["businessId", "userName"])
@Index("idx_users_business", ["businessId"])
@Index("idx_users_business_email", ["businessId", "email"])
@Index("idx_users_business_role", ["businessId", "roleId"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 8, nullable: false })
  ic: string;

  @Column({ type: "varchar", length: 100, name: "user_name", nullable: false })
  userName: string;

  @Column({ type: "varchar", length: 100, name: "first_name", nullable: false })
  firstName: string;

  @Column({ type: "varchar", length: 100, name: "last_name", nullable: false })
  lastName: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  email: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  password: string;

  @Column({ type: "varchar", length: 10, name: "phone_number", nullable: false })
  phoneNumber: string;

  @Column({ type: "uuid", name: "role_id", nullable: false })
  roleId: string;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: "role_id" })
  role: Role;

  @Column({ type: "uuid", name: "business_id", nullable: false })
  businessId: string;

  @ManyToOne(() => Business, (business) => business.users)
  @JoinColumn({ name: "business_id" })
  business: Business;

  @OneToOne(() => ProfessionalProfile, (profile) => profile.user)
  professionalProfile?: ProfessionalProfile;

  @Column({ type: "text", nullable: true })
  refreshToken: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;
}
