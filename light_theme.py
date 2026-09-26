import os

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pre-emptively protect text-white for known dark backgrounds
    content = content.replace("bg-[var(--color-saffron)] text-white", "bg-[var(--color-saffron)] text-[#FFFFFF]")
    content = content.replace("bg-blue-600 text-white", "bg-blue-600 text-[#FFFFFF]")
    content = content.replace("bg-indigo-600 text-white", "bg-indigo-600 text-[#FFFFFF]")
    content = content.replace("bg-slate-900 hover:bg-slate-800 text-white", "bg-slate-900 hover:bg-slate-800 text-[#FFFFFF]")
    content = content.replace("bg-slate-900 text-white", "bg-slate-900 text-[#FFFFFF]")
    content = content.replace("bg-blue-600 hover:bg-blue-700 text-white", "bg-blue-600 hover:bg-blue-700 text-[#FFFFFF]")
    
    # Replace transparent text-white variations
    content = content.replace("text-white/80", "text-[var(--color-text-muted)]")
    content = content.replace("text-white/90", "text-[var(--color-text-primary)]")
    
    # Replace remaining text-white
    content = content.replace("text-white", "text-[var(--color-text-primary)]")
    
    # Restore protected text-white
    content = content.replace("text-[#FFFFFF]", "text-white")
    
    # Replace borders
    content = content.replace("border-white/10", "border-[var(--color-line)]")
    content = content.replace("border-white/20", "border-[var(--color-line)]")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

src_dir = r'c:\Users\Yashwant\NeuraHire\neurapro\src'
for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

print("Done")
