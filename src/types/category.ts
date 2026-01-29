/**
 * Types et utilitaires pour les catégories d'articles
 *
 * RÔLE DES CATÉGORIES :
 * Les catégories permettent de classer les articles du musée en groupes thématiques.
 * Exemples : "Événement", "Découverte", "Vie du musée"
 *
 * ARCHITECTURE :
 * - Les catégories sont stockées dans Firestore (collection "categories")
 * - Chaque article référence une catégorie via sa clé unique
 * - Les catégories par défaut ne peuvent pas être supprimées (isDefault: true)
 * - Les catégories personnalisées peuvent être créées, modifiées et supprimées
 *
 * SYSTÈME DE COULEURS :
 * Chaque catégorie a une couleur Tailwind associée qui s'affiche dans les badges.
 * Les classes incluent le background, la couleur du texte et la bordure.
 */
import { Timestamp } from "firebase/firestore";

/**
 * Interface représentant une catégorie complète (depuis Firestore)
 *
 * UTILISATION :
 * - Utilisée par le hook useCategories() pour récupérer les catégories
 * - Utilisée dans l'interface admin pour afficher et gérer les catégories
 * - Utilisée côté public pour filtrer les articles par catégorie
 */
export interface Category {
    id: string;            // ID du document Firestore (auto-généré)
    key: string;           // Clé unique (ex: "evenement", "decouverte")
    label: string;         // Nom affiché à l'utilisateur (ex: "Événement")
    color: string;         // Clé de couleur Tailwind (ex: "cyan", "emerald")
    order: number;         // Ordre d'affichage (1, 2, 3... les plus petits en premier)
    isDefault: boolean;    // Protection : true = ne peut pas être supprimée
    createdAt: Timestamp;  // Date de création
    updatedAt: Timestamp;  // Date de dernière modification
}

/**
 * Interface pour les données du formulaire de création/édition de catégorie
 *
 * UTILISATION :
 * - Utilisée dans CategoryForm.tsx pour le formulaire
 * - Ne contient que les champs modifiables par l'utilisateur
 * - Les timestamps sont ajoutés automatiquement par l'API
 */
export interface CategoryFormData {
    key: string;      // Clé unique (générée depuis le label, éditable)
    label: string;    // Nom de la catégorie
    color: string;    // Couleur sélectionnée
    order: number;    // Ordre d'affichage
}

/**
 * Interface représentant une option de couleur disponible
 *
 * UTILISATION :
 * - Utilisée dans le sélecteur de couleurs (CategoryForm.tsx)
 * - Chaque couleur a un nom français et des classes Tailwind complètes
 */
export interface ColorOption {
    key: string;      // Identifiant de la couleur (ex: "cyan")
    name: string;     // Nom affiché (ex: "Cyan")
    classes: string;  // Classes Tailwind CSS complètes (bg, text, border)
}

/**
 * Liste des couleurs disponibles pour les catégories
 *
 * PALETTE DE COULEURS :
 * Les couleurs sont choisies pour être distinctes et accessibles sur fond sombre (#041C30).
 * Chaque couleur utilise une opacité de 20% pour le background et 30% pour la bordure.
 *
 * FORMAT DES CLASSES :
 * - bg-[color]/20 : Background avec 20% d'opacité
 * - text-[color] : Texte en couleur pleine
 * - border-[color]/30 : Bordure avec 30% d'opacité
 *
 * AJOUT DE NOUVELLES COULEURS :
 * Pour ajouter une couleur, ajoutez simplement un nouvel objet ColorOption ici.
 * Elle apparaîtra automatiquement dans le sélecteur de couleurs.
 */
export const AVAILABLE_COLORS: ColorOption[] = [
    {
        key: "cyan",
        name: "Cyan",
        classes: "bg-[#4CBBD5]/20 text-[#4CBBD5] border-[#4CBBD5]/30"  // Couleur principale ABYSSE
    },
    {
        key: "emerald",
        name: "Émeraude",
        classes: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"  // Vert océan
    },
    {
        key: "amber",
        name: "Ambre",
        classes: "bg-amber-500/20 text-amber-400 border-amber-500/30"  // Orange/jaune chaud
    },
    {
        key: "purple",
        name: "Violet",
        classes: "bg-purple-500/20 text-purple-400 border-purple-500/30"  // Violet profond
    },
    {
        key: "rose",
        name: "Rose",
        classes: "bg-rose-500/20 text-rose-400 border-rose-500/30"  // Rose vif
    },
    {
        key: "blue",
        name: "Bleu",
        classes: "bg-blue-500/20 text-blue-400 border-blue-500/30"  // Bleu classique
    }
];

/**
 * Récupère les classes Tailwind CSS d'une couleur par sa clé
 *
 * UTILISATION :
 * Utilisée dans les composants pour afficher les badges de catégories avec la bonne couleur.
 *
 * @param colorKey - Clé de la couleur (ex: "cyan", "emerald")
 * @returns Classes Tailwind CSS complètes ou classes de la première couleur si introuvable
 *
 * @example
 * const classes = getColorClasses("cyan");
 * // Retourne: "bg-[#4CBBD5]/20 text-[#4CBBD5] border-[#4CBBD5]/30"
 */
export function getColorClasses(colorKey: string): string {
    const color = AVAILABLE_COLORS.find(c => c.key === colorKey);
    // Fallback vers la première couleur (cyan) si la clé n'existe pas
    return color?.classes || AVAILABLE_COLORS[0].classes;
}

/**
 * Valide le format d'une clé de catégorie
 *
 * FORMAT REQUIS :
 * - Uniquement lowercase (a-z)
 * - Chiffres autorisés (0-9)
 * - Tirets autorisés (-)
 * - Pas d'espaces, de caractères spéciaux ou d'accents
 *
 * RAISONS :
 * - URL-safe : peut être utilisé dans les routes Next.js
 * - Firestore-friendly : pas de caractères problématiques
 * - Évite les conflits avec les clés existantes
 *
 * @param key - Clé à valider
 * @returns true si la clé est valide, false sinon
 *
 * @example
 * validateCategoryKey("evenement")      // true
 * validateCategoryKey("vie-du-musee")   // true
 * validateCategoryKey("Événement")      // false (majuscules)
 * validateCategoryKey("vie du musée")   // false (espaces et accents)
 */
export function validateCategoryKey(key: string): boolean {
    return /^[a-z0-9-]+$/.test(key);
}

/**
 * Génère une clé unique depuis un label
 *
 * TRANSFORMATIONS APPLIQUÉES :
 * 1. Conversion en minuscules
 * 2. Normalisation NFD (décompose les accents : é → e + ´)
 * 3. Suppression des accents (caractères diacritiques)
 * 4. Remplacement des caractères non alphanumériques par des tirets
 * 5. Suppression des tirets en début/fin de chaîne
 *
 * EXEMPLES DE TRANSFORMATION :
 * - "Événement" → "evenement"
 * - "Vie du musée" → "vie-du-musee"
 * - "Découverte scientifique" → "decouverte-scientifique"
 * - "Art & Culture" → "art-culture"
 *
 * UTILISATION :
 * Appelée automatiquement dans CategoryForm.tsx lorsque l'utilisateur saisit un nom.
 * La clé générée peut être modifiée manuellement si nécessaire.
 *
 * @param label - Nom de la catégorie saisi par l'utilisateur
 * @returns Clé normalisée et URL-safe
 *
 * @example
 * generateKeyFromLabel("Événement")
 * // Retourne: "evenement"
 *
 * generateKeyFromLabel("Vie du musée")
 * // Retourne: "vie-du-musee"
 */
export function generateKeyFromLabel(label: string): string {
    return label
        .toLowerCase()                          // "Événement" → "événement"
        .normalize("NFD")                       // "événement" → "e´ve`nement" (décomposition)
        .replace(/[\u0300-\u036f]/g, "")       // "e´ve`nement" → "evenement" (suppression accents)
        .replace(/[^a-z0-9]+/g, "-")           // "vie du musée" → "vie-du-musee" (espaces → tirets)
        .replace(/^-+|-+$/g, "");              // "-evenement-" → "evenement" (trim tirets)
}
