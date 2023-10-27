# Lancement de l'application en mode Développement

Afin de pouvoir tester l'application, il faut évidemment la télécharger, pour cela, vous pouvez la cloner sur votre ordinateur. Ci-dessous, un extrait pour expliquer comment cloner le projet sur votre ordinateur.

### Prérequis :

- Le langage Go est installé
- pgadmin4 est installé

### Télécharger le projet

Vous pouvez télécharger le projet de trois manières différentes :

* En utilisant le bouton "Télécharger" pour obtenir une archive au format .zip ou .tar. L'avantage de cette méthode est qu'elle ne nécessite aucune identification.
* Depuis le bouton Cloner, avec un **protocole SSH**, en suivant cet [exemple](https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/github-clone-with-ssh-keys), l'avantage c'est la sécurité sans fournir ses informations d'identification à chaque requête, optimal pour le développement

```shell
git clone git@forgens.univ-ubs.fr:kerbelle/iut-connect.git
```

* Depuis le bouton Cloner, avec un **protocole HTTPS**, en suivant cet [exemple](https://learn.hibbittsdesign.org/gitlab-githubdesktop/cloning-a-gitlab-repo), l'avantage c'est la sécurité aux prix de finir ses informations d'identification à chaque requête.

```shell
git clone https://forgens.univ-ubs.fr/gitlab/kerbelle/iut-connect.git
```

### Préparation de la base de données

Pour préparer votre propre base de données, il vous faudra :

 - Créer un serveur postgresql et une base de données sur pgadmin4
 - Charger le script de création de table dans l'API
 - Modifier le fichier config.yaml dans l'API

 Nous allons passer la première partie, il existe des tutoriels pour l'installation et l'utilisation de pgadmin4.

 - Pendant la création de votre base de données, vous allez lui donner une IP et un port sur lequel écouter, il est important que vous notez l'IP ainsi que le port, ceux-ci seront utilisé plus tards.

 Pour charger le script de création de tables, il faut d'abords le trouver, pour cela, dirigez vous dans code/api/db/create.sql, éxécutez ce code dans votre base de données postgresql.

 Une fois le script chargé, retournez dans le projet à code/api/config.yaml, ouvrez le fichier, et remplacez les valeurs pour "host" et "port" dans "database", avec celle que vous avez noté pendant l'installation de la base de données postgresql. Par exemple, si vous avez utilisé localhost, votre addresse IP sera 127.0.0.0.

### Préparations avec des terminals

Maintenant que vous avez votre fichier contenant le projet, ouvrez deux terminaux différents :
#### backend
- Sur un premier terminal, mettez vous dans code/api.
```shell
cd iut-connect/code/api
```
- Pour lancer l'API, vous aurez juste a taper 
```shell
go run . 
```
#### frontend
- Sur un deuxième terminal, mettez vous dans code/application.
```shell
cd iut-connect/code/application
```
- Pour lancer l'application, vous devez d'abords taper 
```shell
npm i 
```
- suivi de

```shell
npm run dev
```

### Voir l'application

Une fois que les deux terminals exécutent leur parties, vous avez plus qu'a ouvrir le moteur de recherche de votre choix, taper "http://localhost:3000" dans l'URL, et si tout s'est bien passé, l'application devrait répondre et devrait pouvoir être testée.

### Tester l'application

Si vous faites des changements sur le frontend seulement, normalement, il suffit de rafraichir la page pour voir les modifications, pas besoin de relancer npm run dev pour voir les modifications.

Cela n'est pas vrai pour l'api, dès que vous modifier le backend ou les liens, il faudra relancer l'api en faisant ctrl + c dans le terminal qui fait tourner l'api suivi d'un go run . a nouveau.
