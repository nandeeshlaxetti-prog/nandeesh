# Desktop App Assets

This directory contains assets for the Electron desktop application.

## Required Files

### Icons
- `icon.png` - Application icon (512x512 PNG)
- `icon.ico` - Windows icon file (256x256 ICO)

## How to Add Icons

1. Create a 512x512 PNG icon with your application logo
2. Save it as `icon.png` in this directory
3. Convert to ICO format for Windows:
   - Use online converters like https://convertio.co/png-ico/
   - Or use tools like ImageMagick: `magick icon.png icon.ico`
4. Save the ICO file as `icon.ico` in this directory

## Icon Guidelines

- Use a square design with rounded corners
- Ensure the icon is recognizable at small sizes (16x16, 32x32)
- Use high contrast colors for better visibility
- Consider both light and dark themes

## Current Status

⚠️ **Icons are not yet added** - The application will use default Electron icons until you add the required icon files.
