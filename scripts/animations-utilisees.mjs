/*
  Quelle animation chaque thème récent utilise-t-il vraiment ?

  Les kits offrent une trentaine de figures — WordFlight, LineMask, PortalZoom,
  MosaicPush… Si les thèmes se ressemblent, c'est peut-être qu'ils piochent
  tous dans les deux ou trois mêmes.
*/
import fs from "node:fs";
const KIT = [
  ...["AnchoredBackdrop","WordFlight","LineMask","GhostSolid","BlurThrough","HeldSwap","BentoCascade","ExpandFrame","Retint","CircularLabel"],
  ...["PortalZoom","HardCutRebuild","CrossPush","MosaicPush","TrackingCollapse","PanelDrop","PanelRise","ScrollGrow","DifferentialExit","StickyProgress","LineScroll","FixedRail","CrossFigure","ComposeIn","WipeReveal","DriftShadow","ArcSwap","PushBlur","ScrollSpin","InvertSweep","ParticleOrb"],
];
const num = (t) => Number(t.slice(7));
const themes = fs.readdirSync("app/templates").filter((d) => /^impact-\d+$/.test(d)).sort((a,b)=>num(a)-num(b));

const parTheme = {}, compte = {};
for (const t of themes) {
  const p = `app/templates/${t}/page.tsx`;
  if (!fs.existsSync(p)) continue;
  const s = fs.readFileSync(p, "utf8");
  /* Utilisée = employée en JSX, pas seulement importée. */
  const vues = KIT.filter((k) => new RegExp(`<${k}[\\s/>]`).test(s));
  parTheme[t] = vues;
  if (num(t) >= 328) for (const v of vues) compte[v] = (compte[v] ?? 0) + 1;
}
const recents = themes.filter((t) => num(t) >= 328);
console.log(`figures employées par les ${recents.length} thèmes ≥328 :\n`);
for (const [k, n] of Object.entries(compte).sort((a,b)=>b[1]-a[1]))
  console.log(`  ${k.padEnd(20)} ${String(n).padStart(2)} thèmes  ${(n/recents.length*100).toFixed(0)}%`);
const sansAucune = recents.filter((t) => (parTheme[t] ?? []).length === 0);
console.log(`\n${sansAucune.length} thèmes récents n'emploient aucune figure du kit : ${sansAucune.map(t=>t.slice(7)).join(", ")}`);
const moy = (recents.reduce((s,t)=>s+(parTheme[t]??[]).length,0)/recents.length).toFixed(1);
console.log(`moyenne : ${moy} figures par thème récent`);
fs.writeFileSync("/tmp/animations.json", JSON.stringify(parTheme, null, 1));
