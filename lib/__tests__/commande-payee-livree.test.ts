import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

/*
  2026-09-13 — trois façons, sur Launch, qu'un paiement encaissé ne donne pas
  ce qu'il a acheté.

  1. Le client recevait un site qu'il n'avait JAMAIS VU.

     Le parcours réel est /preview → /order → /onboarding → /api/checkout. Ce
     dernier fabriquait TOUJOURS un `briefId` et le posait TOUJOURS dans les
     métadonnées Stripe, que le brief ait été écrit ou non. Or le webhook teste
     `if (meta.sessionId && !meta.briefId)` pour livrer l'aperçu approuvé : la
     condition était donc systématiquement fausse. Ce chemin n'a jamais été
     emprunté. Toute commande repartait sur une génération neuve, et le site
     livré n'était pas celui que le client avait validé.

  2. Même corrigé, une commande portant à la fois un aperçu approuvé ET un
     brief laissait le chemin brief l'emporter — donc créait une seconde
     session et livrait, là encore, autre chose que l'aperçu approuvé.

  3. La réservation d'idempotence était posée AVANT le traitement et jamais
     libérée. Un échec passager condamnait la commande deux fois : le
     traitement n'aboutissait pas, et le rejeu de Stripe ressortait en
     « duplicate » sans rien faire. Le client avait payé, et plus aucun chemin
     automatique ne pouvait le servir.
*/

const RACINE = join(__dirname, '..', '..');
const CHECKOUT = readFileSync(join(RACINE, 'app', 'api', 'checkout', 'route.ts'), 'utf8');
const WEBHOOK = readFileSync(join(RACINE, 'app', 'api', 'webhook', 'route.ts'), 'utf8');

describe('Une commande payée reçoit ce qu’elle a acheté', () => {
  describe('le briefId', () => {
    it('n’entre dans les métadonnées que si un brief a vraiment été écrit', () => {
      expect(CHECKOUT).toContain('...(briefEcrit ? { briefId } : {})');
    });

    it('n’est plus posé inconditionnellement', () => {
      const bloc = CHECKOUT.slice(CHECKOUT.indexOf('metadata: {'));
      const corps = bloc.slice(0, bloc.indexOf('},'));
      // « briefId, » tout court = l'ancienne forme, celle qui condamnait le
      // chemin « livrer l'aperçu approuvé ».
      expect(corps).not.toMatch(/^\s*briefId,\s*$/m);
    });

    it('briefEcrit ne passe à vrai qu’APRÈS une écriture réussie', () => {
      const bloc = CHECKOUT.slice(CHECKOUT.indexOf('let briefEcrit = false'));
      const posePut = bloc.indexOf('await put(`briefs/');
      const poseVrai = bloc.indexOf('briefEcrit = true');
      expect(posePut).toBeGreaterThan(-1);
      expect(poseVrai).toBeGreaterThan(posePut);
      // Et dans le try, pas après le catch : un envoi raté ne compte pas.
      expect(bloc.slice(posePut, poseVrai)).not.toContain('catch');
    });
  });

  describe('la priorité de livraison', () => {
    it('un aperçu approuvé prime sur toute génération neuve', () => {
      expect(WEBHOOK).toContain('const apercuApprouve');
      expect(WEBHOOK).toContain('if (apercuApprouve) {');
    });

    it('ne conditionne plus la livraison de l’aperçu à l’absence de briefId', () => {
      expect(WEBHOOK).not.toContain('if (meta.sessionId && !meta.briefId)');
    });
  });

  describe('l’idempotence', () => {
    it('libère la réservation quand le traitement échoue', () => {
      expect(WEBHOOK).toContain('async function libererEvent');
      expect(WEBHOOK).toContain('await libererEvent(event.id)');
    });

    it('libère AVANT de rendre la main, dans le bloc d’erreur', () => {
      const bloc = WEBHOOK.slice(WEBHOOK.lastIndexOf('} catch (err) {'));
      const liberation = bloc.indexOf('libererEvent');
      const retour = bloc.indexOf('return NextResponse');
      expect(liberation).toBeGreaterThan(-1);
      expect(liberation).toBeLessThan(retour === -1 ? Number.MAX_SAFE_INTEGER : retour);
    });

    it('la réservation reste fail-open : une panne du stockage ne bloque pas un paiement valide', () => {
      const bloc = WEBHOOK.slice(WEBHOOK.indexOf('async function tryReserveEvent'));
      expect(bloc.slice(0, bloc.indexOf('\n}'))).toContain('return true; // fail-open');
    });
  });
});
