import os

def fix_bg_comparison():
    base_dir = 'app/templates'
    if not os.path.exists(base_dir):
        print("Templates dir not found.")
        return

    for i in range(292, 311):
        t_id = f"impact-{i}"
        fp = os.path.join(base_dir, t_id, 'page.tsx')
        if not os.path.exists(fp):
            continue

        print(f"Fixing C.bg comparison in {t_id}...")
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()

        # Replace C.bg === '#ffffff' with (C.bg as string) === '#ffffff'
        content = content.replace("C.bg === '#ffffff'", "(C.bg as string) === '#ffffff'")
        content = content.replace("C.bg === \"#ffffff\"", "(C.bg as string) === \"#ffffff\"")

        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)

if __name__ == '__main__':
    fix_bg_comparison()
