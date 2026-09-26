import sys
import os

def replace_classes(content):
    content = content.replace("glass-panel bg-white border border-slate-200 shadow-sm rounded-2xl", "cyber-card")
    content = content.replace("glass-panel bg-white border border-slate-200 shadow-sm rounded-3xl", "cyber-card")
    content = content.replace("bg-slate-50 border border-slate-200", "bg-[var(--color-bg-dark)] border border-white/10 text-white")
    content = content.replace("bg-slate-50", "bg-[var(--color-bg-dark)] text-white")
    content = content.replace("text-slate-900", "text-white")
    content = content.replace("text-slate-700", "text-white/80")
    content = content.replace("text-slate-600", "text-[var(--color-text-muted)]")
    content = content.replace("font-outfit", "font-display")
    content = content.replace("font-rubik", "font-body")
    content = content.replace("border-slate-200", "border-white/10")
    content = content.replace("bg-slate-100", "bg-white/5")
    content = content.replace("bg-blue-50 border-blue-200 text-blue-700", "bg-[var(--color-saffron)]/10 border-[var(--color-saffron)]/20 text-[var(--color-saffron)]")
    content = content.replace("bg-indigo-50 border-indigo-200 text-indigo-700", "bg-[var(--color-saffron)]/10 border-[var(--color-saffron)]/20 text-[var(--color-saffron)]")
    content = content.replace("text-blue-600", "text-[var(--color-saffron)]")
    content = content.replace("bg-blue-600", "bg-[var(--color-saffron)]")
    return content

files_to_update = [
    "src/components/ApplicationForm.tsx",
    "src/components/StatusTracker.tsx",
    "src/components/AdminDashboard.tsx",
    "src/components/DomainApply.tsx"
]

for file_path in files_to_update:
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = replace_classes(content)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Replacement complete.")
