import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { aJetonEdition } from '../sessions';

/*
  2026-09-13 — la génération effaçait le contrôle d'écriture de la session.

  `POST /api/sessions` frappe un jeton d'édition et n'en stocke que le hash.
  `POST /api/generate` reconstruisait ensuite l'objet session champ par champ,
  puis l'écrivait dans le Blob en ÉCRASEMENT COMPLET. Tout champ non recopié
  disparaissait donc — et `editTokenHash` n'était pas recopié.

  Après génération, `aJetonEdition()` valait false : PATCH cessait d'exiger
  quoi que ce soit. Quiconque possédait le lien d'aperçu — transféré par
  e-mail, montré au comptoir, relayé dans une conversation — pouvait réécrire
  le site du client. `sectionOverrides` disparaissait au passage, effaçant les
  retouches déjà faites.

  `businessProfile` avait déjà subi exactement le même sort avant d'être
  rajouté à la main : c'est la forme « reconstruction » qui est fautive, pas
  l'oubli d'un champ en particulier.
*/

const ROUTE = readFileSync(join(__dirname, '..', '..', 'app', 'api', 'generate', 'route.ts'), 'utf8');

describe('La génération ne doit rien effacer de la session', () => {
  it('construit la session par FUSION de l’existante', () => {
    // La seule forme qui ne se dégrade pas à chaque ajout au modèle.
    expect(ROUTE).toMatch(/const sessionData = \{\s*\n\s*\.\.\.\(existing \?\? \{\}\)/);
  });

  it('n’énumère plus les champs à préserver un par un', () => {
    /* Si quelqu'un revient à une reconstruction explicite, ce test tombe :
       c'est exactement le geste qui a coûté `businessProfile` puis
       `editTokenHash`. */
    const bloc = ROUTE.slice(ROUTE.indexOf('const sessionData = {'));
    const corps = bloc.slice(0, bloc.indexOf('};'));
    expect(corps).toContain('...(existing');
  });

  it('un jeton d’édition survit à une fusion', () => {
    const avant = {
      id: 's1',
      editTokenHash: 'abc123',
      sectionOverrides: { hero: { title: 'Retouché' } },
      createdAt: new Date(),
    } as never;

    // Ce que fait désormais la route : fusion, puis réécriture des champs générés.
    const apres = { ...(avant as object), id: 's1', generatedContent: {} } as never;

    expect(aJetonEdition(apres)).toBe(true);
    expect((apres as { sectionOverrides?: unknown }).sectionOverrides).toBeDefined();
  });

  it('une reconstruction champ par champ perdrait le jeton — la preuve du défaut', () => {
    const avant = { id: 's1', editTokenHash: 'abc123', createdAt: new Date() } as never;

    // L'ancienne forme, reproduite à l'identique.
    const ancienne = {
      id: 's1',
      formData: {},
      generatedContent: {},
      createdAt: (avant as { createdAt: Date }).createdAt,
    } as never;

    expect(aJetonEdition(ancienne)).toBe(false);
  });

  it('aJetonEdition accepte aussi l’ancien jeton en clair', () => {
    // Les sessions d'avant le hachage ne doivent pas perdre leur protection.
    expect(aJetonEdition({ id: 's', editToken: 'clair' } as never)).toBe(true);
    expect(aJetonEdition({ id: 's' } as never)).toBe(false);
  });
});
