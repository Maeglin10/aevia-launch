import os
import re
import sys

# The global declarations to insert before the default export
GLOBALS_DECLARATION = """
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
"""

# The session state block to inject at the top of the default export component function
SESSION_HOOK_BLOCK = """
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color
"""

def parse_registry_names():
    if not os.path.exists('lib/templates/registry.ts'):
        return {}
    content = open('lib/templates/registry.ts', 'r', encoding='utf-8').read()
    pattern = re.compile(r'id:\s*["\'](impact-\d+)["\'],\s*name:\s*(["\'])(.*?)\2')
    return {m.group(1): m.group(3) for m in pattern.finditer(content)}

def parse_city_labels():
    if not os.path.exists('lib/templates/sectors.ts'):
        return {}
    content = open('lib/templates/sectors.ts', 'r', encoding='utf-8').read()
    pattern_double = re.compile(r'["\'](impact-\d+)["\']\s*:\s*"([^"]+)"')
    pattern_single = re.compile(r'["\'](impact-\d+)["\']\s*:\s*\'([^\']+)\'')
    
    mapping = {}
    for m in pattern_double.finditer(content):
        val = m.group(2)
        if ' · ' in val:
            name, city = val.split(' · ', 1)
            mapping[m.group(1)] = (name.strip(), city.strip())
        else:
            mapping[m.group(1)] = (val.strip(), None)
            
    for m in pattern_single.finditer(content):
        val = m.group(2)
        if ' · ' in val:
            name, city = val.split(' · ', 1)
            mapping[m.group(1)] = (name.strip(), city.strip())
        else:
            mapping[m.group(1)] = (val.strip(), None)
            
    return mapping

def ensure_react_imports(content):
    react_import_regex = r'import\s+(React\s*,\s*)?\{([^}]+)\}\s+from\s+[\'"]react[\'"]'
    match = re.search(react_import_regex, content)
    if match:
        imports = [x.strip() for x in match.group(2).split(',')]
        modified = False
        for required in ['useState', 'useEffect', 'useRef']:
            if required not in imports:
                imports.append(required)
                modified = True
        if modified:
            new_import_str = f"import {match.group(1) or ''}{{{', '.join(imports)}}} from 'react'"
            content = content[:match.start()] + new_import_str + content[match.end():]
    else:
        if 'import React' not in content:
            content = "import React, { useState, useEffect, useRef } from 'react';\n" + content
    return content

def get_name_variations(name):
    base_name = name
    for suffix in [" Restaurant", " SaaS", " Agency", " Studio", " Platform", " Clinic", " Portfolio", " Dentist", " Lawyer", " Kiné"]:
        if name.endswith(suffix):
            base_name = name[:-len(suffix)].strip()
            break
    variations = [name, base_name]
    all_vars = set()
    for v in variations:
        all_vars.add(v)
        all_vars.add(v.replace("'", "&apos;"))
        all_vars.add(v.replace("'", "\\'"))
        all_vars.add(v.replace("'", "’"))
    return sorted(list(all_vars), key=len, reverse=True)

def find_primary_accent_color(content):
    hex_pattern = re.compile(r'#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b')
    colors = set(hex_pattern.findall(content))
    exclude = {
        'fff', 'ffffff', '000', '000000', '0a0a0a', '0d0d0d', '111', '111111', 
        '1a1a1a', '181818', '242424', '1c1c1e', 'f3f4f6', 'f9fafb', 'fafafa',
        'f5efe6', 'ede5d4', 'faf7f0', 'f5f0e6', '2c1810', '09090b', '0e0e10',
        '121212', '1f1f1f', 'f0f0f0', 'e5e7eb', 'd1d5db', '9ca3af', '6b7280',
        '4b5563', '374151', '222', '333', '444', '555', '666', '777', '888',
        '999', 'aaa', 'bbb', 'ccc', 'ddd', 'eee'
    }
    accent_colors = []
    for c in colors:
        c_lower = c.lower()
        if c_lower not in exclude:
            accent_colors.append('#' + c_lower)
    if accent_colors:
        accent_colors.sort(key=lambda x: content.count(x), reverse=True)
        return accent_colors[0]
    return None

def find_matching_brace(content, start_idx):
    brace_count = 1
    char_idx = start_idx
    while char_idx < len(content) and brace_count > 0:
        if content[char_idx] == '{':
            brace_count += 1
        elif content[char_idx] == '}':
            brace_count -= 1
            if brace_count == 0:
                return char_idx
        char_idx += 1
    return -1

def find_return_blocks_in_range(content, start_range, end_range):
    blocks = []
    for match in re.finditer(r'return\s*\(', content):
        idx = match.start()
        if idx < start_range or idx > end_range:
            continue
        paren_count = 0
        char_idx = match.end() - 1
        while char_idx < len(content):
            if content[char_idx] == '(':
                paren_count += 1
            elif content[char_idx] == ')':
                paren_count -= 1
                if paren_count == 0:
                    blocks.append((idx, char_idx + 1))
                    break
            char_idx += 1
    return blocks

def filter_outer_blocks(blocks):
    outer = []
    for b in blocks:
        is_nested = False
        for other in blocks:
            if other != b and other[0] < b[0] and other[1] > b[1]:
                is_nested = True
                break
        if not is_nested:
            outer.append(b)
    return outer

def replace_brand_color(content, accent_hex):
    if not accent_hex:
        return content
    accent_escaped = re.escape(accent_hex)
    
    pattern = re.compile(rf'style=\{{{{\s*([^}}]*?)(background|color|borderColor|border|outline|fill|stroke)\s*:\s*["\']{accent_escaped}["\']([^}}]*?)\}}}}', re.IGNORECASE | re.DOTALL)
    def repl(m):
        prop = m.group(2)
        before = m.group(1)
        after = m.group(3)
        return f"style={{{{{before}{prop}: brand ?? '{accent_hex}'{after}}}}}"
    content = pattern.sub(repl, content)
    
    const_pattern = re.compile(rf'const\s+(\w+)\s*=\s*["\']{accent_escaped}["\']', re.IGNORECASE)
    content = const_pattern.sub(rf"const \1 = brand ?? '{accent_hex}'", content)
    
    c_pattern = re.compile(rf'(\bprimary\b|\baccent\b|\baccentColor\b)\s*:\s*["\']{accent_escaped}["\']', re.IGNORECASE)
    content = c_pattern.sub(rf"\1: brand ?? '{accent_hex}'", content)
    
    return content

def replace_contact_info(content, default_city="Paris"):
    content = re.sub(r'href=["\']mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})["\']',
                     r'href={`mailto:${fd?.email ?? "\1"}`}', content)
    content = re.sub(r'>\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})\s*<',
                     r'>{fd?.email ?? "\1"}<', content)
                     
    content = re.sub(r'href=["\']tel:([^"\']+)["\']',
                     r'href={`tel:${fd?.phone ?? "\1"}`}', content)
    
    content = re.sub(r'href=["\']https?://(?:www\.)?linkedin\.com/in/([^"\']+)["\']',
                     r'href={`https://linkedin.com/in/${fd?.linkedin ?? "\1"}`}', content)
    content = re.sub(r'href=["\']https?://(?:www\.)?instagram\.com/([^"\']+)["\']',
                     r'href={`https://instagram.com/${fd?.instagram ?? "\1"}`}', content)
                     
    return content

def find_component_decl(content):
    # Try pattern 1: export default function Name() ... {
    pat1 = re.compile(r'export\s+default\s+function\s+(\w+)\s*\(([^)]*)\)(?:\s*:\s*[^{]+)?\s*\{')
    m1 = pat1.search(content)
    if m1:
        return m1.start(), m1.end(), m1.group(1)
        
    # Try pattern 2: export default Name;
    pat2 = re.compile(r'export\s+default\s+(\w+)\s*;')
    m2 = pat2.search(content)
    if m2:
        comp_name = m2.group(1)
        # Search for: function Name(
        pat_func = re.compile(r'function\s+' + re.escape(comp_name) + r'\s*\(([^)]*)\)(?:\s*:\s*[^{]+)?\s*\{')
        mf = pat_func.search(content)
        if mf:
            return mf.start(), mf.end(), comp_name
            
        # Search for: const Name = (
        pat_const = re.compile(r'const\s+' + re.escape(comp_name) + r'\s*=\s*\(([^)]*)\)(?:\s*:\s*[^{]+)?\s*=>\s*\{')
        mc = pat_const.search(content)
        if mc:
            return mc.start(), mc.end(), comp_name
            
    return None

def process_file(tpl_id, registry_name, city_info):
    file_path = f'app/templates/{tpl_id}/page.tsx'
    if not os.path.exists(file_path):
        return False
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    content = ensure_react_imports(content)
    
    decl = find_component_decl(content)
    if not decl:
        print(f"Warning: component declaration not found in {tpl_id}")
        return False
        
    func_decl_idx, func_start, comp_name = decl
    
    if 'let fd: any = null;' in content:
        print(f"Skipping {tpl_id}: already has global declarations")
        return False
        
    content_with_globals = content[:func_decl_idx] + GLOBALS_DECLARATION + content[func_decl_idx:]
    
    new_func_start = func_start + len(GLOBALS_DECLARATION)
    new_func_end = find_matching_brace(content_with_globals, new_func_start)
    if new_func_end == -1:
        print(f"Warning: could not find matching brace for component in {tpl_id}")
        return False
        
    new_content = content_with_globals[:new_func_start] + SESSION_HOOK_BLOCK + content_with_globals[new_func_start:]
    
    new_func_start += len(SESSION_HOOK_BLOCK)
    new_func_end += len(SESSION_HOOK_BLOCK)
    
    primary_name = city_info[0] if city_info else registry_name
    city_name = city_info[1] if (city_info and city_info[1]) else "Paris"
    name_variations = get_name_variations(primary_name)
    
    all_blocks = find_return_blocks_in_range(new_content, new_func_start, new_func_end)
    return_blocks = filter_outer_blocks(all_blocks)
    if not return_blocks:
        print(f"Warning: no return blocks found in {tpl_id}")
        return False
        
    for start, end in sorted(return_blocks, key=lambda x: x[0], reverse=True):
        jsx = new_content[start:end]
        
        # A. Replace Business Name in JSX
        for var in name_variations:
            jsx = re.sub(rf'>\s*{re.escape(var)}\s*<', f'>{{fd?.businessName ?? "{primary_name}"}}<', jsx)
            jsx = re.sub(rf'alt=["\']{re.escape(var)}["\']', f'alt={{fd?.businessName ?? "{primary_name}"}}', jsx)
            jsx = re.sub(rf'label=["\']{re.escape(var)}["\']', f'label={{fd?.businessName ?? "{primary_name}"}}', jsx)
            
        # B. Replace Hero Headline
        h1_pattern = re.compile(r'(<motion\.h1\b|<h1\b)([^>]*>)(.*?)(</motion\.h1>|</h1>)', re.DOTALL)
        h1_match = h1_pattern.search(jsx)
        if h1_match:
            h1_text = h1_match.group(3)
            if 'c?.heroHeadline' not in h1_text:
                h1_repl = f"{h1_match.group(1)}{h1_match.group(2)}{{c?.heroHeadline ?? <>{h1_text}</>}}{h1_match.group(4)}"
                jsx = jsx[:h1_match.start()] + h1_repl + jsx[h1_match.end():]
                
                # C. Replace Hero Tagline
                h1_end_pos = h1_match.start() + len(h1_repl)
                p_pattern = re.compile(r'(<motion\.p\b|<p\b)([^>]*>)(.*?)(</motion\.p>|</p>)', re.DOTALL)
                p_match = p_pattern.search(jsx, pos=h1_end_pos)
                if p_match:
                    p_text = p_match.group(3)
                    if 'c?.heroSubline' not in p_text:
                        p_repl = f"{p_match.group(1)}{p_match.group(2)}{{c?.heroSubline ?? fd?.tagline ?? <>{p_text}</>}}{p_match.group(4)}"
                        jsx = jsx[:p_match.start()] + p_repl + jsx[p_match.end():]
                        
                        # D. Replace Primary CTA
                        cta_end_pos = p_match.start() + len(p_repl)
                        cta_pattern = re.compile(r'(<button\b|<Link\b|<a\b)([^>]*>)(.*?)(</button>|</Link>|</a>)', re.DOTALL)
                        cta_match = cta_pattern.search(jsx, pos=cta_end_pos)
                        if cta_match:
                            cta_text = cta_match.group(3)
                            if 'c?.ctaText' not in cta_text and len(cta_text) < 50:
                                cta_repl = f"{cta_match.group(1)}{cta_match.group(2)}{{c?.ctaText ?? <>{cta_text}</>}}{cta_match.group(4)}"
                                jsx = jsx[:cta_match.start()] + cta_repl + jsx[cta_match.end():]
                                
        # E. Replace About Section
        h23_pattern = re.compile(r'(<motion\.h2\b|<h2\b|<motion\.h3\b|<h3\b)([^>]*>)(.*?)(</motion\.h2>|</h2>|</motion\.h3>|</h3>)', re.DOTALL)
        p_pattern = re.compile(r'(<motion\.p\b|<p\b)([^>]*>)(.*?)(</motion\.p>|</p>)', re.DOTALL)
        
        paragraphs = list(p_pattern.finditer(jsx))
        about_p = None
        about_h = None
        for p in paragraphs:
            text = p.group(3)
            if 'c?.heroSubline' in text or 'c?.aboutText' in text:
                continue
            if len(text) < 120 or len(text) > 800:
                continue
            if 'testimonial' in text.lower() or 'review' in text.lower():
                continue
            # Skip if text contains nested JSX tags or template expressions
            if re.search(r'<\w', text):
                continue
            if '{' in text or '}' in text:
                continue
            about_p = p
            search_start = max(0, p.start() - 600)
            headings = list(h23_pattern.finditer(jsx[search_start:p.start()]))
            if headings:
                about_h = headings[-1]
                h_start = search_start + about_h.start()
                h_end = search_start + about_h.end()
                h_groups = (about_h.group(1), about_h.group(2), about_h.group(3), about_h.group(4))
                about_h = (h_start, h_end, h_groups)
            break
            
        if about_p:
            p_text = about_p.group(3)
            p_repl = f"{about_p.group(1)}{about_p.group(2)}{{c?.aboutText ?? <>{p_text}</>}}{about_p.group(4)}"
            if about_h:
                h_start, h_end, h_groups = about_h
                h_text = h_groups[2]
                h_repl = f"{h_groups[0]}{h_groups[1]}{{c?.aboutTitle ?? fd?.businessName ?? <>{h_text}</>}}{h_groups[3]}"
                jsx = jsx[:h_start] + h_repl + jsx[h_end:about_p.start()] + p_repl + jsx[about_p.end():]
            else:
                jsx = jsx[:about_p.start()] + p_repl + jsx[about_p.end():]

        # F. Replace City inside JSX tags
        if city_name:
            jsx = re.sub(rf'>\s*{re.escape(city_name)}\s*<', f'>{{fd?.city ?? "{city_name}"}}<', jsx)
            jsx = re.sub(rf'>\s*{re.escape(city_name)}\s*,\s*France\s*<', f'>{{fd?.city ?? "{city_name}"}}, France<', jsx)
            jsx = re.sub(rf'>\s*{re.escape(city_name)}\s*,\s*UK\s*<', f'>{{fd?.city ?? "{city_name}"}}, UK<', jsx)
            
        new_content = new_content[:start] + jsx + new_content[end:]
        
    # G. Mutate Services and Testimonials Arrays (at runtime in the component body)
    MUTATE_ARRAYS_BLOCK = """
  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);
"""
    # Locate the outermost component's return statement block
    # Since we modified the file, let's find the component declaration again in new_content
    decl = find_component_decl(new_content)
    if decl:
        _, new_func_start, _ = decl
        new_func_end = find_matching_brace(new_content, new_func_start)
        ret_match = re.search(r'return\s*\(', new_content[new_func_start:new_func_end])
        if ret_match:
            insert_idx = new_func_start + ret_match.start()
            new_content = new_content[:insert_idx] + MUTATE_ARRAYS_BLOCK + new_content[insert_idx:]

    # H. Replace Accent brand Color globally
    accent_hex = find_primary_accent_color(new_content)
    if accent_hex:
        new_content = replace_brand_color(new_content, accent_hex)
        
    # I. Replace Contact Info (Email, Phone, Instagram, LinkedIn)
    new_content = replace_contact_info(new_content, city_name)
    
    # J. Replace Business Name globally in the file
    for var in name_variations:
        new_content = re.sub(rf'>\s*{re.escape(var)}\s*<', f'>{{fd?.businessName ?? "{primary_name}"}}<', new_content)
        new_content = re.sub(rf'alt=["\']{re.escape(var)}["\']', f'alt={{fd?.businessName ?? "{primary_name}"}}', new_content)
        new_content = re.sub(rf'label=["\']{re.escape(var)}["\']', f'label={{fd?.businessName ?? "{primary_name}"}}', new_content)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print(f"Successfully processed {tpl_id}")
    return True

if __name__ == '__main__':
    from scripts.session_injection import parse_registry_names, parse_city_labels
    reg_names = parse_registry_names()
    city_labels = parse_city_labels()
    
    if len(sys.argv) > 1:
        process_file(sys.argv[1], reg_names.get(sys.argv[1], ""), city_labels.get(sys.argv[1]))
    else:
        # Default test on impact-04
        process_file('impact-04', reg_names.get('impact-04', "L'Étoile Restaurant"), city_labels.get('impact-04'))
