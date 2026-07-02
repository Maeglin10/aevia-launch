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
        for var in name_variations:
            jsx = re.sub(rf'>\s*{re.escape(var)}\s*<', f'>{{fd?.businessName ?? "{primary_name}"}}<', jsx)
            jsx = re.sub(rf'alt=["\']{re.escape(var)}["\']', f'alt={{fd?.businessName ?? "{primary_name}"}}', jsx)
            jsx = re.sub(rf'label=["\']{re.escape(var)}["\']', f'label={{fd?.businessName ?? "{primary_name}"}}', jsx)
        new_content = new_content[:start] + jsx + new_content[end:]
    print_dining_room("After JSX Name Replacements", new_content)
    
    accent_hex = find_primary_accent_color(new_content)
    print("accent_hex found:", accent_hex)
    new_content = replace_brand_color(new_content, accent_hex)
    print_dining_room("After Brand Color", new_content)
    
    new_content = replace_contact_info(new_content, city_name)
    print_dining_room("After Contact Info", new_content)
    
    for var in name_variations:
        new_content = re.sub(rf'>\s*{re.escape(var)}\s*<', f'>{{fd?.businessName ?? "{primary_name}"}}<', new_content)
        new_content = re.sub(rf'alt=["\']{re.escape(var)}["\']', f'alt={{fd?.businessName ?? "{primary_name}"}}', new_content)
        new_content = re.sub(rf'label=["\']{re.escape(var)}["\']', f'label={{fd?.businessName ?? "{primary_name}"}}', new_content)
    print_dining_room("After Global Name Replacements", new_content)

if __name__ == '__main__':
    trace_process()
