import os

INSTAGRAM_DEF = """
// Custom Instagram icon component for compatibility
const Instagram = ({ size = 24, ...props }: React.ComponentProps<'svg'> & { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
"""

def fix_instagram():
    base_dir = 'app/templates'
    if not os.path.exists(base_dir):
        print("Templates dir not found.")
        return

    for i in range(292, 311):
        t_id = f"impact-{i}"
        fp = os.path.join(base_dir, t_id, 'page.tsx')
        if not os.path.exists(fp):
            continue

        print(f"Fixing Instagram in {t_id}...")
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()

        # Remove Instagram, from the import block
        content = content.replace("  Instagram,\n", "")
        content = content.replace("  Instagram,", "")

        # Find the end of import block (e.g. "} from 'lucide-react';") and append Instagram component
        target_import_end = "} from 'lucide-react';"
        if target_import_end in content:
            parts = content.split(target_import_end, 1)
            content = parts[0] + target_import_end + INSTAGRAM_DEF + parts[1]
        else:
            print(f"Warning: could not find end of lucide-react import in {t_id}")

        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)

if __name__ == '__main__':
    fix_instagram()
