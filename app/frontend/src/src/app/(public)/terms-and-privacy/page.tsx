"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function template() {

  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <Card> {/*Partie carte, ce qui entoure le contenu de la page, a un titre. */}
            <CardHeader>
                <h3 className='text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white'>Mention légale</h3>
            </CardHeader>
            <CardContent>
                <div className="dark:text-white">
Cette politique de confidentialité décrit comment IUT Connect.fr («IUT Connect», « nous », « notre ») collecte, protège et utilise les informations personnelles identifiables que vous pouvez fournir via le site Web IUT Connect ou son API. 
La politique décrit également les choix qui s&apos;offrent à vous concernant notre utilisation de vos informations personnelles et la manière dont vous pouvez accéder et mettre à jour ces informations.
Cette politique ne s&apos;applique pas aux pratiques des entreprises que IUT Connect ne possède ou ne contrôle pas, ni aux individus que IUT Connect n&apos;emploie ou ne gère pas.
                </div>
                <br/>
                <h2 className='mb-4 font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-white'>Quelles informations collectons-nous?</h2>
                <Separator className="my-1" />
                <div>
                    - Informations de base sur le compte :   
                </div>
                <br/> 
                <div>
                    Si vous vous inscrivez sur ce site en tant qu&apos;utilisateur, il vous sera demandé de saisir votre nom et prénom, une adresse e-mail personelle et UBS ainsi qu&apos;un mot de passe. Vous pouvez également saisir des informations de profil supplémentaires telles que le CV et la photo de profil. Pour les utilisateurs étudiants, votre nom prénom, adresse e-mail UBS et CV si présent seront affichés publiquement.
                    <br/>
                    Si vous vous inscrivez sur ce site en tant qu&apos;entreprise, il vous sera demandé de saisir le nom de votre entreprise, une adresse e-mail,la ville et le code postal de votre entreprise, ainsi qu&apos;un mot de passe. Vous pouvez également saisir des informations de profil supplémentaires telles que votre site internet, des contacts supplémentaires, et la photo de profil. Votre nom d&apos;entreprise, Ville, code postal, et informations de contact seront affichés publiquement.
                </div>
                <br/>
                <div>
                    - Offres et CVs :   
                </div>
                <br/> 
                <div>
                    En tant qu&apos;entreprise, lorsque vous soumettez une offre, la date est stockée et affichée publiquement. Les offres peuvent contenir des pièces jointes PDF.
                    Les offres ne seront pas visibles publiquement tant qu&apos;un administrateur ne les a pas approuvés.
                    En tant qu&apos;etudiant, lorsque vous soumettez un CV sur votre profil, celui-ci est visible pour toutes les entreprises qui recherchent directement un étudiant.
                </div>
                <br/>
                <div>
                    - IP et autres métadonnées :   
                </div>
                <br/> 
                <div>
                    lorsque vous vous connectez, nous enregistrons l&apos;adresse IP à partir de laquelle vous vous connectez, ainsi que le nom de votre application de navigateur.
                </div>
                <div>
                    La dernière adresse IP utilisée est conservée pendant 24 mois maximum. Nous pouvons également conserver les journaux du serveur qui incluent l&apos;adresse IP de chaque demande adressée à notre serveur.
                </div>
                <br/> 
                <h2 className='mb-4 font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-white'>Pourquoi utilisons-nous vos informations ?</h2>
                <Separator className="my-1" />
                <div>
                    Toutes les informations que nous collectons auprès de vous peuvent être utilisées des manières suivantes :
                </div>
                <br/>
                <div>
                    Fournir les fonctionnalités de base de IUT Connect.
                </div>
                <br/>
                <div>
                    Vous ne pouvez interagir avec le contenu d&apos;autres personnes et publier votre propre contenu que lorsque vous êtes connecté. Par exemple, vous pouvez publier une offre en tant qu&apos;entreprise ou consulter les offres existants en tant qu&apos;étudiant.
                </div>
                <br/>
                <div>
                    Pour faciliter la modération du site.
                </div>
                <br/>
                <div>
                    Par exemple en comparant votre adresse IP avec d&apos;autres adresses connues pour déterminer une attaque de déni de service ou pour permettre de retrouver vos informations de connexion.
                </div>
                <br/>
                <div>
                Pour créer des alertes d&apos;offres.
                </div>
                <br/>
                <div>
                    En tant qu&apos;etudiant, l&apos;adresse e-mail que vous fournissez peut être utilisée pour vous envoyer des alertes et notifications sur des offres qui correspondent aux filtres que vous avez séléctionnés.
                </div>
                <br/> 
                <h2 className='mb-4 font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-white'>Comment protégeons-nous vos informations ?</h2>
                <Separator className="my-1" />
                <br/>
                <div>
                    Nous mettons en œuvre diverses mesures de sécurité pour maintenir la sécurité de vos informations personnelles. Entre autres choses, votre session de navigateur, ainsi que le trafic entre vos applications et l&apos;API, sont sécurisés avec SSL et votre mot de passe est crypté à l&apos;aide d&apos;un algorithme asymétrique puissant.
                </div>
                <br/> 
                <h2 className='mb-4 font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-white'>Quelle est notre politique de conservation des données ?</h2>
                <Separator className="my-1" />
                <br/>
                <div>
                    Nous nous efforcerons de conserver les adresses IP ainsi que toutes les informations associées aux utilisateurs enregistrés pendant 24 mois maximum après la dernière connexion.
                </div>
                <br/>
                <div>
                    Vous pouvez à tout moment supprimer votre compte de manière irréversible.
                </div>
                <br/> 
                <h2 className='mb-4 font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-white'>Utilisons-nous des cookies ?</h2>
                <Separator className="my-1" />
                <br/>
                <div>
                    Non. Nous n&apos;utilisons pas de cookies.
                </div>
                <br/> 
                <h2 className='mb-4 font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-white'>Divulgeons-nous des informations à des parties extérieures ?</h2>
                <Separator className="my-1" />
                <br/>
                <div>
                    Nous ne vendons, n&apos;échangeons ni ne transférons à des tiers vos informations personnelles identifiables. Cela n&apos;inclut pas les tiers de confiance qui nous aident à exploiter notre site, à mener nos activités ou à vous servir, à condition que ces parties acceptent de garder ces informations confidentielles. Nous pouvons également divulguer vos informations lorsque nous pensons que cette divulgation est appropriée pour nous conformer à la loi, appliquer les politiques de notre site ou protéger nos droits, notre propriété ou notre sécurité ou ceux d&apos;autrui.
                </div>
                <br/>
                <div>
                    Lorsque vous autorisez une application à utiliser votre compte, selon l&apos;étendue des autorisations que vous approuvez, elle peut accéder aux informations de votre profil. Les applications ne peuvent jamais accéder à votre adresse e-mail ou à votre mot de passe.
                </div>
                <br/> 
                <h2 className='mb-4 font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-white'>Utilisation du site par les enfants</h2>
                <Separator className="my-1" />
                <br/>
                <div>
                Notre site et nos services sont tous destinés aux personnes âgées d&apos;au moins 16 ans. Si vous avez moins de 16 ans, conformément aux exigences du RGPD (Règlement Général sur la Protection des Données), n&apos;utilisez pas ce site.
                </div>
                <br/>
                <div>
                Ce document est CC-BY-SA. Adapté de la politique de confidentialité de mastodon.social
                </div>
               


               
            </CardContent>
      </Card>
    </div>
  )
}