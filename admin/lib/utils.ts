import { FieldSchema, EntitySchema } from './schema';

/**
 * Recursively cleans an object by removing empty strings, nulls, undefined, 
 * and empty arrays/objects if they are marked as optional in the schema.
 */
export function cleanData(data: any, schema: EntitySchema | FieldSchema): any {
  if (data === null || data === undefined) return data;

  // Handle root EntitySchema (Record<string, FieldSchema>) vs FieldSchema
  const isEntitySchema = !('type' in schema);
  
  if (isEntitySchema) {
    const objSchema = schema as EntitySchema;
    const cleanedObj: Record<string, any> = {};
    
    for (const key of Object.keys(data)) {
      if (key === 'id') {
        cleanedObj[key] = data[key];
        continue;
      }
      
      const fieldSchema = objSchema[key];
      if (!fieldSchema) {
        cleanedObj[key] = data[key]; // Preserve unknown fields just in case
        continue;
      }
      
      const cleanedValue = cleanData(data[key], fieldSchema);
      
      // Determine if it's empty
      const isEmptyString = typeof cleanedValue === 'string' && cleanedValue.trim() === '';
      const isNullOrUndef = cleanedValue === null || cleanedValue === undefined;
      const isEmptyArray = Array.isArray(cleanedValue) && cleanedValue.length === 0;
      const isEmptyObject = typeof cleanedValue === 'object' && cleanedValue !== null && !Array.isArray(cleanedValue) && Object.keys(cleanedValue).length === 0;
      
      const isEmpty = isEmptyString || isNullOrUndef || isEmptyArray || isEmptyObject;
      
      if (isEmpty && fieldSchema.optional) {
        continue; // Strip it
      }
      
      cleanedObj[key] = cleanedValue;
    }
    return cleanedObj;
  }

  // Handle specific FieldSchema
  const fieldSchema = schema as FieldSchema;
  
  if (fieldSchema.type === 'object' && typeof data === 'object') {
    return cleanData(data, fieldSchema.fields);
  }
  
  if (fieldSchema.type === 'array' && Array.isArray(data)) {
    const cleanedArray = data.map((item: any) => cleanData(item, fieldSchema.itemSchema));
    // We don't remove empty items from within the array here, 
    // unless you want to filter out completely empty object items.
    // For now, just return the mapped array.
    return cleanedArray;
  }
  
  return data;
}
