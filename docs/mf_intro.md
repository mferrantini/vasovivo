# VasoVivo

## Prefazione

Negli ultimi anni la coltivazione **indoor** (in ambiente controllato) e l'approccio **smart** basato su sensori e automazione sono diventati protagonisti di un settore in rapida crescita: l'**indoor farming** vale già decine di miliardi di dollari e le proiezioni lo portano oltre i **100 miliardi USD** entro i primi anni 2030. Anche il mercato della **smart agriculture** — IoT, automazione, data-driven farming — segue la stessa traiettoria, con stime superiori agli **80 miliardi USD** entro il 2033.

In questo contesto, la community **Maker** gioca un ruolo tutt'altro che marginale: molte soluzioni nascono dal basso, vengono autocostruite, documentate e condivise — BOM, file per la stampa 3D, firmware e guide — rendendo accessibili tecniche di monitoraggio e controllo tipiche degli impianti professionali anche a progetti domestici e didattici.

Un formato particolarmente pratico per la sperimentazione è la coltivazione "in **zolletta**": un blocco di substrato già inoculato (tipicamente a base di paglia, segatura e nutrienti) che, mantenuto nelle giuste condizioni di umidità, temperatura e ricambio d'aria, sviluppa il micelio e produce i corpi fruttiferi. L'idea è eliminare la fase più complessa — la preparazione del substrato — e rendere la crescita più prevedibile: a quel punto, la differenza la fanno la gestione del microclima e la costanza dei parametri.

---

## Il progetto

**VasoVivo** è un sistema di monitoraggio attivo per la coltivazione di funghi in piccolo contenitore: un barattolo che ospita una zolletta di substrato, chiuso da un coperchio "intelligente" su cui è integrata una sensoristica completa.

I sensori, collegati a una scheda **ESP32**, misurano in tempo reale i parametri ambientali rilevanti per la crescita — temperatura, umidità, qualità dell'aria/CO₂ e luminosità — permettendo di seguire l'andamento della coltivazione e individuare rapidamente condizioni non ottimali. I dati sono accessibili in diversi modi — tramite **Bluetooth**, **Wi-Fi** o un **bot Telegram** — a seconda di come si sceglie di configurare la scheda: sono esempi di implementazione, ognuno può adattare il sistema alle proprie esigenze.

Il contenitore di riferimento è il barattolo **[IKEA EKLATANT](https://www.ikea.com/it/it/p/eklatant-contenitore-con-coperchio-vetro-trasparente-bambu-50621766/)** — una scelta in pieno spirito **IKEA hack**, pratica ben radicata nella cultura maker: prendere oggetti di uso comune, economici e facilmente reperibili, e trasformarli in qualcosa di completamente nuovo. I componenti stampati in 3D (supporti, staffe, distanziali e accessori) sono progettati per adattarsi a diversi modelli del catalogo IKEA, senza bisogno di adattamenti custom. Tutta l'elettronica è composta da componenti **economici e facilmente reperibili online**, con lista materiali e link inclusi nella repository: il costo complessivo per replicare il progetto è volutamente contenuto, per renderlo accessibile a chiunque voglia cimentarsi.

Codice, istruzioni di montaggio e configurazione sono disponibili pubblicamente su **[GitHub](https://github.com/mferrantini/vasovivo)**, aperti ai contributi della community. Il sito del progetto, pubblicato come GitHub Pages, offre una panoramica del progetto e l'elenco dei sensori supportati.

---

## I sensori

VasoVivo supporta diversi sensori per monitorare aria, substrato e luminosità. Per ciascuno, nella cartella [`sensors/`](../sensors/) della repository, sono disponibili documentazione (pinout, librerie, note di utilizzo) e uno sketch di esempio per ESP32.

| Sensore | Parametri | Utilizzo |
|---|---|---|
| **ENS160 + AHT21** | CO₂eq, TVOC, temperatura, umidità aria | Modulo combinato per qualità dell'aria e condizioni ambientali nel barattolo |
| **DHT22** | Temperatura, umidità aria | Alternativa consigliata per dati ambientali più affidabili |
| **DHT11** | Temperatura, umidità aria | Alternativa economica, adatta a un primo approccio |
| **Sensore a forchetta** | Umidità substrato | Verifica se la zolletta è troppo secca o troppo bagnata |
| **DS18B20** | Temperatura substrato | Sonda impermeabile per la temperatura interna al substrato |
| **Fotoresistenza (LDR)** | Luminosità | Rileva l'esposizione alla luce e la correlazione con la crescita |

---

## Le specie coltivate

La varietà più adatta per questo formato di coltivazione è il **Pioppino** (*Cyclocybe aegerita*): fungo commestibile molto apprezzato in cucina, dal sapore deciso e dalla consistenza soda che lo rende ottimo sia saltato in padella che conservato sott'olio. È una specie tipica della tradizione italiana, dove cresce naturalmente alla base dei pioppi. Le sue dimensioni contenute lo rendono **ideale per la coltivazione in barattolo**, dove può svilupparsi senza difficoltà all'interno del contenitore. Dopo la prima raccolta, la zolletta può essere riutilizzata per successive coltivazioni.

Altre specie coltivabili con substrato in zolletta sono il **Pleurotus ostreatus** (fungo ostrica) e il **Pleurotus cornucopiae**, entrambe commestibili e molto diffuse in cucina. Tuttavia, per questo formato **non sono la scelta ideale**: tendono a sviluppare corpi fruttiferi di dimensioni considerevoli, che in un contenitore chiuso come un barattolo potrebbero risultare troppo ingombranti e limitare la crescita. Rimangono comunque specie da considerare per chi volesse sperimentare con contenitori più grandi.

---

## Cosa trovi allo stand

Allo stand della Maker Faire puoi vedere **VasoVivo** in funzione: più contenitori con coltivazioni attive, i funghi in crescita e tutti i sensori al lavoro. Un **display** mostra i dati ambientali in tempo reale — temperatura, umidità, CO₂, luminosità — di ciascun contenitore, così come vengono registrati dal sistema durante tutta la coltivazione.

Accanto ai prototipi, trovi la **documentazione del progetto** e un **QR code** che rimanda al sito e alla repository GitHub, dove sono disponibili tutti i file per replicarlo: schema elettrico, file per la stampa 3D, codice sorgente, guida al montaggio e gli esempi di codice per ogni sensore.
