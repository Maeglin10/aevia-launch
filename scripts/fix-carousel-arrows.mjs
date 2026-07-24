/**
 * fix-carousel-arrows.mjs — batch fix for the missing-closing-div bug in the
 * shared scroll-scrubbed carousel component (impact-217..291 series).
 *
 * Root cause: the "Dots de progression" flex container (position:absolute,
 * left:50%, transform:translateX(-50%) — self-centering, shrink-to-fit width)
 * is never closed before the prev/next nav buttons, so the buttons inherit
 * its narrow centered box as their containing block instead of the full-width
 * carousel section — collapsing both arrows near screen-center, overlapping.
 *
 * Fix: close the dots div right after its .map(), and drop the now-redundant
 * trailing </div>. Only applied when both anchor patterns are found EXACTLY
 * once per file — never a blind global replace.
 *
 * Usage: node scripts/fix-carousel-arrows.mjs 218,237,238,...
 */
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ids = process.argv[2].split(',').map((n) => `impact-${n.trim()}`);

const HEAD_FIND = `          ))}
        {/* Carousel navigation */}
        <button
          onClick={() => goTo((active - 1 + n) % n)}`;
const HEAD_REPLACE = `          ))}
        </div>
        {/* Carousel navigation */}
        <button
          onClick={() => goTo((active - 1 + n) % n)}`;

const TAIL_FIND = `        </div>
        </div>
      </div>
    </section>`;
const TAIL_REPLACE = `        </div>
      </div>
    </section>`;

function countOccurrences(str, sub) {
  let count = 0, i = 0;
  while ((i = str.indexOf(sub, i)) !== -1) { count++; i += sub.length; }
  return count;
}

async function fixOne(id) {
  const file = path.join(__dirname, '..', 'app', 'templates', id, 'page.tsx');
  let src;
  try {
    src = await fs.readFile(file, 'utf8');
  } catch (e) {
    return { id, status: 'no-file' };
  }

  const headCount = countOccurrences(src, HEAD_FIND);
  const tailCount = countOccurrences(src, TAIL_FIND);

  if (headCount === 0) return { id, status: 'head-not-found' };
  if (headCount > 1) return { id, status: `head-ambiguous(${headCount})` };
  if (tailCount === 0) return { id, status: 'tail-not-found' };
  if (tailCount > 1) return { id, status: `tail-ambiguous(${tailCount})` };

  const fixed = src.replace(HEAD_FIND, HEAD_REPLACE).replace(TAIL_FIND, TAIL_REPLACE);
  await fs.writeFile(file, fixed, 'utf8');
  return { id, status: 'fixed' };
}

async function main() {
  const results = [];
  for (const id of ids) {
    results.push(await fixOne(id));
  }
  for (const r of results) console.log(`${r.id}: ${r.status}`);
  const fixed = results.filter((r) => r.status === 'fixed').length;
  const skipped = results.filter((r) => r.status !== 'fixed');
  console.log(`\n${fixed}/${results.length} fixed`);
  if (skipped.length) {
    console.log('SKIPPED (need manual review):');
    skipped.forEach((r) => console.log(`  ${r.id}: ${r.status}`));
  }
}

main();
