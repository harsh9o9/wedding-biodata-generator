/**
 * ReligiousInvocationSelector - Component to select religious invocation
 * Allows users to choose from preset religious texts or add custom text
 */

"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { INVOCATION_LABELS, InvocationPreset } from "@/constants/invocations";
import { useBiodata } from "@/context";

export function ReligiousInvocationSelector() {
  const { biodata, dispatch } = useBiodata();
  const [showCustomInput, setShowCustomInput] = useState(
    biodata.meta.religiousInvocation?.preset === "custom"
  );

  const currentPreset = biodata.meta.religiousInvocation?.preset || "none";
  const currentCustomText = biodata.meta.religiousInvocation?.customText || "";

  const handlePresetChange = (value: string) => {
    const preset = value as InvocationPreset;
    setShowCustomInput(preset === "custom");
    
    dispatch({
      type: "UPDATE_META",
      meta: {
        religiousInvocation: {
          preset,
          customText: preset === "custom" ? currentCustomText : undefined,
        },
      },
    });
  };

  const handleCustomTextChange = (value: string) => {
    dispatch({
      type: "UPDATE_META",
      meta: {
        religiousInvocation: {
          preset: "custom",
          customText: value,
        },
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Select value={currentPreset} onValueChange={handlePresetChange}>
          <SelectTrigger label="Religious Invocation">
            <SelectValue placeholder="Select a religious invocation" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(INVOCATION_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Choose a religious invocation to appear at the top of your biodata, or select &ldquo;None&rdquo; to
          leave it blank.
        </p>
      </div>

      {showCustomInput && (
        <div className="space-y-2">
          <Input
            id="custom-invocation"
            label="Custom Invocation Text"
            value={currentCustomText}
            onChange={(e) => handleCustomTextChange(e.target.value)}
            placeholder="Enter your custom invocation text"
            maxLength={100}
            hint="Enter your own custom religious invocation or blessing (max 100 characters)."
          />
        </div>
      )}
    </div>
  );
}

