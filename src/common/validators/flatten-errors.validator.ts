import { ValidationError } from "class-validator";

export function flattenErrors(errors: ValidationError[], parentPath = ""): string[] {
  const messages: string[] = [];

  for (const error of errors) {
    const currentPath = parentPath ? `${parentPath}.${error.property}` : error.property;

    if (error.constraints) {
      messages.push(...Object.values(error.constraints).map((msg) => msg.replace(`${currentPath}.`, "")));
    }

    if (error.children?.length) {
      messages.push(...flattenErrors(error.children, currentPath));
    }
  }

  return messages;
}
