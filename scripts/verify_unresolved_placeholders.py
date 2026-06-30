import os
import re

def verify():
    base_dir = 'app/templates'
    if not os.path.exists(base_dir):
        print("Templates dir not found.")
        return

    unresolved_patterns = [
        r'\$\{t\.',
        r'\bt\.style\b',
        r'\bt\.fonts\b',
        r'\bt\.palette\b',
        r'\bt\.photos\b',
        r'\bt\.content\b',
        r'\bt\.name\b',
        r'\bt\.category\b',
        r'\bt\.description\b',
    ]

    found = False
    for i in range(292, 311):
        t_id = f"impact-{i}"
        fp = os.path.join(base_dir, t_id, 'page.tsx')
        if not os.path.exists(fp):
            continue

        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()

        for pat in unresolved_patterns:
            matches = re.findall(pat, content)
            if matches:
                print(f"[{t_id}] Found unresolved pattern {pat} matches: {matches}")
                found = True

    if not found:
        print("No unresolved template placeholders found in impact-292..310!")

if __name__ == '__main__':
    verify()
