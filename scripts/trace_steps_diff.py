import re
import os
import difflib
from scripts.session_injection import ensure_react_imports, GLOBALS_DECLARATION, SESSION_HOOK_BLOCK, get_name_variations, find_return_blocks_in_range, find_matching_brace, find_primary_accent_color, replace_brand_color, replace_contact_info

def print_diff(step, before, after):
    diff = list(difflib.unified_diff(before.splitlines(), after.splitlines(), lineterm=''))
    for line in diff:
        if 'dining room' in line:
            print(f"[{step}] {line}")

def process_file_traced(tpl_id, registry_name, city_info):
    file_path = f'app/templates/{tpl_id}/page.tsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    s1 = ensure_react_imports(content)
    print_diff("Ensure Imports", content, s1)
    
    func_pattern = re.compile(r'export\s+default\s+function\s+(\w+)\s*\(([^)]*)\)\s*\{')
    match = func_pattern.search(s1)
    func_decl_idx = match.start()
    func_start = match.end()
    func_end = find_matching_brace(s1, func_start)
    
    s2 = s1[:func_decl_idx] + GLOBALS_DECLARATION + s1[func_decl_idx:]
    print_diff("Globals Decl", s1, s2)
    
    match = func_pattern.search(s2)
    func_start = match.end()
    s3 = s2[:func_start] + SESSION_HOOK_BLOCK + s2[func_start:]
    print_diff("Hook Block", s2, s3)
    
    match = func_pattern.search(s3)
    func_start = match.end()
    func_end = find_matching_brace(s3, func_start)
    
    primary_name = city_info[0] if city_info else registry_name
    city_name = city_info[1] if (city_info and city_info[1]) else "Paris"
    name_variations = get_name_variations(primary_name)
    
    return_blocks = find_return_blocks_in_range(s3, func_start, func_end)
    s4 = s3
    for start, end in sorted(return_blocks, key=lambda x: x[0], reverse=True):
        jsx = s4[start:end]
        for var in name_variations:
            jsx = re.sub(rf'>\s*{re.escape(var)}\s*<', f'>{{fd?.businessName ?? "{primary_name}"}}<', jsx)
            jsx = re.sub(rf'alt=["\']{re.escape(var)}["\']', f'alt={{fd?.businessName ?? "{primary_name}"}}', jsx)
            jsx = re.sub(rf'label=["\']{re.escape(var)}["\']', f'label={{fd?.businessName ?? "{primary_name}"}}', jsx)
            
        h1_pattern = re.compile(r'(<motion\.h1|<h1)([^>]*>)(.*?)(</motion\.h1>|</h1>)', re.DOTALL)
        h1_match = h1_pattern.search(jsx)
        if h1_match:
            h1_text = h1_match.group(3)
            if 'c?.heroHeadline' not in h1_text:
                h1_repl = f"{h1_match.group(1)}{h1_match.group(2)}{{c?.heroHeadline ?? <>{h1_text}</>}}{h1_match.group(4)}"
                jsx = jsx[:h1_match.start()] + h1_repl + jsx[h1_match.end():]
                
                h1_end_pos = h1_match.start() + len(h1_repl)
                p_pattern = re.compile(r'(<motion\.p|<p)([^>]*>)(.*?)(</motion\.p>|</p>)', re.DOTALL)
                p_match = p_pattern.search(jsx, pos=h1_end_pos)
                if p_match:
                    p_text = p_match.group(3)
                    if 'c?.heroSubline' not in p_text:
                        p_repl = f"{p_match.group(1)}{p_match.group(2)}{{c?.heroSubline ?? fd?.tagline ?? <>{p_text}</>}}{p_match.group(4)}"
                        jsx = jsx[:p_match.start()] + p_repl + jsx[p_match.end():]
                        
                        cta_end_pos = p_match.start() + len(p_repl)
                        cta_pattern = re.compile(r'(<button|<Link|<a)([^>]*>)(.*?)(</button>|</Link>|</a>)', re.DOTALL)
                        cta_match = cta_pattern.search(jsx, pos=cta_end_pos)
                        if cta_match:
                            cta_text = cta_match.group(3)
                            if 'c?.ctaText' not in cta_text and len(cta_text) < 50:
                                cta_repl = f"{cta_match.group(1)}{cta_match.group(2)}{{c?.ctaText ?? <>{cta_text}</>}}{cta_match.group(4)}"
                                jsx = jsx[:cta_match.start()] + cta_repl + jsx[cta_match.end():]
                                
        h23_pattern = re.compile(r'(<motion\.h2|<h2|<motion\.h3|<h3)([^>]*>)(.*?)(</motion\.h2>|</h2>|</motion\.h3>|</h3>)', re.DOTALL)
        p_pattern = re.compile(r'(<motion\.p|<p)([^>]*>)(.*?)(</motion\.p>|</p>)', re.DOTALL)
        
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

        if city_name:
            jsx = re.sub(rf'>\s*{re.escape(city_name)}\s*<', f'>{{fd?.city ?? "{city_name}"}}<', jsx)
            jsx = re.sub(rf'>\s*{re.escape(city_name)}\s*,\s*France\s*<', f'>{{fd?.city ?? "{city_name}"}}, France<', jsx)
            
        s4 = s4[:start] + jsx + s4[end:]
        
    print_diff("JSX Processing", s3, s4)
    
    # Mutate Arrays Block
    MUTATE_ARRAYS_BLOCK = "/* Array Mutation */"
    last_return_match = list(re.finditer(r'return\s*\(', s4))
    s5 = s4
    if last_return_match:
        match = func_pattern.search(s4)
        func_start = match.end()
        func_end = find_matching_brace(s4, func_start)
        ret_match = re.search(r'return\s*\(', s4[func_start:func_end])
        if ret_match:
            insert_idx = func_start + ret_match.start()
            s5 = s4[:insert_idx] + MUTATE_ARRAYS_BLOCK + s4[insert_idx:]
    print_diff("Mutate Block", s4, s5)
    
    accent_hex = find_primary_accent_color(s5)
    s6 = replace_brand_color(s5, accent_hex)
    print_diff("Replace Brand Color", s5, s6)
    
    s7 = replace_contact_info(s6, city_name)
    print_diff("Replace Contact Info", s6, s7)
    
    s8 = s7
    for var in name_variations:
        s8 = re.sub(rf'>\s*{re.escape(var)}\s*<', f'>{{fd?.businessName ?? "{primary_name}"}}<', s8)
        s8 = re.sub(rf'alt=["\']{re.escape(var)}["\']', f'alt={{fd?.businessName ?? "{primary_name}"}}', s8)
        s8 = re.sub(rf'label=["\']{re.escape(var)}["\']', f'label={{fd?.businessName ?? "{primary_name}"}}', s8)
    print_diff("Global Name Replacement", s7, s8)

if __name__ == '__main__':
    from scripts.session_injection import parse_registry_names, parse_city_labels
    reg_names = parse_registry_names()
    city_labels = parse_city_labels()
    process_file_traced('impact-04', reg_names.get('impact-04', "L'Étoile Restaurant"), city_labels.get('impact-04'))
