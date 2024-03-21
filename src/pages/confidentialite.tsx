import Footer from "@/components/footer"
import Head from "next/head"
import Script from "next/script"

const Confidentialite = () => {
  return (
    <main className="mt-10 lg:w-1/2 confidentialite">
      <Head>
        <title>Secrétariat</title>
      </Head>
      <h1 className="text-center text-3xl">Politique de confidentialité</h1>
      <h2>Qui est responsable du Secrétariat ?</h2>
      <p>
        Le Secrétariat est développé au sein de la Fabrique numérique des
        ministères sociaux. Il s&apos;agit d&apos;une plateforme numérique
        permettant aux membres des Startups d&apos;Etat d’effectuer une demande
        d&apos;embarquement ou une revue des comptes des utilisateurs des
        services de la Fabrique.
      </p>
      <p>
        Le responsable de l’utilisation des données est la Direction du
        numérique des ministères sociaux représentée par Madame Anne JEANJEAN,
        directrice du numérique des ministères sociaux.
      </p>
      <h2>Pourquoi traitons-nous des données à caractère personnel ?</h2>
      <p>
        Le Secrétariat de la Fabrique Numérique des ministères sociaux traite
        des données à caractère personnelles pour les raisons suivantes&nbsp;:
      </p>
      <ul>
        <li>
          Permettre aux membres des Startups d’Etat de gérer leurs accès aux
          services de la Fabrique Numérique des ministères sociaux et effectuer
          une revue des comptes des utilisateurs des services de la Fabrique.
        </li>
      </ul>
      <h2>Quelles sont les données que nous traitons ?</h2>
      <p>
        Le Secrétariat de la Fabrique Numérique des ministères sociaux traite
        les données suivantes&nbsp;:
      </p>
      <ul>
        <li>
          Données du formulaire d’embarquement&nbsp;: prénom, nom, adresse
          e-mail, champs libres.
        </li>
      </ul>
      <h2>Qu’est-ce qui nous autorise à traiter ces données ?</h2>
      <p>
        Le Secrétariat de la Fabrique Numérique des ministères sociaux traite
        des données à caractère personnel en se basant sur&nbsp;:
      </p>
      <ul>
        <li>
          L’exécution d’une mission d’intérêt public ou relevant de l’exercice
          de l’autorité publique dont est investi le responsable de traitement
          au sens de l’article 6-1 e) du RPGD.
        </li>
      </ul>
      <h2>Pendant combien de temps conservons-nous ces données ?</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Type de données</th>
            <th scope="col">Durée de la conservation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Données du formulaire d&apos;embarquement</td>
            <td>2 ans à partir du dernier contact avec l’utilisateur</td>
          </tr>
        </tbody>
      </table>
      <h2>Quels sont vos droits ?</h2>
      <p>Vous disposez&nbsp;:</p>
      <ul>
        <li>
          D’un droit d’information et d’un droit d’accès à vos données&nbsp;;
        </li>
        <li>D’un droit de rectification&nbsp;;</li>
        <li>D’un droit d’opposition&nbsp;;</li>
        <li>D’un droit à la limitation du traitement de vos données.</li>
      </ul>
      <p>
        Pour les exercer, contactez-nous à&nbsp;:{" "}
        <a href="mailto:dpd-minsociaux@sg.social.gouv.fr">
          dpd-minsociaux@sg.social.gouv.fr
        </a>
      </p>
      <p>
        Vous pouvez exercer vos droits également en adresser un courrier à
        l’attention du Délégué à la Protection des Données de la Direction du
        numérique des ministères sociaux&nbsp;:
      </p>
      <p className="!pb-0">39-43 Quai André Citroën</p>
      <p className="!pt-0">75739 Paris Cedex 15</p>
      <p>
        Puisque ce sont des droits personnels, nous ne traiterons votre demande
        que si nous sommes en mesure de vous identifier. Dans le cas où nous ne
        parvenons pas à vous identifier, nous pouvons être amenés à vous
        demander une preuve de votre identité.
      </p>
      <p>
        Pour vous aider dans votre démarche, vous trouverez un modèle de
        courrier élaboré par la CNIL ici&nbsp;:{" "}
        <a href="https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces">
          https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces
        </a>
        .
      </p>
      <p>
        Nous nous engageons à vous répondre dans un délai raisonnable qui ne
        saurait dépasser 1 mois à compter de la réception de votre demande.
      </p>
      <h2>Qui va avoir accès à ces données ?</h2>
      <p>
        Les accès aux données sont strictement encadrés et juridiquement
        justifiés. Les personnes suivantes vont avoir accès aux données&nbsp;:
      </p>
      <ul>
        <li>
          Les membres de Secrétariat qui ont besoin des données dans leurs
          missions ou qui y ont accès de fait (développeur, etc.).
        </li>
      </ul>
      <h2>Quelles mesures de sécurité mettons-nous en place ?</h2>
      <p>
        Nous mettons en place plusieurs mesures pour sécuriser les
        données&nbsp;:
      </p>
      <ul>
        <li>Stockage des données en base de données ;</li>
        <li>Cloisonnement des données ;</li>
        <li>Mesures de traçabilité ;</li>
        <li>Surveillance ;</li>
        <li>Protection contre les virus, malwares et logiciels espions ;</li>
        <li>Protection des réseaux ;</li>
        <li>Sauvegarde ;</li>
        <li>
          Mesures restrictives limitant l’accès physique aux données à caractère
          personnel.
        </li>
      </ul>
      <h2>Qui nous aide à traiter vos données ?</h2>
      <p>
        Certaines des données sont envoyées à d’autres acteurs, appelés
        “sous-traitants de données”, pour qu’ils nous aident à les traiter. Nous
        nous assurons qu’ils respectent strictement le RGPD et qu’ils apportent
        des garanties suffisantes en matière de sécurité.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Sous-traitant</th>
            <th scope="col">Pays destinataire</th>
            <th scope="col">Traitement réalisé</th>
            <th scope="col">Garanties</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>OVH</td>
            <td>France</td>
            <td>Hébergement</td>
            <td>
              <a href="https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/9e74492-OVH_Data_Protection_Agreement-FR-6.0.pdf">
                https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/9e74492-OVH_Data_Protection_Agreement-FR-6.0.pdf
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <h2>Cookies et traceurs</h2>
      <p>
        Un cookie est un fichier déposé sur votre terminal lors de la visite
        d’un site. Il a pour but de collecter des informations relatives à votre
        navigation et de vous adresser des services adaptés à votre terminal
        (ordinateur, mobile ou tablette).
      </p>
      <p>
        En application de l’article 5(3) de la directive 2002/58/CE modifiée
        concernant le traitement des données à caractère personnel et la
        protection de la vie privée dans le secteur des communications
        électroniques, transposée à l’article 82 de la loi n° 78-17 du 6 janvier
        1978 relative à l’informatique, aux fichiers et aux libertés, les
        traceurs ou cookies suivent deux régimes distincts.
      </p>
      <p>
        Les cookies strictement nécessaires au service ou ayant pour finalité
        exclusive de faciliter la communication par voie électronique sont
        dispensés de consentement préalable au titre de l’article 82 de la loi
        n° 78-17 du 6 janvier 1978.
      </p>
      <p>
        Les cookies n’étant pas strictement nécessaires au service ou n’ayant
        pas pour finalité exclusive de faciliter la communication par voie
        électronique doivent être consenti par l’utilisateur.
      </p>
      <p>
        Ce consentement de la personne concernée pour une ou plusieurs finalités
        spécifiques constitue une base légale au sens du RGPD et doit être
        entendu au sens de l&apos;article 6-a du Règlement (UE) 2016/679 du
        Parlement européen et du Conseil du 27 avril 2016 relatif à la
        protection des personnes physiques à l&apos;égard du traitement des
        données à caractère personnel et à la libre circulation de ces données.
      </p>
      <p>
        À tout moment, vous pouvez refuser l’utilisation des cookies et
        désactiver le dépôt sur votre ordinateur en utilisant la fonction dédiée
        de votre navigateur (fonction disponible notamment sur Microsoft
        Internet Explorer 11, Google Chrome, Mozilla Firefox, Apple Safari et
        Opera).
      </p>
      <p>
        Secrétariat utilise la solution de mesure d’audience Matomo, configuré
        en mode «&nbsp;exempté&nbsp;» et ne nécessitant pas le recueil de votre
        consentement conformément aux recommandations de la CNIL.
      </p>
      {/* <div id="matomo-opt-out"></div> */}
      {/* <Script */}
      {/*   nonce={process.env.NONCE} */}
      {/*   src="https://matomo.fabrique.social.gouv.fr/index.php?module=CoreAdminHome&action=optOutJS&divId=matomo-opt-out&language=auto&showIntro=0" */}
      {/* ></Script> */}
      <div id="matomo-opt-out"></div>
      <Script nonce={process.env.NONCE} id="matomo-script">
        {`var settings = {"showIntro":true,"divId":"matomo-opt-out","useSecureCookies":true,"cookiePath":null,"cookieDomain":null,"cookieSameSite":"Lax","OptOutComplete":"Cookie d'exclusion install\u00e9. Vos visites sur ce site web ne seront PAS enregistr\u00e9es par notre outil d'analyse web.","OptOutCompleteBis":"Note\u00a0: si vous nettoyez vos cookies et supprimez le cookie d'exclusion, ou bien si vous changez d'ordinateur et\/ou de navigateur, il vous faudra de nouveau effectuer la proc\u00e9dure d'exclusion.","YouMayOptOut2":"Vous pouvez vous opposer au suivi de votre navigation sur ce site web.","YouMayOptOut3":"Cela prot\u00e9gera votre vie priv\u00e9e, mais emp\u00eachera \u00e9galement le propri\u00e9taire d'apprendre de vos actions et de cr\u00e9er une meilleure exp\u00e9rience pour vous et les autres utilisateurs.","OptOutErrorNoCookies":"La fonctionnalit\u00e9 de d\u00e9sactivation du suivi n\u00e9cessite que les cookies soient autoris\u00e9s.","OptOutErrorNotHttps":"La fonctionnalit\u00e9 de d\u00e9sactivation du suivi pourrait ne pas fonctionner car ce site n'a pas \u00e9t\u00e9 charg\u00e9 en HTTPS. Veuillez recharger la page pour v\u00e9rifier que le statut de ce suivi a bien \u00e9t\u00e9 chang\u00e9.","YouAreNotOptedOut":"Vous n'\u00eates pas exclu(e).","UncheckToOptOut":"D\u00e9cochez cette case pour vous exclure.","YouAreOptedOut":"Vous n'\u00eates actuellement pas suivi(e).","CheckToOptIn":"Cochez cette case pour ne plus \u00eatre exclu(e)."};         
    document.addEventListener('DOMContentLoaded', function() {                             
        window.MatomoConsent.init(settings.useSecureCookies, settings.cookiePath, settings.cookieDomain, settings.cookieSameSite);                
        showContent(window.MatomoConsent.hasConsent());        
    });    
    
    
        function showContent(consent, errorMessage = null, useTracker = false) {
    
            var errorBlock = '<p style="color: red; font-weight: bold;">';
    
            var div = document.getElementById(settings.divId);
            if (!div) {
                const warningDiv = document.createElement("div");
                var msg = 'Unable to find opt-out content div: "'+settings.divId+'"';
                warningDiv.id = settings.divId+'-warning';
                warningDiv.innerHTML = errorBlock+msg+'</p>';
                document.body.insertBefore(warningDiv, document.body.firstChild);
                console.log(msg);
                return;
            }
            
            if (!navigator || !navigator.cookieEnabled) {
                div.innerHTML = errorBlock+settings.OptOutErrorNoCookies+'</p>';
                return;
            }
            if (location.protocol !== 'https:') {
                div.innerHTML = errorBlock+settings.OptOutErrorNotHttps+'</p>';
                return;
            }        
            if (errorMessage !== null) {
                div.innerHTML = errorBlock+errorMessage+'</p>';
                return;
            }
            var content = '';        
            if (consent) {
                if (settings.showIntro) {
                    content += '<p>'+settings.YouMayOptOut2+' '+settings.YouMayOptOut3+'</p>';                       
                }
                if (useTracker) {
                    content += '<input onclick="_paq.push([\'optUserOut\']);showContent(false, null, true);" id="trackVisits" type="checkbox" checked="checked" />';
                } else {
                    content += '<input onclick="window.MatomoConsent.consentRevoked();showContent(false);" id="trackVisits" type="checkbox" checked="checked" />';
                }
                content += '<label for="trackVisits"><strong><span>'+settings.YouAreNotOptedOut+' '+settings.UncheckToOptOut+'</span></strong></label>';                               
            } else {
                if (settings.showIntro) {
                    content += '<p>'+settings.OptOutComplete+' '+settings.OptOutCompleteBis+'</p>';
                }
                if (useTracker) {
                    content += '<input onclick="_paq.push([\'forgetUserOptOut\']);showContent(true, null, true);" id="trackVisits" type="checkbox" />';
                } else {
                    content += '<input onclick="window.MatomoConsent.consentGiven();showContent(true);" id="trackVisits" type="checkbox" />';
                }
                content += '<label for="trackVisits"><strong><span>'+settings.YouAreOptedOut+' '+settings.CheckToOptIn+'</span></strong></label>';
            }                   
            div.innerHTML = content;      
        };   

        window.MatomoConsent = {                         
            cookiesDisabled: (!navigator || !navigator.cookieEnabled),        
            CONSENT_COOKIE_NAME: 'mtm_consent', CONSENT_REMOVED_COOKIE_NAME: 'mtm_consent_removed', 
            cookieIsSecure: false, useSecureCookies: true, cookiePath: '', cookieDomain: '', cookieSameSite: 'Lax',     
            init: function(useSecureCookies, cookiePath, cookieDomain, cookieSameSite) {
                this.useSecureCookies = useSecureCookies; this.cookiePath = cookiePath;
                this.cookieDomain = cookieDomain; this.cookieSameSite = cookieSameSite;
                if(useSecureCookies && location.protocol !== 'https:') {
                    console.log('Error with setting useSecureCookies: You cannot use this option on http.');             
                } else {
                    this.cookieIsSecure = useSecureCookies;
                }
            },               
            hasConsent: function() {
                var consentCookie = this.getCookie(this.CONSENT_COOKIE_NAME);
                var removedCookie = this.getCookie(this.CONSENT_REMOVED_COOKIE_NAME);
                if (!consentCookie && !removedCookie) {
                    return true; // No cookies set, so opted in
                }
                if (removedCookie && consentCookie) {                
                    this.setCookie(this.CONSENT_COOKIE_NAME, '', -129600000);              
                    return false;
                }                
                return (consentCookie || consentCookie !== 0);            
            },        
            consentGiven: function() {                                                        
                this.setCookie(this.CONSENT_REMOVED_COOKIE_NAME, '', -129600000);
                this.setCookie(this.CONSENT_COOKIE_NAME, new Date().getTime(), 946080000000);
            },      
            consentRevoked: function() {    
                this.setCookie(this.CONSENT_COOKIE_NAME, '', -129600000);
                this.setCookie(this.CONSENT_REMOVED_COOKIE_NAME, new Date().getTime(), 946080000000);                
            },                   
            getCookie: function(cookieName) {            
                var cookiePattern = new RegExp('(^|;)[ ]*' + cookieName + '=([^;]*)'), cookieMatch = cookiePattern.exec(document.cookie);
                return cookieMatch ? window.decodeURIComponent(cookieMatch[2]) : 0;
            },        
            setCookie: function(cookieName, value, msToExpire) {                       
                var expiryDate = new Date();
                expiryDate.setTime((new Date().getTime()) + msToExpire);            
                document.cookie = cookieName + '=' + window.encodeURIComponent(value) +
                    (msToExpire ? ';expires=' + expiryDate.toGMTString() : '') +
                    ';path=' + (this.cookiePath || '/') +
                    (this.cookieDomain ? ';domain=' + this.cookieDomain : '') +
                    (this.cookieIsSecure ? ';secure' : '') +
                    ';SameSite=' + this.cookieSameSite;               
                if ((!msToExpire || msToExpire >= 0) && this.getCookie(cookieName) !== String(value)) {
                    console.log('There was an error setting cookie \`' + cookieName + '\`. Please check domain and path.');                
                }
            }
        };`}
      </Script>

      <p>
        Pour aller plus loin, vous pouvez consulter les fiches proposées par la
        Commission Nationale de l&apos;Informatique et des Libertés
        (CNIL)&nbsp;:
      </p>
      <ul className="pb-4">
        <li>
          <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/que-dit-la-loi">
            Cookies & traceurs&nbsp;: que dit la loi ?
          </a>
        </li>
        <li>
          <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/comment-se-proteger/maitriser-votre-navigateur">
            Cookies&nbsp;: les outils pour les maîtriser
          </a>
        </li>
      </ul>

      <Footer />
    </main>
  )
}

export default Confidentialite
