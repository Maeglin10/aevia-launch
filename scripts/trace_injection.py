import re
import os
from scripts.session_injection import ensure_react_imports, GLOBALS_DECLARATION, SESSION_HOOK_BLOCK, get_name_variations, find_return_blocks_in_range, find_matching_brace, find_primary_accent_color, replace_brand_color, replace_contact_info

def trace_process():
    file_path = 'app/templates/impact-04/page.tsx'
    content = open(file_path, 'r', encoding='utf-8').read()
    
    content = ensure_react_imports(content)
    
    func_pattern = re.compile(r'export\s+default\s+function\s+(\w+)\s*\(([^)]*)\)\s*\{')
    match = func_pattern.search(content)
    func_decl_idx = match.start()
    func_start = match.end()
    func_end = find_matching_brace(content, func_start)
    
    content_with_globals = content[:func_decl_idx] + GLOBALS_DECLARATION + content[func_decl_idx:]
    
    # Re-find
    match = func_pattern.search(content_with_globals)
    func_start = match.end()
    func_end = find_matching_brace(content_with_globals, func_start)
    
    new_content = content_with_globals[:func_start] + SESSION_HOOK_BLOCK + content_with_globals[func_start:]
    
    match = func_pattern.search(new_content)
    func_start = match.end()
    func_end = find_matching_brace(new_content, func_start)
    
    primary_name = "L'Étoile Restaurant"
    city_name = "Paris"
    name_variations = get_name_variations(primary_name)
    
    return_blocks = find_return_blocks_in_range(new_content, func_start, func_end)
    
    for start, end in sorted(return_blocks, key=lambda x: x[0], reverse=True):
        jsx = new_content[start:end]
        
        # Log before / after replacements
        for var in name_variations:
            # 1. Text inside tags
            pat1 = rf'>\s*{re.escape(var)}\s*<'
            before = jsx
            jsx = re.sub(pat1, f'>{{fd?.businessName ?? "{primary_name}"}}<', jsx)
            if jsx != before:
                print(f"Pat1 matched: {pat1}")
                if 'Étoile dining room' in jsx:
                    print("Error introduced by Pat1 for", var)
                    
            # 2. alt
            pat2 = rf'alt=["\']{re.escape(var)}["\']'
            before = jsx
            jsx = re.sub(pat2, f'alt={{fd?.businessName ?? "{primary_name}"}}', jsx)
            if jsx != before:
                print(f"Pat2 matched: {pat2}")
                if 'Étoile dining room' in jsx:
                    print("Error introduced by Pat2 for", var)
                    
            # 3. label
            pat3 = rf'label=["\']{re.escape(var)}["\']'
            before = jsx
            jsx = re.sub(pat3, f'label={{fd?.businessName ?? "{primary_name}"}}', jsx)
            if jsx != before:
                print(f"Pat3 matched: {pat3}")
                
        new_content = new_content[:start] + jsx + new_content[end:]

if __name__ == '__main__':
    trace_process()
