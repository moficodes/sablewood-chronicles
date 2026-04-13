'use client';

import React from 'react';
import { FieldSchema, EntitySchema } from '../lib/schema';

interface AutoFormProps {
  schema: EntitySchema;
  data: any;
  onChange: (data: any) => void;
}

export function AutoForm({ schema, data, onChange }: AutoFormProps) {
  // Ensure data is at least an object
  const safeData = data || {};

  const handleFieldChange = (key: string, value: any) => {
    onChange({ ...safeData, [key]: value });
  };

  return (
    <div className="space-y-4">
      {Object.entries(schema).map(([key, fieldSchema]) => (
        <FormField 
          key={key} 
          schema={fieldSchema} 
          value={safeData[key]} 
          onChange={(val) => handleFieldChange(key, val)} 
        />
      ))}
    </div>
  );
}

interface FormFieldProps {
  schema: FieldSchema;
  value: any;
  onChange: (val: any) => void;
}

function FormField({ schema, value, onChange }: FormFieldProps) {
  const labelText = schema.label + (schema.optional ? ' (Optional)' : '');

  if (schema.type === 'string') {
    return (
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">{labelText}</label>
        <input 
          type="text" 
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
        />
      </div>
    );
  }

  if (schema.type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">{labelText}</label>
        <textarea 
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] bg-white"
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
        />
      </div>
    );
  }

  if (schema.type === 'number') {
    return (
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">{labelText}</label>
        <input 
          type="number" 
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          value={value === undefined ? '' : value} 
          onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))} 
        />
      </div>
    );
  }

  if (schema.type === 'object') {
    const safeValue = value || {};
    return (
      <div className="border border-gray-200 rounded p-4 bg-gray-50 mb-2 mt-2">
        <h3 className="font-semibold text-lg mb-3 text-gray-800">{labelText}</h3>
        <AutoForm 
          schema={schema.fields} 
          data={safeValue} 
          onChange={onChange} 
        />
      </div>
    );
  }

  if (schema.type === 'array') {
    const safeArray: any[] = Array.isArray(value) ? value : [];
    
    const handleItemChange = (index: number, newVal: any) => {
      const newArr = [...safeArray];
      newArr[index] = newVal;
      onChange(newArr);
    };

    const handleRemove = (index: number) => {
      const newArr = safeArray.filter((_, i) => i !== index);
      onChange(newArr);
    };

    const handleAdd = () => {
      // Provide an empty structure based on type
      let defaultVal: any = '';
      if (schema.itemSchema.type === 'object') defaultVal = {};
      if (schema.itemSchema.type === 'array') defaultVal = [];
      if (schema.itemSchema.type === 'number') defaultVal = 0;
      
      onChange([...safeArray, defaultVal]);
    };

    return (
      <div className="border border-gray-200 rounded p-4 bg-gray-50 mb-2 mt-2">
        <h3 className="font-semibold text-lg mb-3 text-gray-800">{labelText}</h3>
        
        {safeArray.length === 0 ? (
          <p className="text-sm text-gray-500 italic mb-3">No items yet.</p>
        ) : (
          <div className="space-y-4 mb-4">
            {safeArray.map((item, index) => (
              <div key={index} className="flex gap-2 items-start border-l-2 border-blue-400 pl-3">
                <div className="flex-1">
                  <FormField 
                    schema={{ ...schema.itemSchema, label: `Item ${index + 1}` }} 
                    value={item} 
                    onChange={(val) => handleItemChange(index, val)} 
                  />
                </div>
                <button 
                  onClick={() => handleRemove(index)}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm mt-7"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        
        <button 
          onClick={handleAdd}
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 text-sm"
        >
          + Add {schema.itemSchema.label || 'Item'}
        </button>
      </div>
    );
  }

  return <div>Unknown field type</div>;
}