#!/usr/bin/env python3
"""
Auto-fix nav scroll + section IDs for impact templates.
Handles templates where nav items are inline arrays in JSX.
"""
import re, os, unicodedata, sys

def slugify(text):
    text = unicodedata.normalize('NFKD', text)
    text = ''.join(c for c in text if not unicodedata.combining(c))
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text.strip())
    return re.sub(r'-+', '-', text) or 'section'

# Templates where nav items are inline arrays: ["Work", "Studio", ...]
# Format: (template_id, [(nav_label, section_id), ...], nav_patterns_to_find)
INLINE_NAV_MAP = {
    # impact-57: MASK_UNIT creative studio
    "impact-57": {
        "nav_inline": ["Work", "Studio", "Services", "Contact"],
        "section_ids": ["work", "studio", "services", "contact"],
    },
    # impact-58: 
    "impact-58": None,  # will detect
    # impact-81: VOGUE NOIRE editorial magazine  
    "impact-81": {
        "nav_inline": ["Éditorial", "Collections", "Archives"],
        "nav_inline2": ["Boutique", "Abonnement"],
        "section_ids": ["editorial", "collections", "archives"],
    },
    # impact-82:
    "impact-82": None,
    # impact-84:
    "impact-84": None,
    # impact-85:
    "impact-85": None,
    # impact-86:
    "impact-86": None,
}

def get_inline_nav(content):
    """Find inline nav arrays like ["Work", "Studio", "Services"]."""
    # Look for .map( patterns with string arrays near href="#"
    # Find: ["Item1", "Item2", ...].map(...)
    patterns = re.findall(
        r'\[([^\]]{5,200})\]\.map\([^)]*\)\s*=>\s*[(\n]*\s*<(?:motion\.a|a|Link|motion\.button)',
        content
    )
    
    results = []
    for p in patterns:
        items = re.findall(r'"([^"]{1,40})"', p)
        if len(items) >= 2:
            results.append(items)
    
    return results

def fix_template_nav(template_id, content):
    """Fix nav + section IDs for a single template."""
    modified = False
    
    # Get inline nav arrays
    inline_navs = get_inline_nav(content)
    
    if not inline_navs:
        return content, False
    
    print(f"  {template_id}: Found {len(inline_navs)} nav arrays: {[n[:3] for n in inline_navs]}")
    
    for nav_items in inline_navs:
        if len(nav_items) < 2 or len(nav_items) > 8:
            continue
        
        # Build ID mapping
        id_map = {item: slugify(item) for item in nav_items}
        
        # Find sections in the file (excluding hero which is first)
        # Get all <section elements in order
        section_positions = [m.start() for m in re.finditer(r'<section[\s>]', content)]
        
        if len(section_positions) < 2:
            continue
        
        # Skip the first section (hero)
        target_sections = section_positions[1:len(nav_items)+1]
        
        # Add IDs to sections that don't have one
        for i, (item, pos) in enumerate(zip(nav_items, target_sections)):
            sec_id = id_map[item]
            # Find the section tag
            tag_end = content.find('>', pos)
            old_tag = content[pos:tag_end+1]
            
            if 'id=' not in old_tag:
                new_tag = old_tag[:8] + f' id="{sec_id}"' + old_tag[8:]
                content = content[:pos] + new_tag + content[tag_end+1:]
                modified = True
                # Adjust positions after insertion
                offset = len(new_tag) - len(old_tag)
                target_sections = [p + offset if p > pos else p for p in target_sections]
        
        # Convert motion.a href="#" to button with scrollIntoView for this nav
        # Pattern: the array literal + .map(item => <motion.a href="#"...>{item}</motion.a>)
        items_pattern = '|'.join(re.escape(i) for i in nav_items)
        
        # Replace: <motion.a key={item} href="#" ... > {item} </motion.a>
        # With: <button onClick={() => document.getElementById(slugMap[item])?.scrollIntoView...}>
        
        # Build a slug map as a JS expression
        slug_entries = ', '.join(f'"{i}": "{slugify(i)}"' for i in nav_items)
        
        # Pattern to match the map callback
        def replace_motion_a(m):
            full = m.group(0)
            # Replace href="#" with onClick and motion.a with button
            full = re.sub(r'href="#"', 
                f'onClick={{() => document.getElementById({{[{slug_entries}][item]}} ?? "{slugify(nav_items[0])}")?.scrollIntoView({{behavior:"smooth"}})}}',
                full)
            return full
        
        # Simpler approach: just replace the specific pattern
        for item in nav_items:
            sec_id = slugify(item)
            # Replace motion.a with specific item
            content = re.sub(
                r'<motion\.a\s+key=\{item\}\s+href="#"',
                f'<motion.button key={{item}} onClick={{() => document.getElementById(nav_id_map[item])?.scrollIntoView({{behavior:"smooth"}})}}',
                content
            )
        
        break  # Process first nav array for now
    
    return content, modified

# Actually let's use a simpler, more targeted approach per template
def fix_inline_nav_simple(content, nav_items, section_ids):
    """Simple fix: convert motion.a href="#" for nav items to buttons."""
    modified = False
    
    # Find all <section elements
    section_positions = [m.start() for m in re.finditer(r'<section[\s>]', content)]
    
    if len(section_positions) < len(section_ids):
        print(f"  WARNING: Only {len(section_positions)} sections for {len(section_ids)} nav items")
    
    # Add IDs to sections (skip hero at index 0)
    for i, sec_id in enumerate(section_ids):
        section_idx = i + 1  # skip hero
        if section_idx >= len(section_positions):
            break
        
        pos = section_positions[section_idx]
        tag_end = content.find('>', pos)
        old_tag = content[pos:tag_end+1]
        
        if f'id="{sec_id}"' not in old_tag and 'id=' not in old_tag:
            new_tag = old_tag[:8] + f' id="{sec_id}"' + old_tag[8:]
            content = content[:pos] + new_tag + content[tag_end+1:]
            modified = True
            # Recalculate positions
            section_positions = [m.start() for m in re.finditer(r'<section[\s>]', content)]
    
    # Convert href="#" to scrollIntoView for the nav items
    # Build the array literal that appears in .map()
    array_str = '[' + ', '.join(f'"{item}"' for item in nav_items) + ']'
    
    if array_str not in content:
        return content, modified
    
    # Find the .map callback and replace motion.a/a with button
    # Replace: motion.a key={item} href="#"
    new_content = content
    new_content = re.sub(
        r'(<motion\.a)(\s+key=\{(?:item|l|link|nav|n)\})\s+href="#"',
        r'<motion.button\2 onClick={() => { const ids = ' + str({item: slugify(item) for item in nav_items}) + "; const id = ids[item] || ids[l] || ''; document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); }}",
        new_content
    )
    
    if new_content != content:
        # Close tags
        new_content = re.sub(r'</motion\.a>', '</motion.button>', new_content)
        modified = True
        content = new_content
    
    return content, modified

if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else None
    
    for t_id, cfg in INLINE_NAV_MAP.items():
        if target and t_id != target:
            continue
        if cfg is None:
            continue
        
        path = f"app/templates/{t_id}/page.tsx"
        if not os.path.exists(path):
            continue
        
        with open(path) as f:
            content = f.read()
        
        nav_items = cfg.get('nav_inline', [])
        section_ids = cfg.get('section_ids', [])
        
        print(f"\n{t_id}: {nav_items} → {section_ids}")
        
        content, modified = fix_inline_nav_simple(content, nav_items, section_ids)
        
        if modified:
            with open(path, 'w') as f:
                f.write(content)
            print(f"  ✅ Modified")
        else:
            print(f"  ⏭ No changes")

