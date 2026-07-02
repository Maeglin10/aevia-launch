import re

def parse_registry():
    content = open('lib/templates/registry.ts').read()
    pattern = re.compile(r'id:\s*["\'](impact-\d+)["\'],\s*name:\s*(["\'])(.*?)\2')
    mapping = {m.group(1): m.group(3) for m in pattern.finditer(content)}
    print(len(mapping), list(mapping.items())[:5])

if __name__ == '__main__':
    parse_registry()
