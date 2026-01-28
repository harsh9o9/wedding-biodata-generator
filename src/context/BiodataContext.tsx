"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import {
  Biodata,
  BiodataAction,
  BiodataBackground,
  BiodataContextType,
  BiodataExport,
  BiodataField,
  BiodataPhoto,
  BiodataSection,
  TemplateId,
} from "@/types/biodata";
import { DEFAULT_SECTIONS } from "@/constants/fields";
import { DEFAULT_TEMPLATE_ID } from "@/constants/templates";
import { STORAGE_KEYS, DELAYS } from "@/constants/theme";
import { generateId, isClient, deepClone } from "@/lib/utils";
import { validateBiodataExport, isCompatibleVersion, CURRENT_EXPORT_VERSION } from "@/lib/validators";

/**
 * Initial biodata state with default values
 */
function createInitialBiodata(): Biodata {
  return {
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: CURRENT_EXPORT_VERSION,
    meta: {
      name: "",
      language: "english",
      religiousInvocation: {
        preset: "none",
      },
    },
    sections: deepClone(DEFAULT_SECTIONS),
    photo: undefined,
    templateId: DEFAULT_TEMPLATE_ID,
    background: {
      type: "color",
      value: "#FFF9F0", // Cream color
      opacity: 100,
    },
    customStyles: undefined,
  };
}

/**
 * Reducer for biodata state management
 */
function biodataReducer(state: Biodata, action: BiodataAction): Biodata {
  const now = new Date().toISOString();

  switch (action.type) {
    case "UPDATE_FIELD": {
      const { sectionId, fieldId, value } = action;
      return {
        ...state,
        updatedAt: now,
        sections: state.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                fields: section.fields.map((field) =>
                  field.id === fieldId ? { ...field, value } : field
                ),
              }
            : section
        ),
      };
    }

    case "ADD_FIELD": {
      const { sectionId, field } = action;
      const section = state.sections.find((s) => s.id === sectionId);
      const maxOrder = section
        ? Math.max(...section.fields.map((f) => f.order), -1)
        : -1;

      const newField: BiodataField = {
        ...field,
        id: generateId(),
        order: maxOrder + 1,
      };

      return {
        ...state,
        updatedAt: now,
        sections: state.sections.map((s) =>
          s.id === sectionId
            ? { ...s, fields: [...s.fields, newField] }
            : s
        ),
      };
    }

    case "REMOVE_FIELD": {
      const { sectionId, fieldId } = action;
      return {
        ...state,
        updatedAt: now,
        sections: state.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                fields: section.fields.filter((f) => f.id !== fieldId),
              }
            : section
        ),
      };
    }

    case "UPDATE_FIELD_CONFIG": {
      const { sectionId, fieldId, config } = action;
      return {
        ...state,
        updatedAt: now,
        sections: state.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                fields: section.fields.map((field) =>
                  field.id === fieldId ? { ...field, ...config } : field
                ),
              }
            : section
        ),
      };
    }

    case "ADD_SECTION": {
      const { section } = action;
      const maxOrder = Math.max(...state.sections.map((s) => s.order), -1);

      const newSection: BiodataSection = {
        ...section,
        id: generateId(),
        order: maxOrder + 1,
      };

      return {
        ...state,
        updatedAt: now,
        sections: [...state.sections, newSection],
      };
    }

    case "REMOVE_SECTION": {
      const { sectionId } = action;
      return {
        ...state,
        updatedAt: now,
        sections: state.sections.filter((s) => s.id !== sectionId),
      };
    }

    case "UPDATE_SECTION": {
      const { sectionId, updates } = action;
      return {
        ...state,
        updatedAt: now,
        sections: state.sections.map((section) =>
          section.id === sectionId ? { ...section, ...updates } : section
        ),
      };
    }

    case "REORDER_SECTIONS": {
      const { sectionIds } = action;
      const sectionMap = new Map(state.sections.map((s) => [s.id, s]));
      const reorderedSections = sectionIds
        .map((id, index) => {
          const section = sectionMap.get(id);
          return section ? { ...section, order: index } : null;
        })
        .filter((s): s is BiodataSection => s !== null);

      return {
        ...state,
        updatedAt: now,
        sections: reorderedSections,
      };
    }

    case "REORDER_FIELDS": {
      const { sectionId, fieldIds } = action;
      return {
        ...state,
        updatedAt: now,
        sections: state.sections.map((section) => {
          if (section.id !== sectionId) return section;

          const fieldMap = new Map(section.fields.map((f) => [f.id, f]));
          const reorderedFields = fieldIds
            .map((id, index) => {
              const field = fieldMap.get(id);
              return field ? { ...field, order: index } : null;
            })
            .filter((f): f is BiodataField => f !== null);

          return { ...section, fields: reorderedFields };
        }),
      };
    }

    case "SET_TEMPLATE": {
      const { templateId } = action;
      return {
        ...state,
        updatedAt: now,
        templateId,
      };
    }

    case "SET_BACKGROUND": {
      const { background } = action;
      return {
        ...state,
        updatedAt: now,
        background,
      };
    }

    case "SET_PHOTO": {
      const { photo } = action;
      return {
        ...state,
        updatedAt: now,
        photo,
      };
    }

    case "SET_CUSTOM_STYLES": {
      const { styles } = action;
      return {
        ...state,
        updatedAt: now,
        customStyles: styles,
      };
    }

    case "UPDATE_META": {
      const { meta } = action;
      return {
        ...state,
        updatedAt: now,
        meta: { ...state.meta, ...meta },
      };
    }

    case "IMPORT_DATA": {
      const { data } = action;
      return {
        ...data,
        updatedAt: now,
      };
    }

    case "RESET": {
      return createInitialBiodata();
    }

    default:
      return state;
  }
}

/**
 * Context for biodata state
 */
const BiodataContext = createContext<BiodataContextType | null>(null);

/**
 * Provider props
 */
interface BiodataProviderProps {
  children: React.ReactNode;
}

/**
 * BiodataProvider component
 * Wraps the application with biodata context and handles auto-save
 */
export function BiodataProvider({ children }: BiodataProviderProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [biodata, dispatch] = useReducer(biodataReducer, null, () => {
    // Initialize from localStorage if available (SSR-safe)
    if (isClient()) {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.biodata);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Basic validation - check if it has required fields
          if (parsed && parsed.id && parsed.sections && Array.isArray(parsed.sections)) {
            return parsed as Biodata;
          }
        }
      } catch (error) {
        console.warn("Failed to load biodata from localStorage:", error);
      }
    }
    return createInitialBiodata();
  });

  // Track dirty state and saving status
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Auto-save to localStorage with debounce
  useEffect(() => {
    if (!isClient()) return;

    setIsDirty(true);

    const timeoutId = setTimeout(() => {
      try {
        setIsSaving(true);
        localStorage.setItem(STORAGE_KEYS.biodata, JSON.stringify(biodata));
        setLastSaved(new Date().toISOString());
        setIsDirty(false);
      } catch (error) {
        console.error("Failed to save biodata to localStorage:", error);
      } finally {
        setIsSaving(false);
      }
    }, DELAYS.autosave);

    return () => clearTimeout(timeoutId);
  }, [biodata]);

  // Helper functions
  const updateField = useCallback(
    (sectionId: string, fieldId: string, value: string) => {
      dispatch({ type: "UPDATE_FIELD", sectionId, fieldId, value });
    },
    []
  );

  const addField = useCallback(
    (sectionId: string, field: Omit<BiodataField, "id" | "order">) => {
      dispatch({ type: "ADD_FIELD", sectionId, field });
    },
    []
  );

  const removeField = useCallback((sectionId: string, fieldId: string) => {
    dispatch({ type: "REMOVE_FIELD", sectionId, fieldId });
  }, []);

  const addSection = useCallback(
    (section: Omit<BiodataSection, "id" | "order">) => {
      dispatch({ type: "ADD_SECTION", section });
    },
    []
  );

  const removeSection = useCallback((sectionId: string) => {
    dispatch({ type: "REMOVE_SECTION", sectionId });
  }, []);

  const reorderSections = useCallback((sectionIds: string[]) => {
    dispatch({ type: "REORDER_SECTIONS", sectionIds });
  }, []);

  const setTemplate = useCallback((templateId: TemplateId) => {
    dispatch({ type: "SET_TEMPLATE", templateId });
  }, []);

  const setBackground = useCallback((background: BiodataBackground) => {
    dispatch({ type: "SET_BACKGROUND", background });
  }, []);

  const setPhoto = useCallback((photo: BiodataPhoto | undefined) => {
    dispatch({ type: "SET_PHOTO", photo });
  }, []);

  const exportData = useCallback((): BiodataExport => {
    return {
      version: CURRENT_EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      data: deepClone(biodata),
    };
  }, [biodata]);

  const importData = useCallback((data: BiodataExport): boolean => {
    // Validate the import data structure
    if (!validateBiodataExport(data)) {
      console.error("Invalid biodata export format");
      return false;
    }

    // Check version compatibility
    if (!isCompatibleVersion(data.version)) {
      console.error(
        `Incompatible version: ${data.version}. Current version: ${CURRENT_EXPORT_VERSION}`
      );
      return false;
    }

    dispatch({ type: "IMPORT_DATA", data: data.data });
    return true;
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<BiodataContextType>(
    () => ({
      biodata,
      dispatch,
      previewRef,
      updateField,
      addField,
      removeField,
      addSection,
      removeSection,
      reorderSections,
      setTemplate,
      setBackground,
      setPhoto,
      exportData,
      importData,
      reset,
      isDirty,
      isSaving,
      lastSaved,
    }),
    [
      biodata,
      updateField,
      addField,
      removeField,
      addSection,
      removeSection,
      reorderSections,
      setTemplate,
      setBackground,
      setPhoto,
      exportData,
      importData,
      reset,
      isDirty,
      isSaving,
      lastSaved,
    ]
  );

  return (
    <BiodataContext.Provider value={contextValue}>
      {children}
    </BiodataContext.Provider>
  );
}

/**
 * Hook to access biodata context
 * Throws error if used outside of BiodataProvider
 */
export function useBiodata(): BiodataContextType {
  const context = useContext(BiodataContext);

  if (!context) {
    throw new Error("useBiodata must be used within a BiodataProvider");
  }

  return context;
}

/**
 * Hook to access a specific section
 */
export function useBiodataSection(sectionId: string) {
  const { biodata, dispatch } = useBiodata();

  const section = useMemo(
    () => biodata.sections.find((s) => s.id === sectionId),
    [biodata.sections, sectionId]
  );

  const updateSection = useCallback(
    (updates: Partial<BiodataSection>) => {
      dispatch({ type: "UPDATE_SECTION", sectionId, updates });
    },
    [dispatch, sectionId]
  );

  const updateFieldInSection = useCallback(
    (fieldId: string, value: string) => {
      dispatch({ type: "UPDATE_FIELD", sectionId, fieldId, value });
    },
    [dispatch, sectionId]
  );

  const addFieldToSection = useCallback(
    (field: Omit<BiodataField, "id" | "order">) => {
      dispatch({ type: "ADD_FIELD", sectionId, field });
    },
    [dispatch, sectionId]
  );

  const removeFieldFromSection = useCallback(
    (fieldId: string) => {
      dispatch({ type: "REMOVE_FIELD", sectionId, fieldId });
    },
    [dispatch, sectionId]
  );

  const reorderFieldsInSection = useCallback(
    (fieldIds: string[]) => {
      dispatch({ type: "REORDER_FIELDS", sectionId, fieldIds });
    },
    [dispatch, sectionId]
  );

  return {
    section,
    updateSection,
    updateFieldInSection,
    addFieldToSection,
    removeFieldFromSection,
    reorderFieldsInSection,
  };
}

/**
 * Hook to access a specific field
 */
export function useBiodataField(sectionId: string, fieldId: string) {
  const { biodata, dispatch } = useBiodata();

  const field = useMemo(() => {
    const section = biodata.sections.find((s) => s.id === sectionId);
    return section?.fields.find((f) => f.id === fieldId);
  }, [biodata.sections, sectionId, fieldId]);

  const updateValue = useCallback(
    (value: string) => {
      dispatch({ type: "UPDATE_FIELD", sectionId, fieldId, value });
    },
    [dispatch, sectionId, fieldId]
  );

  const updateConfig = useCallback(
    (config: Partial<BiodataField>) => {
      dispatch({ type: "UPDATE_FIELD_CONFIG", sectionId, fieldId, config });
    },
    [dispatch, sectionId, fieldId]
  );

  return {
    field,
    updateValue,
    updateConfig,
  };
}

export default BiodataContext;
