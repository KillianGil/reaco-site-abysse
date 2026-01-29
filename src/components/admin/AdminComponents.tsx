/**
 * Fichier de réexport centralisé des composants admin
 *
 * Ce fichier maintient la compatibilité avec les imports existants
 * tout en permettant une organisation modulaire du code.
 *
 * Les composants sont désormais dans des fichiers séparés :
 * - AdminProvider.tsx : Contexte et Provider d'authentification
 * - AdminLogin.tsx : Page de connexion
 * - AdminLayout.tsx : Layout avec sidebar
 * - SuccessModal.tsx : Modal de confirmation
 * - StatCard.tsx : Carte de statistique
 */

export { AdminProvider, useAdmin } from "./AdminProvider";
export { AdminLogin } from "./AdminLogin";
export { AdminLayout } from "./AdminLayout";
export { SuccessModal } from "./SuccessModal";
export { StatCard } from "./StatCard";
