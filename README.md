
# API REST Justification
## Bibliothèques utilisées :
* Quick.db - Utilisation simple de base sqlite 
* jsonwebtoken - Génération de token

Si j'ai utilisé Quick.db ici alors que j'aurais pu utiliser MongoDB c'est parce que je connais déjà Quick.db, je l'utilise plus souvent étant donné que je suis encore débutant et que je ne travaille que sur des petits projets JavaScript, cela me paraît plus simple.

L'application est aussi utilisable directement avec https://api-rest-justify.herokuapp.com.
La partie installation n'est donc pas obligatoire.

## Installation :

* `git clone https://github.com/Alexmdz77/API-REST-justify.git`
* `cd API-REST-justify`
* `npm install`

## Utilisation :

* `node index.js`

Vous pourrez utiliser POSTMAN pour simplifier les requêtes.
### S'inscrire et/ou générer un nouveau token : 
* Requête sur : api/token en POST 
* Body en JSON :
    `{"email": "foo@bar.com"}`

Cette requête vous renvoi votre token :
```
{
    "status": "success",
    "message": "New user, your security token:",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QiLCJpYXQiOjE2MDUwOTU2NzAsImV4cCI6MTYwNTE4MjA3MH0.gLyPVAHxSl3eTOUl8QEL8TbsBt-g4QiPn5D0C9D1V2w"
}
```
On utilisera ce token pour la requête suivante :
### Justification de texte :

* Requête sur : /api/justify
* Headers : Key : `"token"`  Value : `"votre token"`
* Body en text/plain :
 ```
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
```
Cette requête vous renvoi votre texte justifié :
```
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
Ipsum has been the industry's standard dummy text ever since the 1500s, when  an
unknown  printer  took a galley of type and scrambled it to make a type specimen
book. It has survived not only five centuries, but also the leap into electronic
typesetting,  remaining  essentially  unchanged. It was popularised in the 1960s
with  the  release  of Letraset sheets containing Lorem Ipsum passages, and more
recently  with  desktop  publishing  software  like  Aldus  PageMaker  including
versions of Lorem Ipsum.
```
Le type de sortie doit être en JSON, XML ou Text.

Une fois la limite de 80000 mots par jour par token atteinte vous recevrez une erreur :
```
{ 
    "status":  "error", 
    "message":  '402 Payment Required.' 
}
```
Il vous faudra donc générer un nouveau token via /api/token.

### Affichage des utilisateurs :
Une Requête supplémentaire permet l'affichage de tous les utilisateurs créés :
* Requête sur : /api/users en GET

Renvoi la liste des emails :
```
{
    "foo@bar.com",
    "foo1@bar.com",
    "foo2@bar.com"
}
```

## Contraintes :
* La longueur des lignes du texte [justifié](https://fr.wikipedia.org/wiki/Justification_(typographie)) doit être de 80 caractères.
* L’endpoint doit être de la forme /api/justify et doit retourner un texte justifié suite à une requête POST avec un body de ContentType  text/plain.
* L’api doit utiliser un mécanisme d’authentification via token unique. En utilisant par exemple une endpoint api/token qui retourne un token d’une requête POST avec un json body {"email": "foo@bar.com"}.
* Il doit y avoir un rate limit par token pour l’endpoint /api/justify, fixé à 80 000 mots par jour, si il y en a plus dans la journée il faut alors renvoyer une erreur 402 Payment Required.
* Le code doit être déployé sur un url ou une ip public.
* Le code doit être rendu sur github.
* Langage : Nodejs.
* PAS d’usage de bibliothèque externe pour la justification