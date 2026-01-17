import { PartialType } from "@nestjs/mapped-types";

import { CreateSettingDto } from "@settings/dto/create-setting.dto";

export class UpdateSettingDto extends PartialType(CreateSettingDto) {}
