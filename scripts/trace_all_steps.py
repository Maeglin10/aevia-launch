import re
import os
from scripts.session_injection import ensure_react_imports, GLOBALS_DECLARATION, SESSION_HOOK_BLOCK, get_name_variations, find_return_blocks_in_range, find_matching_brace, find_primary_accent_color, replace_brand_color, replace_contact_info

def print_dining_room(step_name, text):
    lines = text.splitlines()
    for i, l in enumerate(lines):
        if 'dining room' in l:
            print(f"[{step_name}] Line {i+1}: {l.strip()}")

def trace_process():
    file_path = 'app/templates/impact-04/page.tsx'
    content = open(file_path, 'r', encoding='utf-8').read()
    print_dining_room("Initial", content)
    
    content = ensure_react_imports(content)
    print_dining_room("After Imports", content)
    
    func_pattern = re.compile(r'export\s+default\s+function\s+(\w+)\s*\(([^)]*)\)\s*\{')
    match = func_pattern.search(content)
    func_decl_idx = match.start()
    func_start = match.end()
    func_end = find_matching_brace(content, func_start)
    
    content_with_globals = content[:func_decl_idx] + GLOBALS_DECLARATION + content[func_decl_idx:]
    print_dining_room("After Globals", content_with_globals)
    
    match = func_pattern.search(content_with_globals)
    func_start = match.end()
    new_content = content_with_globals[:func_start] + SESSION_HOOK_BLOCK + content_with_globals[func_start:]
    print_dining_room("After Hook", new_content)
    
    match = func_pattern.search(new_content)
    func_start = match.end()
    func_end = find_matching_brace(new_content, func_start)
    
    primary_name = "L'Étoile Restaurant"
    city_name = "Paris"
    name_variations = get_name_variations(primary_name)
    
    return_blocks = find_return_blocks_in_range(new_content, func_start, func_end)
    
    for start, end in sorted(return_blocks, key=lambda x: x[0], reverse=True):
        jsx = new_content[start:end]
        
        # A. Replace Business Name in JSX
        for var in name_variations:
            jsx = re.sub(rf'>\s*{re.escape(var)}\s*<', f'>{{fd?.businessName ?? "{primary_name}"}}<', jsx)
            jsx = re.sub(rf'alt=["\']{re.escape(var)}["\']', f'alt={{fd?.businessName ?? "{primary_name}"}}', jsx)
            jsx = re.sub(rf'label=["\']{re.escape(var)}["\']', f'label={{fd?.businessName ?? "{primary_name}"}}', jsx)
        print_dining_room("After name JSX in block", jsx)
            
        # B. Replace Hero Headline
        h1_pattern = re.compile(r'(<motion\.h1|<h1)([^>]*>)(.*?)(</motion\.h1>|</h1>)', re.DOTALL)
        h1_match = h1_pattern.search(jsx)
        if h1_match:
            h1_text = h1_match.group(3)
            if 'c?.heroHeadline' not in h1_text:
                h1_repl = f"{h1_match.group(1)}{h1_match.group(2)}{{c?.heroHeadline ?? <>{h1_text}</>}}{h1_match.group(4)}"
                jsx = jsx[:h1_match.start()] + h1_repl + jsx[h1_match.end():]
                print_dining_room("After H1 repl in block", jsx)
                
                # C. Replace Hero Tagline
                h1_end_pos = h1_match.start() + len(h1_repl)
                p_pattern = re.compile(r'(<motion\.p|<p)([^>]*>)(.*?)(</motion\.p>|</p>)', re.DOTALL)
                p_match = p_pattern.search(jsx, pos=h1_end_pos)
                if p_match:
                    p_text = p_match.group(3)
                    if 'c?.heroSubline' not in p_text:
                        p_repl = f"{p_match.group(1)}{p_match.group(2)}{{c?.heroSubline ?? fd?.tagline ?? <>{p_text}</>}}{p_match.group(4)}"
                        jsx = jsx[:p_match.start()] + p_repl + jsx[p_match.end():]
                        print_dining_room("After Tagline repl in block", jsx)
                        
                        # D. Replace Primary CTA button
                        cta_end_pos = p_match.start() + len(p_repl)
                        cta_pattern = re.compile(r'(<button|<Link|<a)([^>]*>)(.*?)(</button>|</Link>|</a>)', re.DOTALL)
                        cta_match = cta_pattern.search(jsx, pos=cta_end_pos)
                        if cta_match:
                            cta_text = cta_match.group(3)
                            if 'c?.ctaText' not in cta_text and len(cta_text) < 50:
                                cta_repl = f"{cta_match.group(1)}{cta_match.group(2)}{{c?.ctaText ?? <>{cta_text}</>}}{cta_match.group(4)}"
                                jsx = jsx[:cta_match.start()] + cta_repl + jsx[cta_match.end():]
                                print_dining_room("After CTA repl in block", jsx)
                                
        # E. Replace About Section
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
        print_dining_room("After About repl in block", jsx)
        
        new_content = new_content[:start] + jsx + new_content[end:]
        
    print_dining_room("After return blocks JSX", new_content)

if __name__ == '__main__':
    trace_process()
