import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ApiResponse } from "@common/helpers/api-response.helper";
import { CreateUserDto } from "@users/dto/create-user.dto";
import { UpdateUserDto } from "@users/dto/update-user.dto";
import { User } from "@users/entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto, businessId: string): Promise<ApiResponse<User>> {
    const checkIc = await this.checkIcAvailability(createUserDto.ic, businessId);
    if (checkIc.data === false) throw new HttpException("DNI ya registrado", HttpStatus.BAD_REQUEST);

    const checkEmail = await this.checkEmailAvailability(createUserDto.email, businessId);
    if (checkEmail.data === false) throw new HttpException("Email ya registrado", HttpStatus.BAD_REQUEST);

    const saltRounds = parseInt(this.configService.get("BCRYPT_SALT_ROUNDS") || "10");
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const createUser = this.userRepository.create({
      ...createUserDto,
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
      .leftJoin("user.role", "role")
      .select([
        "user.id",
        "user.ic",
        "user.userName",
        "user.firstName",
        "user.lastName",
        "user.email",
        "user.phoneNumber",
        "user.roleId",
        "user.createdAt",
        "user.updatedAt",
        "role.id",
        "role.name",
        "role.value",
      ])
      .where("user.businessId = :businessId", { businessId })
      .andWhere("role.value = :role", { role })
      .getMany();
    if (!users) throw new HttpException("Usuarios no encontrados", HttpStatus.NOT_FOUND);

    return ApiResponse.success<User[]>("Usuarios encontrados", users);
  }

  async findAllSoftRemoved(role: string, businessId: string): Promise<ApiResponse<User[]>> {
    const users = await this.userRepository.find({
      select: [
        "id",
        "ic",
        "userName",
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "role",
        "roleId",
        "createdAt",
        "updatedAt",
        "deletedAt",
      ],
      relations: ["role"],
      where: {
        businessId,
        role: {
          value: role,
        },
      },
      withDeleted: true,
    });
    if (!users) throw new HttpException("Usuarios no encontrados", HttpStatus.NOT_FOUND);

    return ApiResponse.success<User[]>("Usuarios encontrados", users);
  }

  async findOne(id: string, businessId: string): Promise<ApiResponse<User>> {
    const user = await this.userRepository.findOne({
      where: { businessId, id },
      select: [
        "id",
        "ic",
        "userName",
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "role",
        "roleId",
        "createdAt",
        "updatedAt",
      ],
    });
    if (!user) throw new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<User>("Usuario encontrado", user);
  }

  async findOneSoftRemoved(id: string, businessId: string): Promise<ApiResponse<User>> {
    const user = await this.userRepository.findOne({
      where: { businessId, id },
      select: [
        "id",
        "ic",
        "userName",
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "role",
        "roleId",
        "createdAt",
        "updatedAt",
        "deletedAt",
      ],
      withDeleted: true,
    });
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
    const user = await this.userRepository.findOne({
      where: { businessId, id },
      select: [
        "id",
        "ic",
        "userName",
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "role",
        "roleId",
        "createdAt",
        "updatedAt",
        "refreshToken",
      ],
    });
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

  // TODO: Implement validations
  public async getUser(id: string, businessId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { businessId, id },
      select: ["id", "ic", "email", "userName", "firstName", "lastName", "role", "createdAt"],
      relations: ["role"],
    });

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
    await this.userRepository.update(id, { refreshToken: undefined });
  }
}
