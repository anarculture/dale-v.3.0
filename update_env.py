import os

env_path = '.env'

with open(env_path, 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.startswith('API_PORT='):
        new_lines.append('API_PORT=8000\n')
    elif line.startswith('FRONTEND_PORT='):
        new_lines.append('FRONTEND_PORT=3000\n')
    elif line.startswith('NEXT_PUBLIC_API_BASE_URL='):
        new_lines.append('NEXT_PUBLIC_API_BASE_URL=http://localhost:8000\n')
    else:
        new_lines.append(line)

# Add if missing
if not any(line.startswith('API_PORT=') for line in new_lines):
    new_lines.append('API_PORT=8000\n')
if not any(line.startswith('FRONTEND_PORT=') for line in new_lines):
    new_lines.append('FRONTEND_PORT=3000\n')
if not any(line.startswith('NEXT_PUBLIC_API_BASE_URL=') for line in new_lines):
    new_lines.append('NEXT_PUBLIC_API_BASE_URL=http://localhost:8000\n')

with open(env_path, 'w') as f:
    f.writelines(new_lines)

print("Updated .env")
