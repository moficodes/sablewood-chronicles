export type FieldType = 'string' | 'number' | 'textarea' | 'object' | 'array';

export interface BaseFieldSchema {
  type: FieldType;
  label: string;
  optional?: boolean;
}

export interface StringFieldSchema extends BaseFieldSchema {
  type: 'string' | 'textarea';
}

export interface NumberFieldSchema extends BaseFieldSchema {
  type: 'number';
}

export interface ObjectFieldSchema extends BaseFieldSchema {
  type: 'object';
  fields: Record<string, FieldSchema>;
}

export interface ArrayFieldSchema extends BaseFieldSchema {
  type: 'array';
  itemSchema: FieldSchema;
}

export type FieldSchema = StringFieldSchema | NumberFieldSchema | ObjectFieldSchema | ArrayFieldSchema;

export type EntitySchema = Record<string, FieldSchema>;
