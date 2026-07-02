import os
from scripts.session_injection import process_file, parse_registry_names, parse_city_labels

def main():
    reg_names = parse_registry_names()
    city_labels = parse_city_labels()
    
    success_count = 0
    failure_count = 0
    skipped_count = 0
    
    for i in range(1, 313):
        tpl_id = f"impact-{i:02d}"
        file_path = f"app/templates/{tpl_id}/page.tsx"
        if not os.path.exists(file_path):
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'let fd: any = null;' in content:
            skipped_count += 1
            continue
            
        registry_name = reg_names.get(tpl_id, "")
        city_info = city_labels.get(tpl_id)
        
        try:
            success = process_file(tpl_id, registry_name, city_info)
            if success:
                success_count += 1
            else:
                failure_count += 1
        except Exception as e:
            print(f"Error processing {tpl_id}: {e}")
            failure_count += 1
            
    print(f"Total processed: {success_count} success, {failure_count} failures, {skipped_count} skipped")

if __name__ == '__main__':
    main()
