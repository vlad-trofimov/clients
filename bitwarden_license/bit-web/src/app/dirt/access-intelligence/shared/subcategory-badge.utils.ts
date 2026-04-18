import { BadgeVariant } from "@bitwarden/components";

export interface SubcategoryBadge {
  label: string;
  variant: BadgeVariant;
}

/**
 * Priority order for subcategory badges: exposed > weak > reused.
 * Determines which badge is shown as primary when a member has multiple risk categories.
 */
export const SUBCATEGORY_BADGE_PRIORITY: Array<{
  key: "exposedPasswordCount" | "weakPasswordCount" | "reusedPasswordCount";
  label: string;
  variant: BadgeVariant;
}> = [
  { key: "exposedPasswordCount", label: "exposed", variant: "danger" },
  { key: "weakPasswordCount", label: "weak", variant: "warning" },
  { key: "reusedPasswordCount", label: "reused", variant: "primary" },
];

type SubcategoryFields = {
  weakPasswordCount?: number;
  reusedPasswordCount?: number;
  exposedPasswordCount?: number;
};

/**
 * Returns the primary (highest-priority) subcategory badge and overflow
 * count + tooltip for any remaining categories.
 */
export function getMemberSubcategoryBadges(
  member: SubcategoryFields,
  translate: (key: string) => string,
): { primary: SubcategoryBadge | null; extraCount: number; extraTooltip: string } {
  const badges: SubcategoryBadge[] = SUBCATEGORY_BADGE_PRIORITY.filter(
    (entry) => (member[entry.key] ?? 0) > 0,
  ).map((entry) => ({ label: translate(entry.label), variant: entry.variant }));

  return {
    primary: badges[0] ?? null,
    extraCount: Math.max(0, badges.length - 1),
    extraTooltip: badges
      .slice(1)
      .map((b) => b.label)
      .join(", "),
  };
}
