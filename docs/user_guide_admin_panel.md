# Guide de l'utilisateur du panneau d'administration Hexo

Ce guide vous aidera à utiliser le panneau d'administration pour gérer votre site Hexo.

## 1. Introduction

Le panneau d'administration Hexo est une interface utilisateur intuitive qui vous permet de créer, modifier et gérer le contenu de votre site Hexo sans avoir à manipuler directement les fichiers Markdown ou la ligne de commande. Il simplifie la publication d'articles, la gestion des pages, le téléchargement d'images et la configuration de certains aspects de votre site.

## 2. Accéder au panneau d'administration

Pour accéder au panneau d'administration, suivez ces étapes :

1.  Assurez-vous que votre serveur Hexo est en cours d'exécution. Vous pouvez généralement le démarrer avec la commande `hexo server` dans le répertoire racine de votre projet Hexo.
2.  Ouvrez votre navigateur web et accédez à l'adresse suivante : `http://localhost:4000/admin/` (le port peut varier si vous l'avez configuré différemment).
3.  Si la protection par mot de passe est activée, vous serez invité à entrer votre nom d'utilisateur et votre mot de passe.

## 3. Aperçu du tableau de bord

Une fois connecté, vous verrez le tableau de bord principal. Il offre un aperçu rapide de votre site et des liens vers les sections clés pour la gestion du contenu :

*   **Articles (Posts) :** Pour gérer tous vos articles de blog.
*   **Pages :** Pour gérer les pages statiques de votre site (ex: "À propos", "Contact").
*   **Équipes (Teams) :** Pour gérer les informations sur les équipes.
*   **Stades (Stades) :** Pour gérer les informations sur les stades.
*   **Matchs (Datas) :** Pour gérer les matchs et les événements.
*   **Résultats (Results) :** Pour enregistrer et consulter les résultats des matchs.
*   **Médias (Media) :** Pour télécharger et organiser vos images.
*   **Paramètres (Settings) :** Pour configurer les options du panneau d'administration, y compris la protection par mot de passe.

## 4. Gérer les articles (Posts)

Cette section vous permet de créer, modifier et supprimer des articles de blog.

### Créer un nouvel article

1.  Dans le tableau de bord, cliquez sur "Articles" (ou "Posts").
2.  Cliquez sur le bouton "Nouvel article" (ou "New Post").
3.  Remplissez les champs suivants :
    *   **Titre :** Le titre de votre article.
    *   **Contenu :** Écrivez le corps de votre article en utilisant le format Markdown. L'éditeur propose des outils pour formater le texte, insérer des liens, des images, etc.
    *   **Catégories :** Attribuez une ou plusieurs catégories à votre article.
    *   **Tags :** Ajoutez des mots-clés pertinents pour votre article.
    *   **Date :** La date de publication de l'article (par défaut, la date actuelle).
    *   **Statut :** Choisissez entre "Brouillon" (Draft), "Publié" (Published) ou "Privé" (Private).
4.  Cliquez sur "Enregistrer" (Save) pour sauvegarder votre article.

### Modifier un article existant

1.  Dans la liste des articles, cliquez sur le titre de l'article que vous souhaitez modifier.
2.  Apportez les modifications nécessaires dans l'éditeur.
3.  Cliquez sur "Enregistrer" (Save).

### Supprimer un article

1.  Dans la liste des articles, survolez l'article que vous souhaitez supprimer.
2.  Cliquez sur l'icône de la corbeille (Delete) qui apparaît.
3.  Confirmez la suppression.

## 5. Gérer les pages (Pages)

La gestion des pages est similaire à celle des articles, mais les pages sont généralement utilisées pour du contenu statique qui ne fait pas partie du flux de blog (ex: "À propos de nous", "Contact").

### Créer une nouvelle page

1.  Dans le tableau de bord, cliquez sur "Pages".
2.  Cliquez sur le bouton "Nouvelle page" (ou "New Page").
3.  Remplissez le titre et le contenu de la page.
4.  Cliquez sur "Enregistrer" (Save).

### Modifier/Supprimer une page

Les étapes pour modifier ou supprimer une page sont identiques à celles pour les articles.

## 6. Gérer les équipes (Teams)

Cette section vous permet de gérer les informations relatives aux équipes.

### Créer une nouvelle équipe

1.  Dans le tableau de bord, cliquez sur "Équipes" (ou "Teams").
2.  Cliquez sur le bouton "Créer une équipe" (ou "Create Team").
3.  Remplissez les champs suivants :
    *   **Nom de l'équipe :** Le nom de l'équipe.
    *   **Entraîneur :** Le nom de l'entraîneur de l'équipe.
    *   **Contact de l'entraîneur :** Numéro de téléphone de l'entraîneur.
    *   **Email de l'entraîneur :** Adresse email de l'entraîneur.
    *   **Groupe :** Le groupe auquel l'équipe appartient (ex: Groupe 1, Groupe 2, Groupe 3).
    *   **Description :** Une description de l'équipe.
4.  Cliquez sur "Enregistrer" (Save) pour sauvegarder l'équipe.

### Modifier une équipe existante

1.  Dans la liste des équipes, cliquez sur le nom de l'équipe que vous souhaitez modifier.
2.  Apportez les modifications nécessaires.
3.  Cliquez sur "Enregistrer" (Save).

### Supprimer une équipe

1.  Dans la liste des équipes, cliquez sur le nom de l'équipe que vous souhaitez supprimer.
2.  Cliquez sur le bouton "Supprimer" (Delete).
3.  Confirmez la suppression.

## 7. Gérer les stades (Stades)

Cette section vous permet de gérer les informations relatives aux stades.

### Créer un nouveau stade

1.  Dans le tableau de bord, cliquez sur "Stades".
2.  Cliquez sur le bouton "Créer un stade" (ou "Create Stade").
3.  Remplissez les champs suivants :
    *   **Nom du stade :** Le nom du stade.
    *   **Adresse :** L'adresse du stade.
    *   **Description :** Une description du stade.
4.  Cliquez sur "Enregistrer" (Save) pour sauvegarder le stade.

### Modifier un stade existant

1.  Dans la liste des stades, cliquez sur le nom du stade que vous souhaitez modifier.
2.  Apportez les modifications nécessaires.
3.  Cliquez sur "Enregistrer" (Save).

### Supprimer un stade

Les étapes pour supprimer un stade sont similaires à celles pour les équipes.

## 8. Gérer les matchs (Datas)

Cette section vous permet de gérer les matchs et les événements.

### Créer un nouveau match

1.  Dans le tableau de bord, cliquez sur "Matchs" (ou "Datas").
2.  Cliquez sur le bouton "Créer un match" (ou "Create Match").
3.  Remplissez les champs suivants :
    *   **Groupe :** Le groupe du match.
    *   **Session :** Le numéro de session du match.
    *   **Équipe 1 :** La première équipe participante.
    *   **Équipe 2 :** La deuxième équipe participante.
    *   **Date du match à domicile :** La date et l'heure du match à domicile.
    *   **Date du match à l'extérieur :** La date et l'heure du match à l'extérieur.
    *   **Lieu du match à domicile :** Le stade où se déroule le match à domicile.
    *   **Lieu du match à l'extérieur :** Le stade où se déroule le match à l'extérieur.
4.  Cliquez sur "Enregistrer" (Save) pour sauvegarder le match.

### Modifier un match existant

1.  Dans la liste des matchs, cliquez sur le titre du match que vous souhaitez modifier.
2.  Apportez les modifications nécessaires.
3.  Cliquez sur "Enregistrer" (Save).

### Supprimer un match

Les étapes pour supprimer un match sont similaires à celles pour les équipes.

## 9. Gérer les résultats (Results)

Cette section vous permet d'enregistrer et de consulter les résultats des matchs.

### Créer un nouveau résultat

1.  Dans le tableau de bord, cliquez sur "Résultats" (ou "Results").
2.  Cliquez sur le bouton "Créer un résultat" (ou "Create Result").
3.  Remplissez les champs suivants :
    *   **Match :** Sélectionnez le match concerné dans la liste déroulante.
    *   **Type de match :** Indiquez s'il s'agit d'un match à domicile ou à l'extérieur.
    *   **Score équipe 1 :** Le score de la première équipe.
    *   **Score équipe 2 :** Le score de la deuxième équipe.
    *   **Forfait :** Cochez si l'une des équipes a déclaré forfait.
    *   **Équipe en forfait :** Si forfait, indiquez le nom de l'équipe en forfait.
    *   **Reporté :** Cochez si le match a été reporté.
    *   **Équipe reportée :** Si reporté, indiquez le nom de l'équipe reportée.
4.  Cliquez sur "Enregistrer" (Save) pour sauvegarder le résultat.

### Modifier un résultat existant

1.  Dans la liste des résultats, cliquez sur le résultat que vous souhaitez modifier.
2.  Apportez les modifications nécessaires.
3.  Cliquez sur "Enregistrer" (Save).

### Supprimer un résultat

Les étapes pour supprimer un résultat sont similaires à celles pour les équipes.

## 10. Gestion des médias (Media)

Cette section vous permet de télécharger et de gérer les images que vous souhaitez utiliser sur votre site.

### Télécharger une image

1.  Dans le tableau de bord, cliquez sur "Médias" (ou "Media").
2.  Cliquez sur le bouton "Télécharger" (Upload) ou faites glisser et déposez vos images dans la zone désignée.
3.  Une fois téléchargées, les images seront disponibles pour être insérées dans vos articles et pages.

### Insérer une image dans un article/page

Lorsque vous éditez un article ou une page, utilisez l'outil d'insertion d'image dans l'éditeur. Vous pourrez choisir parmi les images déjà téléchargées ou en télécharger une nouvelle.

## 11. Paramètres (Settings)

La section "Paramètres" vous permet de configurer des options importantes pour votre panneau d'administration.

### Protection par mot de passe

Il est fortement recommandé de protéger votre panneau d'administration par un mot de passe, surtout si votre site est en ligne.

1.  Allez dans "Paramètres" (Settings).
2.  Recherchez la section "Configuration de l'authentification" (Setup authentication).
3.  Entrez un nom d'utilisateur et un mot de passe.
4.  Le panneau générera automatiquement la configuration nécessaire pour votre fichier `_config.yml` d'Hexo. Copiez ce bloc de code et collez-le dans votre fichier `_config.yml` (situé à la racine de votre projet Hexo).
5.  Redémarrez votre serveur Hexo pour que les modifications prennent effet.

### Métadonnées personnalisées

Vous pouvez définir des métadonnées personnalisées pour vos articles (par exemple, un `author_id` ou une `language`).

1.  Allez dans "Paramètres" (Settings).
2.  Recherchez la section pour les métadonnées personnalisées.
3.  Ajoutez les variables de métadonnées que vous souhaitez utiliser. Vous pouvez également définir des valeurs par défaut.
4.  Ces champs apparaîtront ensuite lorsque vous créerez ou modifierez un article.







