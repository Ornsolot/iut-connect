# Test de l'installation de l'application sur machine virtuelle

## Temps de l'installation : Environ 20 minutes

## Prérequis

### - Une machine virtuelle (VM, ici Ubuntu)

### - Un compte Forge-ens

--------------

1. Je me suis tout d'abords dirigé sur le projet GitLab de l'application pour lire le README contenant les étapes de l'installation.

2. J'ai suivi le README de l'installation :

    A.1 - J'ai copié la commande pour cloner le répertoire GitLab en utilisant SSH.

    ERREUR : il faut créer une clé SSH en plus du compte Forge-ens
    SOLUTION : cloner le répertoire gitlab en utilisant HTTPs
    (Recommendation d'utiliser HTTPs pour les VMs)

    A.2 - J'ai copié la commande pour cloner le répertoire GitLab en utilisant HTTPs.

    B - J'ai entré mes informations de connexion dans l'invite de commande quand celles-ci étaient demandées.

    C.1 - J'ai lancé la commande 'sudo ./wizard.sh'.

    ERREUR : le fichier est introuvable
    SOLUTION : se déplacer dans le fichier racine cloné "iut-connect"
    (toutes les commandes se feront a partir de ce dossier maintenant)

    C.2 - Je me suis déplacé dans le dossier "iut-connect".

    D - J'ai lancé la commande 'sudo ./wizard.sh'.

    E - J'ai tapé yes/y pour chaque question que l'installateur me demandais, jusqu'au redémarrage de la VM.

    F - Au redémarrage, je me suis déplacé dans "iut-connect" a nouveaux et j'ai éxécuté les deux commandes suivantes dans le README.

    G - J'ai lancé la commande 'make all'

    ERREUR : Pas de permission
    SOLUTION : 'sudo make all', cette erreur apparait seulement si les deux commandes précédentes n'ont pas été faites dans "iut-connect"

    H - Une fois la commande terminée, j'ai tapé la commande 'docker ps -a' l'état des dockers, permettant de vérifier le succès de l'installation et trouver l'adresse IP du docker front-end

    I -  je me suis dirigé vers l'IP trouvée sur internet en faisant attention d'utiliser http:// (ex : <http://127.0.0.1:3000/login>)
