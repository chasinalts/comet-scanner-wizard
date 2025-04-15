import { useEffect } from 'react';

type DependencyRule<T> = {
  when: (values: T) => boolean;
  then?: (values: T) => Partial<T>;
  disable?: (keyof T)[];
  hide?: (keyof T)[];
  require?: (keyof T)[];
  validate?: (values: T) => { [K in keyof T]?: string };
};

interface FieldDependenciesOptions<T> {
  values: T;
  rules: DependencyRule<T>[];
  onChange: (updates: Partial<T>) => void;
  onVisibilityChange?: (field: keyof T, visible: boolean) => void;
  onDisabledChange?: (field: keyof T, disabled: boolean) => void;
  onRequiredChange?: (field: keyof T, required: boolean) => void;
  onValidationChange?: (errors: { [K in keyof T]?: string }) => void;
}

export function useFieldDependencies<T extends Record<string, any>>({
  values,
  rules,
  onChange,
  onVisibilityChange,
  onDisabledChange,
  onRequiredChange,
  onValidationChange
}: FieldDependenciesOptions<T>) {
  useEffect(() => {
    let updates: Partial<T> = {};
    let visibilityUpdates = new Map<keyof T, boolean>();
    let disabledUpdates = new Map<keyof T, boolean>();
    let requiredUpdates = new Map<keyof T, boolean>();
    let validationErrors: { [K in keyof T]?: string } = {};

    // Process all rules
    rules.forEach(rule => {
      if (rule.when(values)) {
        // Handle value updates
        if (rule.then) {
          updates = { ...updates, ...rule.then(values) };
        }

        // Handle field visibility
        if (rule.hide) {
          rule.hide.forEach(field => {
            visibilityUpdates.set(field, false);
          });
        }

        // Handle field disabled state
        if (rule.disable) {
          rule.disable.forEach(field => {
            disabledUpdates.set(field, true);
          });
        }

        // Handle required fields
        if (rule.require) {
          rule.require.forEach(field => {
            requiredUpdates.set(field, true);
          });
        }

        // Handle validation
        if (rule.validate) {
          validationErrors = {
            ...validationErrors,
            ...rule.validate(values)
          };
        }
      }
    });

    // Apply all updates
    if (Object.keys(updates).length > 0) {
      onChange(updates);
    }

    // Notify visibility changes
    if (onVisibilityChange) {
      visibilityUpdates.forEach((visible, field) => {
        onVisibilityChange(field, visible);
      });
    }

    // Notify disabled changes
    if (onDisabledChange) {
      disabledUpdates.forEach((disabled, field) => {
        onDisabledChange(field, disabled);
      });
    }

    // Notify required changes
    if (onRequiredChange) {
      requiredUpdates.forEach((required, field) => {
        onRequiredChange(field, required);
      });
    }

    // Notify validation changes
    if (onValidationChange && Object.keys(validationErrors).length > 0) {
      onValidationChange(validationErrors);
    }
  }, [values, rules, onChange, onVisibilityChange, onDisabledChange, onRequiredChange, onValidationChange]);
}

// Example usage:
/*
const rules: DependencyRule<FormData>[] = [
  {
    when: values => values.role === 'admin',
    require: ['bio'],
    validate: values => ({
      bio: values.bio.length < 100 ? 'Admin bio must be at least 100 characters' : undefined
    })
  },
  {
    when: values => !values.notifications,
    hide: ['email'],
    disable: ['email']
  }
];
*/