import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { DataSource, Repository } from "typeorm";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { ApiResponse } from "@common/helpers/api-response.helper";
import { CreateProfessionalDto } from "@users/dto/create-professional.dto";
import { CreateUserDto } from "@users/dto/create-user.dto";
import { ProfessionalProfile } from "@professional-profile/entities/professional-profile.entity";
import { USER_PROFILE_SELECT, USER_ROLE_SELECT, USER_SELECT } from "@users/constants/user-select.constant";
import { UpdateUserDto } from "@users/dto/update-user.dto";
import { User } from "@users/entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async createProfessional(
    professionalDto: CreateProfessionalDto,
    businessId: string,
  ): Promise<ApiResponse<{ user: User; profile: ProfessionalProfile }>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingIc = await queryRunner.manager.findOne(User, {
        where: { businessId, ic: professionalDto.user.ic },
      });
      if (existingIc) throw new HttpException("DNI ya registrado", HttpStatus.BAD_REQUEST);

      const existingEmail = await queryRunner.manager.findOne(User, {
        where: { businessId, email: professionalDto.user.email },
      });
      if (existingEmail) throw new HttpException("Email ya registrado", HttpStatus.BAD_REQUEST);

      const existingLicense = await queryRunner.manager.findOne(ProfessionalProfile, {
        where: { licenseId: professionalDto.profile.licenseId },
      });
      if (existingLicense) throw new HttpException("Matrícula ya registrada", HttpStatus.BAD_REQUEST);

      const saltRounds = parseInt(this.configService.get("BCRYPT_SALT_ROUNDS") || "10");
      const hashedPassword = await bcrypt.hash(professionalDto.user.password, saltRounds);

      const user = queryRunner.manager.create(User, {
        ...professionalDto.user,
        businessId,
        password: hashedPassword,
      });
      const savedUser = await queryRunner.manager.save(user);

      const profile = queryRunner.manager.create(ProfessionalProfile, {
        ...professionalDto.profile,
        userId: savedUser.id,
      });
      const savedProfile = await queryRunner.manager.save(profile);

      await queryRunner.commitTransaction();

      return ApiResponse.created("Profesional creado", { user: savedUser, profile: savedProfile });
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof HttpException) throw error;

      if (error.code === "23505") {
        console.log(error);
        if (error.detail?.includes("email")) {
          throw new HttpException("Email ya registrado", HttpStatus.BAD_REQUEST);
        }
        if (error.detail?.includes("ic")) {
          throw new HttpException("DNI ya registrado", HttpStatus.BAD_REQUEST);
        }
        if (error.detail?.includes("license_id")) {
          throw new HttpException("Matrícula ya registrada", HttpStatus.BAD_REQUEST);
        }
        throw new HttpException("Ya existe un registro con estos datos", HttpStatus.BAD_REQUEST);
      }

      if (error.code === "23502") {
        const column = error.column || "desconocido";
        throw new HttpException(`El campo '${column}' es obligatorio`, HttpStatus.BAD_REQUEST);
      }

      if (error.code === "23503") {
        throw new HttpException("Referencia inválida: el registro relacionado no existe", HttpStatus.BAD_REQUEST);
      }

      const message = error.message || "Error al crear profesional";
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async create(createUserDto: CreateUserDto, businessId: string): Promise<ApiResponse<User>> {
    console.log(businessId);

    const checkIc = await this.checkIcAvailability(createUserDto.ic, businessId);
    if (checkIc.data === false) throw new HttpException("DNI ya registrado", HttpStatus.BAD_REQUEST);

    const checkEmail = await this.checkEmailAvailability(createUserDto.email, businessId);
    if (checkEmail.data === false) throw new HttpException("Email ya registrado", HttpStatus.BAD_REQUEST);

    const saltRounds = parseInt(this.configService.get("BCRYPT_SALT_ROUNDS") || "10");
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    // TODO: transaction to also store the profile with settings
    const createUser = this.userRepository.create({
      ...createUserDto,
      businessId,
      password: hashedPassword,
    });

    const saveUser = await this.userRepository.save(createUser);
    if (!saveUser) throw new HttpException("Error al crear usuario", HttpStatus.BAD_REQUEST);

    const savedUser = await this.findOneById(saveUser.id, businessId);
    if (!savedUser) throw new HttpException("Usuario no encontrado", HttpStatus.BAD_REQUEST);

    return ApiResponse.created<User>("Usuario creado", savedUser);
  }
  async findAll(role: string, businessId: string): Promise<ApiResponse<User[]>> {
    const users = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .leftJoinAndSelect("user.professionalProfile", "profile")
      .select([...USER_SELECT, ...USER_ROLE_SELECT, "profile.professionalPrefix"])
      .where("user.businessId = :businessId", { businessId })
      .andWhere("role.value = :role", { role })
      .orderBy("user.firstName", "ASC")
      .getMany();
    if (!users) throw new HttpException("Usuarios no encontrados", HttpStatus.NOT_FOUND);

    return ApiResponse.success<User[]>("Usuarios encontrados", users);
  }

  async findAllSoftRemoved(role: string, businessId: string): Promise<ApiResponse<User[]>> {
    const users = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .select([...USER_SELECT, ...USER_ROLE_SELECT])
      .where("user.businessId = :businessId", { businessId })
      .andWhere("role.value = :role", { role })
      .withDeleted()
      .getMany();
    if (!users) throw new HttpException("Usuarios no encontrados", HttpStatus.NOT_FOUND);

    return ApiResponse.success<User[]>("Usuarios encontrados", users);
  }

  async findOne(id: string, businessId: string): Promise<ApiResponse<User>> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .leftJoinAndSelect("user.professionalProfile", "profile")
      .select([...USER_SELECT, ...USER_ROLE_SELECT, ...USER_PROFILE_SELECT])
      .where("user.businessId = :businessId", { businessId })
      .andWhere("user.id = :id", { id })
      .withDeleted()
      .getOne();
    if (!user) throw new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<User>("Usuario encontrado", user);
  }

  async findOneSoftRemoved(id: string, businessId: string): Promise<ApiResponse<User>> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .leftJoinAndSelect("user.professionalProfile", "profile")
      .select([...USER_SELECT, ...USER_ROLE_SELECT, ...USER_PROFILE_SELECT])
      .where("user.businessId = :businessId", { businessId })
      .andWhere("user.id = :id", { id })
      .withDeleted()
      .getOne();
    if (!user) throw new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<User>("Usuario encontrado", user);
  }

  async findOneWithCredentials(id: string, businessId: string): Promise<ApiResponse<User>> {
    const user = await this.userRepository.findOne({
      where: { businessId, id },
    });
    if (!user) throw new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<User>("Usuario encontrado", user);
  }

  async findOneWithToken(id: string, businessId: string): Promise<ApiResponse<User>> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .leftJoinAndSelect("user.professionalProfile", "profile")
      .select([...USER_SELECT, "user.refreshToken"])
      .where("user.businessId = :businessId", { businessId })
      .andWhere("user.id = :id", { id })
      .getOne();
    if (!user) throw new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<User>("Usuario encontrado", user);
  }

  // TODO: Implement validations as AdminService
  async update(id: string, updateUserDto: UpdateUserDto, businessId: string): Promise<ApiResponse<User>> {
    await this.findOneById(id, businessId);

    const result = await this.userRepository.update(id, updateUserDto);
    if (!result) throw new HttpException("Error al actualizar usuario", HttpStatus.BAD_REQUEST);

    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (!updatedUser) throw new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<User>("Usuario actualizado", updatedUser);
  }

  async softRemove(id: string, businessId: string): Promise<ApiResponse<User>> {
    const userToRemove = await this.findOneById(id, businessId);
    if (!userToRemove) throw new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);

    const result = await this.userRepository.softRemove(userToRemove);
    if (!result) throw new HttpException("Error al eliminar usuario", HttpStatus.BAD_REQUEST);

    return ApiResponse.removed<User>("Usuario eliminado", result);
  }

  // TODO: REPLACE ALL FINDONE WITH THIS.FINDONEBY()
  //
  async remove(id: string, businessId: string): Promise<ApiResponse<User>> {
    const userToRemove = await this.findOneById(id, businessId);
    if (!userToRemove) throw new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);

    const result = await this.userRepository.remove(userToRemove);
    if (!result) throw new HttpException("Error al eliminar usuario", HttpStatus.BAD_REQUEST);

    return ApiResponse.removed<User>("Usuario eliminado", result);
  }

  async restore(id: string, businessId: string): Promise<ApiResponse<User>> {
    const userToRestore = await this.userRepository.findOne({
      where: { businessId, id },
      withDeleted: true,
    });
    if (!userToRestore) throw new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);

    const result = await this.userRepository.restore(userToRestore.id);
    if (!result) throw new HttpException("Error al restaurar usuario", HttpStatus.BAD_REQUEST);

    const restoredUser = await this.findOneById(id, businessId);
    if (!restoredUser) throw new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<User>("Usuario restaurado", restoredUser);
  }

  // Without controller for external API use
  public async findOneByEmail(email: string, businessId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { businessId, email }, relations: ["role"] });
    if (!user) return null;

    return user;
  }

  // Used in auth.service, there is managed error
  public async getUser(id: string, businessId: string): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoin("user.role", "role")
      .leftJoin("role.rolePermissions", "rolePermissions")
      .leftJoin("rolePermissions.permission", "permission")
      .addSelect([
        "role.id",
        "role.name",
        "role.value",
        "rolePermissions.roleId",
        "rolePermissions.permissionId",
        "permission.id",
        "permission.actionKey",
      ])
      .where("user.businessId = :businessId", { businessId })
      .andWhere("user.id = :id", { id })
      .getOne();

    return user;
  }

  public async checkEmailAvailability(email: string, businessId: string): Promise<ApiResponse<boolean>> {
    const user = await this.userRepository.findOne({ where: { businessId, email } });
    return ApiResponse.success<boolean>("Disponibilidad de email", user ? false : true);
  }

  public async checkIcAvailability(ic: string, businessId: string): Promise<ApiResponse<boolean>> {
    const user = await this.userRepository.findOne({ where: { businessId, ic } });
    return ApiResponse.success<boolean>("Disponibilidad de DNI", user ? false : true);
  }

  public async checkUsernameAvailability(userName: string, businessId: string): Promise<ApiResponse<boolean>> {
    const username = await this.userRepository.findOne({ where: { businessId, userName } });
    return ApiResponse.success<boolean>("Disponibilidad de nombre de usuario", username ? false : true);
  }

  public async findOneById(id: string, businessId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { businessId, id } });
    return user;
  }

  public async clearRefreshToken(id: string): Promise<void> {
    await this.userRepository.update(id, { refreshToken: null });
  }
}
