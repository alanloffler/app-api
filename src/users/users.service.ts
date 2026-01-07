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

  async create(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    const checkIc = await this.checkIcAvailability(createUserDto.ic);
    if (checkIc.data === false) throw new HttpException("DNI ya registrado", HttpStatus.BAD_REQUEST);

    const checkEmail = await this.checkEmailAvailability(createUserDto.email);
    if (checkEmail.data === false) throw new HttpException("Email ya registrado", HttpStatus.BAD_REQUEST);

    const saltRounds = parseInt(this.configService.get("BCRYPT_SALT_ROUNDS") || "10");
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const createUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const saveUser = await this.userRepository.save(createUser);
    if (!saveUser) throw new HttpException("Error al crear paciente", HttpStatus.BAD_REQUEST);

    return ApiResponse.created<User>("Paciente creado", saveUser);
  }

  async findAll(): Promise<ApiResponse<User[]>> {
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
      ],
    });
    if (!users) throw new HttpException("Pacientes no encontrados", HttpStatus.NOT_FOUND);

    return ApiResponse.success<User[]>("Pacientes encontrados", users);
  }

  async findAllSoftRemoved(): Promise<ApiResponse<User[]>> {
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
      withDeleted: true,
    });
    if (!users) throw new HttpException("Pacientes no encontrados", HttpStatus.NOT_FOUND);

    return ApiResponse.success<User[]>("Pacientes encontrados", users);
  }

  async findOne(id: string): Promise<ApiResponse<User>> {
    const user = await this.userRepository.findOne({
      where: { id },
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
    if (!user) throw new HttpException("Paciente no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<User>("Paciente encontrado", user);
  }

  async findOneWithToken(id: string): Promise<ApiResponse<User>> {
    const user = await this.userRepository.findOne({
      where: { id },
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
    if (!user) throw new HttpException("Paciente no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<User>("Paciente encontrado", user);
  }

  // TODO: Implement validations as AdminService
  async update(id: string, updateUserDto: UpdateUserDto): Promise<ApiResponse<User>> {
    const result = await this.userRepository.update(id, updateUserDto);
    if (!result) throw new HttpException("Error al actualizar paciente", HttpStatus.BAD_REQUEST);

    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (!updatedUser) throw new HttpException("Paciente no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<User>("Paciente actualizado", updatedUser);
  }

  async softRemove(id: string): Promise<ApiResponse<User>> {
    const userToRemove = await this.findOneById(id);

    const result = await this.userRepository.softRemove(userToRemove);
    if (!result) throw new HttpException("Error al eliminar paciente", HttpStatus.BAD_REQUEST);

    return ApiResponse.removed<User>("Paciente eliminado", result);
  }

  // TODO: Implement logic
  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  public async findOneByEmail(email: string) {
    const admin = await this.userRepository.findOne({ where: { email } });

    return admin;
  }

  public async getUser(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ["id", "ic", "email", "userName", "firstName", "lastName", "role"],
    });

    return user;
  }

  public async checkEmailAvailability(email: string): Promise<ApiResponse<boolean>> {
    const user = await this.userRepository.findOne({ where: { email } });
    return ApiResponse.success<boolean>("Disponibilidad de email", user ? false : true);
  }

  public async checkIcAvailability(ic: string): Promise<ApiResponse<boolean>> {
    const user = await this.userRepository.findOne({ where: { ic } });
    return ApiResponse.success<boolean>("Disponibilidad de DNI", user ? false : true);
  }

  public async checkUsernameAvailability(userName: string): Promise<ApiResponse<boolean>> {
    const username = await this.userRepository.findOne({ where: { userName } });
    return ApiResponse.success<boolean>("Disponibilidad de nombre de usuario", username ? false : true);
  }

  private async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new HttpException("Paciente no encontrado", HttpStatus.NOT_FOUND);

    return user;
  }
}
