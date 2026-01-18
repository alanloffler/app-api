import cookieParser from "cookie-parser";
import { NestFactory, Reflector } from "@nestjs/core";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";

import { AppModule } from "@/app.module";

async function bootstrap() {
  const PORT: number = parseInt(process.env.PORT ?? "3000");

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      callback(null, true);

      const isAllowed = getAllowedPatterns().some((p) => p.test(origin));
      callback(isAllowed ? null : new Error("Not allowed by CORS"), isAllowed);
    },
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(PORT);
}

bootstrap();

const getAllowedPatterns = (): RegExp[] => {
  const patterns: RegExp[] = [];

  if (process.env.NODE_ENV !== "production") {
    patterns.push(/^https?:\/\/localhost:\d+$/);
    patterns.push(/^https?:\/\/[\w-]+\.localhost:\d+$/);
  }

  const domain = process.env.CORS_DOMAIN;
  if (domain) {
    const escaped = domain.replace(/\./g, "\\.");
    patterns.push(new RegExp(`^https:\\/\\/${escaped}$`));
    patterns.push(new RegExp(`^https:\\/\\/[\\w-]+\\.${escaped}$`));
  }

  return patterns;
};
