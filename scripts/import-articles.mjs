// Script pour importer les articles dans Firestore
// Exécuter avec: node scripts/import-articles.mjs

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp, getDocs, deleteDoc, doc } from "firebase/firestore";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAJEyxmgO5PIfbpYnSC2mHfdyoK8kHGjNo",
  authDomain: "abysse-63713.firebaseapp.com",
  projectId: "abysse-63713",
  storageBucket: "abysse-63713.firebasestorage.app",
  messagingSenderId: "290499762604",
  appId: "1:290499762604:web:5b9426750e7eca5058c209",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const articlesAImporter = [
    {
        categorie: "evenement",
        label_categorie: "Événement",
        date_texte: "15 Jan 2026",
        titre: "Nuit Européenne des Musées 2026",
        resume: "Une soirée magique vous attend ! Plongez dans les abysses en nocturne avec nos guides passionnés. Au programme : visites guidées exclusives, projections immersives et rencontres avec des océanographes.",
        contenu: `La Nuit européenne des musées revient à Toulon le 23 mai 2026, et ABYSSE ouvrira exceptionnellement ses portes jusqu'à minuit pour une plongée nocturne au cœur des grands fonds. Dès la tombée de la nuit, le musée se transforme en cathédrale d'acier baignée de lumières abyssales, invitant les visiteurs à redécouvrir le Casabianca, le FNRS III et les robots d'exploration dans une ambiance intimiste et spectaculaire.

Visites guidées exclusives
Des médiateurs passionnés vous accompagnent dans les entrailles du sous-marin et racontent l'histoire de Toulon, berceau de la plongée moderne avec les Mousquemers et de l'exploration des grands fonds. Archives, anecdotes et démonstrations autour des instruments d'exploration profonde rythmeront cette traversée hors du temps.

Projections immersives et simulateurs
Dans la Grande Halle, plongez virtuellement jusqu'à 6 000 mètres de profondeur grâce à des projections immersives et testez les simulateurs de pilotage de ROV utilisés par les scientifiques pour cartographier les fonds marins. Découvrez les sources hydrothermales et leurs écosystèmes uniques comme si vous y étiez.

Rencontres avec des océanographes
Échangez avec des chercheurs, ingénieurs et plongeurs professionnels lors de mini-conférences et temps de discussion autour des enjeux actuels : protection des grands fonds, exploration responsable et avenir de la recherche océanographique en Méditerranée.

Parcours famille
Un parcours ludique spécialement conçu pour les enfants permettra de découvrir la bioluminescence, les créatures abyssales et la vie à bord d'un sous-marin à travers des jeux de lumière et des expériences interactives.

Entrée gratuite de 19h à minuit. Réservation conseillée.`,
        image_url: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&q=80",
        mis_en_avant: true,
        date_evenement: "23 Mai 2026",
        heure_evenement: "19h - Minuit"
    },
    {
        categorie: "decouverte",
        label_categorie: "Découverte",
        date_texte: "10 Jan 2026",
        titre: "ABYSSE & Ifremer : une année dédiée aux grands fonds",
        resume: "En 2026, le musée ABYSSE s'associe aux équipes de l'Ifremer pour mettre à l'honneur l'exploration des grands fonds : nouvelles images des abysses, rencontres avec des scientifiques et focus sur les enjeux de protection de ces milieux fragiles.",
        contenu: `En 2026, le musée ABYSSE et l'Ifremer unissent leurs forces pour une programmation exceptionnelle dédiée aux grands fonds océaniques. Alors que seulement 20% des fonds marins sont cartographiés à ce jour, cette collaboration vise à sensibiliser le public aux dernières avancées de la recherche et aux enjeux de préservation de ces écosystèmes encore largement méconnus.

Nouvelles images des abysses

Le musée accueille une sélection inédite d'images et de vidéos captées lors des dernières missions océanographiques de l'Ifremer en Méditerranée et Atlantique. Champs de sources hydrothermales, espèces bioluminescentes, reliefs sous-marins spectaculaires : ces documents exclusifs offrent un voyage visuel saisissant dans un monde où la lumière du soleil ne pénètre jamais.

Rencontres avec des scientifiques

Tout au long de l'année, des chercheurs, ingénieurs et pilotes d'engins sous-marins interviendront lors de conférences et d'ateliers pour partager leur quotidien à bord des navires océanographiques. Comment prépare-t-on une mission à 6 000 mètres de profondeur ? Quelles découvertes récentes bouleversent notre compréhension de la vie marine ? Les visiteurs pourront poser leurs questions et découvrir les coulisses de l'exploration scientifique.

Enjeux de protection des grands fonds

Cette année thématique met également l'accent sur la fragilité des écosystèmes profonds face aux activités humaines : exploitation minière, pollution, réchauffement climatique. Des espaces pédagogiques permettront de comprendre pourquoi il est urgent d'explorer et de protéger ces milieux avant qu'ils ne soient irrémédiablement endommagés.

Exposition temporaire et dispositifs immersifs

Une exposition temporaire présentera les technologies de pointe développées par l'Ifremer pour l'exploration des grands fonds, dont les robots autonomes UlyX et Victor 6000, capables de descendre jusqu'à 6 000 mètres. Des simulateurs permettront au public de piloter virtuellement ces engins et de vivre l'expérience d'une plongée scientifique.

Programmation complète disponible dès février sur notre site et à l'accueil du musée.`,
        image_url: "/assets/fond-marin.jpg",
        mis_en_avant: true
    },
    {
        categorie: "musee",
        label_categorie: "Vie du Musée",
        date_texte: "5 Jan 2026",
        titre: "Le FNRS III renaît de ses cendres",
        resume: "Après deux ans de restauration minutieuse, le légendaire bathyscaphe retrouve peu à peu sa splendeur d'origine. Nos équipes vous dévoilent les coulisses de ce travail d'orfèvre.",
        contenu: `Depuis deux ans, les ateliers du musée ABYSSE vivent au rythme d'un chantier hors norme : la renaissance du bathyscaphe FNRS III, pionnier de l'exploration des grands fonds qui établit en 1954 un record historique à 4 050 mètres de profondeur. Confié à nos équipes après des décennies d'exposition aux éléments, ce géant d'acier retrouve progressivement la silhouette et la présence qui ont marqué l'histoire des abysses.

Un diagnostic minutieux
Dès son arrivée, un vaste travail de diagnostic a été mené sur la coque, les flotteurs et les ballasts. Les équipes de restauration ont dû composer avec la corrosion, les déformations du métal et les traces des multiples campagnes de plongée. Chaque rivet, chaque soudure raconte une part de l'épopée du FNRS III.

Restaurer sans dénaturer
La première phase a consisté à stabiliser le bathyscaphe : décapage contrôlé, traitements anticorrosion et consolidation des parties fragilisées. En parallèle, un patient travail de recherche a permis de retrouver les teintes d'origine, les marquages historiques et les détails techniques disparus au fil du temps. L'objectif n'est pas de le moderniser, mais de le ramener au plus près de son état lors de ses grandes plongées.

L'intérieur retrouve vie
Nos équipes se sont également penchées sur l'intérieur de la sphère habitée et les éléments emblématiques du poste de pilotage. Instruments de mesure, commandes, hublots, câblages : tout ce qui pouvait être restauré ou reconstitué à l'identique l'a été, en s'appuyant sur des archives d'époque et des témoignages de spécialistes.

Coulisses ouvertes au public
Ce chantier est aussi l'occasion d'un travail de médiation unique. Tout au long de l'année, des visites de coulisses, des rencontres avec les restaurateurs et des ateliers pédagogiques permettent au public de suivre l'avancée du projet. Le FNRS III n'est plus seulement un objet exposé, c'est un véritable laboratoire d'histoire et de transmission.

À terme, le bathyscaphe restauré deviendra l'une des pièces maîtresses du parcours du musée ABYSSE, rappelant que les records d'hier ont ouvert la voie aux découvertes d'aujourd'hui.`,
        image_url: "/assets/fnrs_3_220307_043.jpg"
    },
    {
        categorie: "evenement",
        label_categorie: "Événement",
        date_texte: "28 Déc 2025",
        titre: "Vacances de février : ateliers pour les petits explorateurs",
        resume: "Vos enfants rêvent de devenir océanographes ? Pendant les vacances d'hiver, le musée propose des ateliers créatifs pour les 6-12 ans : construction de mini sous-marins, découverte des créatures bioluminescentes...",
        contenu: `Les vacances de février 2026 se transforment en véritable odyssée sous-marine pour les jeunes visiteurs du musée ABYSSE. Du 10 au 21 février, nous proposons une série d'ateliers créatifs et ludiques spécialement conçus pour les 6-12 ans qui rêvent de découvrir les mystères des océans et de marcher dans les pas des grands explorateurs.

Construction de mini sous-marins
Les enfants mettent la main à la pâte pour concevoir et assembler leurs propres submersibles miniatures. À partir de matériaux simples et recyclés, ils apprennent les principes de flottabilité, d'étanchéité et de propulsion qui régissent la navigation sous-marine. Chaque participant repart avec sa création et une meilleure compréhension de la physique des profondeurs.

Découverte des créatures bioluminescentes
Plongée dans l'obscurité totale pour explorer le fascinant monde de la bioluminescence. Grâce à des projections immersives et des expériences interactives, les enfants découvrent comment les poissons, méduses et autres organismes des abysses produisent leur propre lumière pour communiquer, chasser ou se défendre dans un environnement où le soleil ne pénètre jamais.

Exploration du Casabianca
Une visite guidée adaptée aux plus jeunes les emmène dans les entrailles du sous-marin Casabianca. Comment vivaient les marins à bord ? Quels étaient leurs missions ? Comment fonctionnait ce géant d'acier ? Nos médiateurs répondent à toutes les questions et racontent l'histoire de ce navire légendaire de manière accessible et captivante.

Cartographie des fonds marins
À l'aide de maquettes et d'outils pédagogiques inspirés des technologies de l'Ifremer, les enfants s'initient à la cartographie des reliefs sous-marins. Ils apprennent comment les scientifiques explorent, mesurent et représentent les fonds océaniques, de la côte méditerranéenne aux grandes fosses abyssales.

Informations pratiques
Ateliers du 10 au 21 février 2026, tous les après-midis de 14h à 16h30. Réservation obligatoire sur notre site ou à l'accueil du musée. Places limitées à 15 enfants par session pour garantir un accompagnement de qualité.`,
        image_url: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&q=80",
        date_evenement: "10-21 Fév 2026",
        heure_evenement: "14h - 16h30"
    },
    {
        categorie: "decouverte",
        label_categorie: "Découverte",
        date_texte: "20 Déc 2025",
        titre: "Un monde caché sous l'Atlantique",
        resume: "Les chercheurs de l'IFREMER ont cartographié un nouveau champ de sources hydrothermales abritant un écosystème unique. Des images à couper le souffle qui nous rappellent combien l'océan recèle encore de mystères.",
        contenu: `Les profondeurs de l'Atlantique viennent de livrer un nouveau secret. Au terme d'une mission de plusieurs semaines menée par les équipes de l'Ifremer, un champ de sources hydrothermales jusqu'alors inconnu a été cartographié avec une précision inédite. Cette découverte, située sur la dorsale médio-atlantique, ouvre une fenêtre sur un écosystème unique où la vie prospère dans des conditions extrêmes.

Des cheminées au cœur de l'océan
Les sources hydrothermales, aussi appelées fumeurs noirs, sont des structures minérales qui se forment lorsque l'eau de mer s'infiltre dans la croûte océanique, se réchauffe au contact du magma et ressurgit chargée de minéraux. Ces cheminées peuvent atteindre plusieurs mètres de hauteur et libèrent une eau surchauffée à plus de 350 degrés Celsius, créant un contraste saisissant avec les eaux glaciales environnantes.

Un écosystème hors du commun
Autour de ces sources, la vie foisonne. Vers tubicoles géants, crabes aveugles, crevettes translucides et bactéries chimiosynthétiques forment des communautés complexes qui ne dépendent pas de la lumière du soleil, mais de l'énergie chimique libérée par les fluides hydrothermaux. Cette découverte permet aux scientifiques d'étudier des formes de vie adaptées à des environnements parmi les plus hostiles de la planète.

Des images à couper le souffle
Grâce aux robots autonomes et aux véhicules téléopérés de l'Ifremer, notamment le ROV Victor 6000, les chercheurs ont pu capturer des images haute définition de ce monde caché. Ces vidéos révèlent des paysages sous-marins spectaculaires, où se mêlent colonnes minérales, panaches de fluides et formes de vie étranges qui semblent tout droit sorties d'un autre monde.

Comprendre pour mieux protéger
Cette mission s'inscrit dans un effort mondial de cartographie et de compréhension des grands fonds océaniques. Alors que seulement 20% des fonds marins sont connus avec précision, chaque nouvelle découverte rappelle l'urgence d'explorer et de protéger ces milieux fragiles avant qu'ils ne soient menacés par les activités humaines. Les données collectées enrichiront les connaissances scientifiques et alimenteront les débats sur la préservation des écosystèmes profonds.

Le musée ABYSSE présentera prochainement une sélection exclusive d'images de cette mission dans son espace dédié aux grands fonds.`,
        image_url: "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800&q=80"
    },
    {
        categorie: "musee",
        label_categorie: "Vie du Musée",
        date_texte: "15 Déc 2025",
        titre: "Un mois déjà ! 25 000 visiteurs depuis l'ouverture",
        resume: "Grâce à vous, le musée ABYSSE a accueilli plus de 25 000 curieux depuis son ouverture en novembre.",
        contenu: `Un mois après l'inauguration du musée ABYSSE, c'est l'heure du premier bilan. Et il dépasse toutes nos espérances : plus de 25 000 visiteurs ont franchi nos portes depuis le 15 novembre 2025. Familles, passionnés d'océanographie, scolaires, touristes ou simplement curieux, tous ont répondu présent pour cette plongée inédite dans les mystères des profondeurs.

Un accueil au-delà de nos attentes
Dès les premiers jours, les visiteurs ont afflué pour découvrir le Casabianca, explorer les entrailles du FNRS III et s'immerger dans nos espaces thématiques. Les retours sont unanimes : le parcours immersif, les simulateurs de pilotage et les projections sur les grands fonds ont marqué les esprits. Beaucoup repartent avec une nouvelle vision de l'océan et de son rôle essentiel pour notre planète.

Des visiteurs de tous horizons
Parmi ces 25 000 visiteurs, nous avons accueilli des classes de toute la région, des groupes venus de l'étranger, mais aussi des anciens marins émus de redécouvrir l'histoire du Casabianca et des sous-mariniers toulonnais. Certains sont revenus plusieurs fois, preuve que le musée offre une expérience riche qui gagne à être explorée à son rythme.

Une équipe mobilisée
Ce succès, nous le devons aussi à nos médiateurs, guides et agents d'accueil qui, chaque jour, transmettent leur passion avec enthousiasme et professionnalisme. Leur engagement permet à chaque visiteur de vivre un moment mémorable et de repartir avec des connaissances solides sur l'exploration sous-marine et les enjeux de préservation des océans.

Et ce n'est qu'un début
Ces premiers résultats nous encouragent à poursuivre nos efforts et à enrichir continuellement notre programmation. De nouvelles expositions temporaires, des conférences avec des scientifiques, des ateliers pour les familles et des partenariats renforcés avec l'Ifremer et Naval Group sont déjà en préparation pour 2026. Le musée ABYSSE entend bien devenir une référence incontournable de la médiation océanographique en France.

Merci à tous ceux qui ont contribué à ce formidable démarrage. Rendez-vous dans les profondeurs pour continuer l'aventure ensemble.`,
        image_url: "/assets/1moisdeja.webp"
    },
    {
        categorie: "evenement",
        label_categorie: "Événement",
        date_texte: "1 Déc 2025",
        titre: "Conférence : Les pionnières des profondeurs",
        resume: "Rencontre exceptionnelle avec trois océanographes qui ont marqué l'histoire de l'exploration sous-marine. Un hommage émouvant aux femmes qui ont bravé les préjugés pour explorer l'inconnu.",
        contenu: `À l'occasion de la Journée internationale des droits des femmes, le musée ABYSSE organise une conférence exceptionnelle le 8 mars 2026 à 18h. Trois océanographes de renom viendront partager leur parcours, leurs découvertes et leur vision de l'exploration sous-marine au féminin. Un hommage émouvant aux femmes qui ont bravé les préjugés pour explorer l'inconnu.

Briser le plafond de verre des profondeurs
Longtemps considérée comme un domaine exclusivement masculin, l'exploration sous-marine compte pourtant de nombreuses pionnières qui ont marqué l'histoire de l'océanographie. Des premières plongeuses scientifiques aux cheffes de mission embarquées sur les navires de recherche, ces femmes ont dû faire face aux stéréotypes et aux obstacles pour imposer leur légitimité dans un milieu difficile.

Trois parcours inspirants
Les trois invitées de cette soirée ont toutes contribué de manière décisive à la compréhension des océans. Elles évoqueront leurs premières plongées, les défis techniques et humains rencontrés, mais aussi les moments de grâce face à la beauté des fonds marins. De la Méditerranée aux fosses abyssales, de la biologie marine à l'ingénierie des engins profonds, leurs témoignages croiseront science, aventure et engagement.

Échanges et transmission
La conférence sera suivie d'un temps d'échange avec le public, où chacun pourra poser ses questions et dialoguer avec ces exploratrices d'exception. Un moment privilégié pour inspirer les jeunes générations, et notamment les jeunes filles qui rêvent de carrières scientifiques et d'exploration. Des ouvrages et documentaires seront également présentés pour prolonger la découverte.

Un engagement fort du musée
En organisant cette rencontre, le musée ABYSSE affirme son engagement pour une océanographie inclusive et ouverte à tous les talents. Cette conférence s'inscrit dans une programmation annuelle qui met en lumière la diversité des acteurs de la recherche marine et valorise les parcours qui sortent des sentiers battus.

Informations pratiques
Conférence le 8 mars 2026 à 18h dans l'auditorium du musée. Entrée libre dans la limite des places disponibles. Réservation conseillée sur notre site ou à l'accueil.`,
        image_url: "/assets/conf.webp",
        date_evenement: "8 Mars 2026",
        heure_evenement: "18h"
    },
    {
        categorie: "musee",
        label_categorie: "Vie du Musée",
        date_texte: "15 Nov 2025",
        titre: "Ouverture du musée ABYSSE !",
        resume: "C'est le grand jour ! Le musée ABYSSE ouvre enfin ses portes au public. Venez découvrir les mystères des profondeurs dans un parcours immersif unique en France.",
        contenu: `Après des années de préparation, de restauration et d'aménagement, le musée ABYSSE ouvre officiellement ses portes ce 15 novembre 2025. À Toulon, berceau de la plongée moderne et terre des pionniers de l'exploration sous-marine, un nouvel espace dédié aux mystères des profondeurs océaniques voit le jour. Un lieu unique en France pour découvrir, comprendre et s'émerveiller.

Un parcours immersif inédit
Dès l'entrée, les visiteurs plongent dans un univers où se mêlent histoire, science et technologie. Le musée propose quatre espaces thématiques qui retracent l'aventure de l'exploration des abysses : de l'invention du scaphandre autonome par les Mousquemers dans la rade de Toulon en 1943, aux robots autonomes de l'Ifremer capables de descendre à plus de 6 000 mètres de profondeur.

Le Casabianca, pièce maîtresse
Au cœur du musée repose le Casabianca, authentique sous-marin de 1935 qui joua un rôle clé pendant la Seconde Guerre mondiale. Désarmé et transformé en espace d'exposition, ce géant d'acier de 92 mètres permet aux visiteurs de découvrir la vie à bord, les technologies de navigation sous-marine et l'histoire de la résistance française en Méditerranée. Une expérience immersive et émouvante qui plonge littéralement dans l'Histoire.

Technologies de pointe et simulateurs
Le musée ABYSSE ne se contente pas de regarder vers le passé. Grâce à des partenariats avec l'Ifremer et Naval Group, il propose des simulateurs de pilotage de ROV, des expériences en réalité virtuelle et des installations interactives qui permettent de comprendre comment les scientifiques explorent aujourd'hui les grands fonds. Une manière ludique et pédagogique de découvrir les enjeux actuels de l'océanographie.

Un engagement pour l'océan
Au-delà de l'émerveillement, le musée porte un message essentiel : celui de la préservation des océans. À travers des expositions sur la biodiversité abyssale, les écosystèmes fragiles des sources hydrothermales et les menaces qui pèsent sur les fonds marins, ABYSSE sensibilise le public à l'urgence de protéger ces milieux encore largement méconnus.

Bienvenue à bord
Le musée ABYSSE est désormais ouvert tous les jours. Venez découvrir les mystères des profondeurs dans un parcours immersif unique en France, et rejoignez l'aventure de celles et ceux qui explorent l'ultime frontière.`,
        image_url: "/assets/museum.webp"
    },
];

// Transformer la date texte en Timestamp Firebase
function transformerDate(dateString) {
    const moisMap = {
        "Jan": 0, "Fév": 1, "Mars": 2, "Avr": 3, "Mai": 4, "Juin": 5,
        "Juil": 6, "Août": 7, "Sept": 8, "Oct": 9, "Nov": 10, "Déc": 11
    };
    const parts = dateString.split(" ");
    const jour = parseInt(parts[0]);
    const mois = moisMap[parts[1]];
    const annee = parseInt(parts[2]);
    return new Date(annee, mois, jour);
}

async function supprimerTousLesArticles() {
    console.log("🗑️  Suppression des anciens articles...");
    const querySnapshot = await getDocs(collection(db, "articles"));
    let count = 0;
    for (const document of querySnapshot.docs) {
        await deleteDoc(doc(db, "articles", document.id));
        count++;
    }
    console.log(`   ${count} articles supprimés\n`);
}

async function lancerImportation() {
    console.log("🚀 Lancement de l'importation des articles...\n");

    // D'abord supprimer les anciens
    await supprimerTousLesArticles();

    let success = 0;
    let errors = 0;

    for (const art of articlesAImporter) {
        try {
            await addDoc(collection(db, "articles"), {
                ...art,
                date: Timestamp.fromDate(transformerDate(art.date_texte))
            });
            console.log(`✅ Importé : ${art.titre}`);
            success++;
        } catch (e) {
            console.error(`❌ Erreur sur "${art.titre}" :`, e.message);
            errors++;
        }
    }

    console.log(`\n🏁 Importation terminée !`);
    console.log(`   ✅ ${success} articles importés`);
    if (errors > 0) console.log(`   ❌ ${errors} erreurs`);

    process.exit(0);
}

lancerImportation();
