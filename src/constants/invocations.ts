/**
 * Religious invocations for different faiths
 * Used at the top of biodata templates
 */

export const RELIGIOUS_INVOCATIONS = {
  hindu: "॥ श्री गणेशाय नमः ॥",
  muslim: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم",
  christian: "✝ In the name of the Father, Son, and Holy Spirit ✝",
  sikh: "ੴ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫਤਹਿ",
  buddhist: "☸ May all beings be happy ☸",
  jain: "णमो अरिहंताणं",
  none: "",
} as const;

export const INVOCATION_LABELS = {
  hindu: "Hindu (Shri Ganeshaya Namah)",
  muslim: "Muslim (Bismillah)",
  christian: "Christian",
  sikh: "Sikh (Waheguru Ji Ki Fateh)",
  buddhist: "Buddhist",
  jain: "Jain",
  none: "None",
  custom: "Custom Text",
} as const;

export type InvocationPreset = keyof typeof RELIGIOUS_INVOCATIONS | "custom";

/**
 * Get the invocation text based on preset and custom text
 */
export function getInvocationText(
  preset?: InvocationPreset,
  customText?: string
): string {
  if (!preset || preset === "none") {
    return "";
  }
  
  if (preset === "custom") {
    return customText || "";
  }
  
  return RELIGIOUS_INVOCATIONS[preset as keyof typeof RELIGIOUS_INVOCATIONS] || "";
}
