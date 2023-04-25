import { ValidationError } from '@nestjs/common';
import { ValidationException } from '../exception/types/validation.exception';

const ValidationExceptionFactory = (
  errors: ValidationError[],
): ValidationException => {
  const errorDescription: Record<string, string[]> = {};
  errors.map((entryErrors: ValidationError) => {
    const entryProperty: string = entryErrors.property;
    Object.defineProperty(errorDescription, entryProperty, {
      value: [],
      enumerable: true,
    });
    for (const key in entryErrors.constraints) {
      if (entryErrors.constraints.hasOwnProperty(key)) {
        const entryError: string = entryErrors.constraints[key];
        errorDescription[entryProperty].push(entryError);
      }
    }
  });
  return new ValidationException(
    `Entity cannot be processed.`,
    errorDescription,
  );
};

export { ValidationExceptionFactory };
