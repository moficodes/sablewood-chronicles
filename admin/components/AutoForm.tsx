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
    <div className="space-y-6">
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
  const inputBaseClasses = "w-full bg-[#ffffff] p-4 rounded-2xl text-[#3e3101] placeholder:text-[#3e3101]/50 outline-none border-b-2 border-transparent focus:border-[#e05a33] transition-colors shadow-sm";

  if (schema.type === 'string') {
    return (
      <div>
        <label className="block text-sm font-medium mb-2 text-[#3e3101] ml-1">{labelText}</label>
        <input 
          type="text" 
          className={inputBaseClasses}
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
        />
      </div>
    );
  }

  if (schema.type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-medium mb-2 text-[#3e3101] ml-1">{labelText}</label>
        <textarea 
          className={`${inputBaseClasses} min-h-[120px] resize-y`}
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
        />
      </div>
    );
  }

  if (schema.type === 'number') {
    return (
      <div>
        <label className="block text-sm font-medium mb-2 text-[#3e3101] ml-1">{labelText}</label>
        <input 
          type="number" 
          className={inputBaseClasses}
          value={value === undefined ? '' : value} 
          onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))} 
        />
      </div>
    );
  }

  if (schema.type === 'object') {
    const safeValue = value || {};
    return (
      <div className="bg-[#fff3d5] rounded-3xl p-6 mb-4 mt-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-4 text-[#3e3101] ml-1">{labelText}</h3>
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
      <div className="bg-[#fff3d5] rounded-3xl p-6 mb-4 mt-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-4 text-[#3e3101] ml-1">{labelText}</h3>
        
        {safeArray.length === 0 ? (
          <p className="text-sm text-[#3e3101]/70 italic mb-4 ml-1">No items yet.</p>
        ) : (
          <div className="space-y-4 mb-6">
            {safeArray.map((item, index) => (
              <div key={index} className="flex gap-4 items-start bg-[#fff8f0] p-4 rounded-2xl shadow-sm">
                <div className="flex-1">
                  <FormField 
                    schema={{ ...schema.itemSchema, label: `Item ${index + 1}` }} 
                    value={item} 
                    onChange={(val) => handleItemChange(index, val)} 
                  />
                </div>
                <button 
                  onClick={() => handleRemove(index)}
                  className="bg-[#fff3d5] text-[#3e3101] px-4 py-2 rounded-2xl hover:bg-[#e05a33] hover:text-[#fff8f0] text-sm mt-8 transition-colors shadow-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        
        <button 
          onClick={handleAdd}
          className="bg-gradient-to-r from-[#e05a33] to-[#c74421] text-[#fff8f0] px-6 py-3 rounded-2xl hover:opacity-90 text-sm font-semibold shadow-md transition-opacity ml-1"
        >
          + Add {schema.itemSchema.label || 'Item'}
        </button>
      </div>
    );
  }

  return <div className="text-[#3e3101]">Unknown field type</div>;
}
