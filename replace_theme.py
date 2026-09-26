import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Replace text-white/XX with muted text
    content = re.sub(r'text-white/(60|70|80|90)', r'text-[var(--color-text-muted)]', content)
    
    # 2. Replace borders
    content = re.sub(r'border-white/(10|20|30)', r'border-[var(--color-line)]', content)
    
    # 3. Replace bgs
    content = re.sub(r'bg-white/(5|10)', r'bg-[var(--color-line)]', content)
    
    # 4. For text-white, we want to replace it ONLY IF it's not inside a string that has bg-saffron or similar
    # Since regex parsing of tailwind strings is hard, let's just do a blanket replacement of text-white
    # EXCEPT we find a way to preserve it for specific buttons.
    # Actually, we can just replace all text-white and then we will manually fix the few primary buttons.
    # Or, we can look for `text-white` and replace it with `text-[var(--color-text-primary)]`.
    
    content = re.sub(r'\btext-white\b', r'text-[var(--color-text-primary)]', content)
    
    # But wait! We know some buttons explicitly have `bg-[var(--color-saffron)] text-[var(--color-text-primary)]`.
    # We can fix them immediately after.
    content = content.replace('bg-[var(--color-saffron)] text-[var(--color-text-primary)]', 'bg-[var(--color-saffron)] text-white')
    content = content.replace('bg-rose-600 text-[var(--color-text-primary)]', 'bg-rose-600 text-white')
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

def main():
    src_dir = r"c:\Users\Yashwant\NeuraHire\neurapro\src"
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                process_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
