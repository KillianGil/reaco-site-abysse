import { Timestamp } from "firebase/firestore";

export interface Category {
    id: string;
    key: string;
    label: string;
    color: string;
    order: number;
    isDefault: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface CategoryFormData {
    key: string;
    label: string;
    color: string;
    order: number;
}

export interface ColorOption {
    key: string;
    name: string;
    classes: string;
}

export const AVAILABLE_COLORS: ColorOption[] = [
    {
        key: "cyan",
        name: "Cyan",
        classes: "bg-[#4CBBD5]/20 text-[#4CBBD5] border-[#4CBBD5]/30"
    },
    {
        key: "emerald",
        name: "Émeraude",
        classes: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    },
    {
        key: "amber",
        name: "Ambre",
        classes: "bg-amber-500/20 text-amber-400 border-amber-500/30"
    },
    {
        key: "purple",
        name: "Violet",
        classes: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    },
    {
        key: "rose",
        name: "Rose",
        classes: "bg-rose-500/20 text-rose-400 border-rose-500/30"
    },
    {
        key: "blue",
        name: "Bleu",
        classes: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }
];

export function getColorClasses(colorKey: string): string {
    const color = AVAILABLE_COLORS.find(c => c.key === colorKey);
    return color?.classes || AVAILABLE_COLORS[0].classes;
}

export function validateCategoryKey(key: string): boolean {
    return /^[a-z0-9-]+$/.test(key);
}

export function generateKeyFromLabel(label: string): string {
    return label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
