import { z } from 'zod';

export class SchemaValidator {
  constructor() {
    this.schemas = new Map();
  }

  registerSchema(key, schema) {
    this.schemas.set(key, schema);
  }

  validate(key, data) {
    const schema = this.schemas.get(key);
    if (!schema) return data;

    try {
      return schema.parse(data);
    } catch (error) {
      throw new Error(`Schema validation failed: ${error.message}`);
    }
  }
} 