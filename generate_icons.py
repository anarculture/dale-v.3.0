
from PIL import Image
import os

source_path = 'frontend/src/app/icon.png'
dest_dir = 'frontend/public/icons'

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

if not os.path.exists(source_path):
    print(f"Error: Source file {source_path} not found.")
    # Try alternate location
    source_path = 'frontend/public/favicon.png'
    if not os.path.exists(source_path):
        print(f"Error: Source file {source_path} not found either.")
        exit(1)

img = Image.open(source_path)

sizes = [(192, 192), (512, 512)]

for size in sizes:
    resized_img = img.resize(size, Image.Resampling.LANCZOS)
    output_path = os.path.join(dest_dir, f'icon-{size[0]}.png')
    resized_img.save(output_path)
    print(f"Generated {output_path}")
