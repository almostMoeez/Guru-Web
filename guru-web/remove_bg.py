from PIL import Image

# Load the logo
img = Image.open(r'C:\Users\elect\documents\guru\assets\logo.jpg').convert('RGBA')

# Get pixel data
pixels = img.load()
width, height = img.size

# Convert black/near-black to transparent
for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        # If pixel is very dark (black or near-black), make it transparent
        if r < 30 and g < 30 and b < 30:
            pixels[x, y] = (r, g, b, 0)

# Save as PNG
output_path = r'C:\Users\elect\documents\guru\assets\logo.png'
img.save(output_path, 'PNG')
print(f"Saved transparent logo to {output_path}")