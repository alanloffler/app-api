import cookieParser from "cookie-parser";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { readFileSync } from "fs";

import { AppModule } from "@/app.module";
import { getAllowedPatterns } from "@common/helpers/domain-patterns.helper";

async function bootstrap() {
  const isDev = process.env.NODE_ENV === "development";

  let httpsOptions: { key: Buffer; cert: Buffer } | undefined = undefined;

  if (isDev) {
    httpsOptions = {
      key: readFileSync("/Users/alan/.certs/localhost-key.pem"),
      cert: readFileSync("/Users/alan/.certs/localhost.pem"),
    };
  }

  const PORT: number = parseInt(process.env.PORT ?? "3000");

  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.enableCors({
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    origin: (origin: string | undefined, callback: (err: Error | null, origin?: boolean) => void) => {
      if (!origin) return callback(null, true);

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
