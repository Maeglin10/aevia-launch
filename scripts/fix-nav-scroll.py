#!/usr/bin/env python3
"""
Auto-fix nav scroll for all visible impact templates.
Converts dead href="#" links to scrollIntoView buttons with matching section IDs.
"""
import re, os, unicodedata

def slugify(text):
    """Convert French text to URL slug."""
    text = unicodedata.normalize('NFKD', text)
    text = ''.join(c for c in text if not unicodedata.combining(c))
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text.strip())
    text = re.sub(r'-+', '-', text)
    return text

def find_section_for_nav_item(content, label):
    """Find which section index best matches a nav label."""
    slug = slugify(label)
    label_lower = label.lower()
    
    # Keyword mapping for common French nav items
    KEYWORD_MAP = {
        'formations': ['formations', 'tarifs', 'formules', 'cours', 'apprentissage', 'stage'],
        'location': ['location', 'flotte', 'bateaux', 'activites', 'aventure'],
        'croisières': ['croisieres', 'croisiere', 'voyage', 'navigation', 'activites'],
        'bases': ['bases', 'locations', 'activites'],
        'contact': ['contact', 'contacter', 'réserver', 'reserver', 'nous rejoindre', 'inscription'],
        'services': ['services', 'prestations', 'offres', 'solutions', 'produits'],
        'about': ['about', 'propos', 'histoire', 'equipe', 'studio', 'atelier'],
        'work': ['work', 'projets', 'portfolio', 'realisations', 'collections'],
        'pricing': ['pricing', 'tarifs', 'prix', 'plans', 'formules'],
        'solutions': ['solutions', 'produits', 'offres', 'services'],
        'soc': ['soc', 'securite', 'conformite', 'protection'],
        'conformité': ['conformite', 'rgpd', 'compliance'],
        'tarifs': ['tarifs', 'prix', 'formules', 'plans'],
        'portfolio': ['portfolio', 'projets', 'travaux', 'realisations'],
        'galerie': ['galerie', 'photos', 'images', 'collections'],
        'restaurant': ['restaurant', 'cuisine', 'menu', 'gastronomie'],
        'menu': ['menu', 'carte', 'plats', 'gastronomie'],
        'réservation': ['reservation', 'reserver', 'contact'],
        'expositions': ['expositions', 'gallery', 'galerie', 'oeuvres'],
        'boutique': ['boutique', 'shop', 'produits', 'collection'],
        'actualités': ['actualites', 'news', 'blog', 'articles'],
        'expertise': ['expertise', 'competences', 'savoir-faire', 'services'],
        'equipe': ['equipe', 'team', 'membres', 'nous'],
        'témoignages': ['temoignages', 'avis', 'clients', 'reviews'],
    }
    
    keywords = KEYWORD_MAP.get(slug, [slug, label_lower])
    # Add the slugified version and partial matches
    keywords.extend([label_lower, slug])
    
    return keywords

def get_section_content_labels(content):
    """Extract section labels (first text content) from a file."""
    sections = []
    lines = content.split('\n')
    in_section = False
    section_start_line = 0
    
    for i, line in enumerate(lines):
        if re.search(r'<section[\s>]', line):
            section_start_line = i
            # Get the section tag
            tag_end = content.index('>', content.index('<section', sum(len(l)+1 for l in lines[:i])))
            
            # Look for first significant text in the next 80 lines
            text = ''
            for j in range(i+1, min(i+80, len(lines))):
                m = re.search(r'>([A-ZÀ-Öa-zà-ö][^<]{2,60})<', lines[j])
                if m:
                    text = m.group(1).strip()
                    break
            
            sections.append({
                'line': i,
                'text': text,
                'slug': slugify(text),
            })
    
    return sections

def get_nav_items(content):
    """Extract nav items (label → ID) from content."""
    nav_items = []
    
    # Pattern 1: const links = ["Item1", "Item2", ...]
    m = re.search(r'const links\s*=\s*\[(.*?)\]', content, re.DOTALL)
    if m:
        items = re.findall(r'"([^"]+)"', m.group(1))
        # Filter out non-nav items (long text = not nav labels)
        items = [i for i in items if len(i) < 40]
        nav_items = [{'label': i, 'id': slugify(i)} for i in items]
        return nav_items, 'links'
    
    # Pattern 2: const NAV_LINKS = [{ label: "...", href: "..." }, ...]
    m = re.search(r'const NAV_LINKS\s*=\s*\[(.*?)\]', content, re.DOTALL)
    if m:
        pairs = re.findall(r'label:\s*"([^"]+)".*?href:\s*"(#[^"]*)"', m.group(1), re.DOTALL)
        nav_items = [{'label': l, 'id': h[1:] if h != '#' else slugify(l)} for l, h in pairs]
        return nav_items, 'NAV_LINKS'
    
    return [], None

TEMPLATES = [
  "impact-12","impact-13","impact-15","impact-18","impact-19",
  "impact-26","impact-27","impact-28","impact-30","impact-31",
  "impact-32","impact-33","impact-34","impact-43","impact-44","impact-49",
  "impact-57","impact-58","impact-61","impact-63","impact-64",
  "impact-81","impact-82","impact-84","impact-85","impact-86",
  "impact-88","impact-90","impact-94","impact-96",
  "impact-115","impact-130","impact-133","impact-134","impact-135",
  "impact-157","impact-158",
  "impact-161","impact-162","impact-163","impact-165","impact-166",
  "impact-167","impact-168","impact-169","impact-171","impact-172",
  "impact-173","impact-174","impact-175","impact-176",
  "impact-196","impact-197","impact-198","impact-199","impact-200","impact-201",
]

for t_id in TEMPLATES:
    path = f"app/templates/{t_id}/page.tsx"
    if not os.path.exists(path):
        continue
    
    with open(path) as f:
        content = f.read()
    
    nav_items, nav_type = get_nav_items(content)
    
    print(f"{t_id}: nav_type={nav_type}, items={[n['label'] for n in nav_items[:5]]}")

