# LNN Legal Desktop Application

Electron-based desktop application for the LNN Legal system.

## Features

- **Single Instance**: Prevents multiple instances from running simultaneously
- **Modern Window**: 1400x900 window with proper window controls
- **Secure IPC**: Exposes `window.app.invoke()` API for safe communication
- **Development Mode**: Loads from `http://localhost:3000` during development
- **Production Mode**: Serves Next.js static build output
- **Windows Packaging**: Creates both EXE and MSI installers

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+
- Next.js web app running on port 3000

### Running in Development

```bash
# Start the desktop app in development mode
pnpm dev

# This will:
# 1. Start the Next.js web app on localhost:3000
# 2. Compile the Electron main process
# 3. Launch the Electron app
```

### Manual Development Commands

```bash
# Compile TypeScript
pnpm build:main

# Start Electron with compiled code
pnpm start

# Start web app separately
pnpm dev:renderer
```

## Building for Production

### Build Process

```bash
# Build both main process and web app
pnpm build

# This creates:
# - dist/main.js (compiled Electron main process)
# - ../web/out/ (Next.js static build)
```

### Packaging

```bash
# Create unpacked distribution
pnpm pack

# Create Windows installers
pnpm dist:win

# Create specific Windows formats
pnpm dist:win-exe    # NSIS installer (EXE)
pnpm dist:win-msi    # MSI installer
```

## API Reference

### Window.app API

The preload script exposes a secure API through `window.app`:

```typescript
// Generic invoke method
window.app.invoke(channel: string, payload?: any): Promise<any>

// Convenience methods
window.app.getVersion(): Promise<string>
window.app.quit(): Promise<void>
window.app.minimize(): Promise<void>
window.app.maximize(): Promise<void>
window.app.close(): Promise<void>

// Dialog methods
window.app.showMessageBox(options: any): Promise<any>
window.app.showOpenDialog(options: any): Promise<any>
window.app.showSaveDialog(options: any): Promise<any>
```

### Usage Example

```typescript
// In your React components
const handleQuit = async () => {
  await window.app.quit()
}

const handleOpenFile = async () => {
  const result = await window.app.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Documents', extensions: ['pdf', 'doc', 'docx'] }
    ]
  })
  
  if (!result.canceled) {
    console.log('Selected file:', result.filePaths[0])
  }
}
```

## Configuration

### Window Settings

- **Size**: 1400x900 pixels
- **Minimum Size**: 1200x800 pixels
- **Title Bar**: Hidden inset style
- **Security**: Context isolation enabled, node integration disabled

### Security Features

- **Single Instance Lock**: Prevents multiple app instances
- **IPC Channel Whitelist**: Only allows predefined channels
- **External Link Handling**: Opens external links in default browser
- **No Node Integration**: Renderer process cannot access Node.js APIs

## File Structure

```
apps/desktop/
├── src/
│   ├── main.ts          # Electron main process
│   └── preload.ts       # Preload script with IPC bridge
├── scripts/
│   └── dev.js          # Development startup script
├── assets/
│   ├── icon.png        # Application icon (512x512)
│   ├── icon.ico        # Windows icon (256x256)
│   └── README.md       # Icon setup instructions
├── dist/               # Compiled main process
├── release/            # Built installers
└── package.json        # Dependencies and build config
```

## Build Configuration

### Electron Builder Settings

- **App ID**: `com.lnnlegal.desktop`
- **Product Name**: `LNN Legal Desktop`
- **Output Directory**: `release/`
- **Windows Targets**: NSIS (EXE) and MSI
- **Architecture**: x64 only

### Installer Features

- **Customizable Installation Directory**
- **Desktop Shortcut Creation**
- **Start Menu Integration**
- **Uninstaller Included**

## Troubleshooting

### Common Issues

1. **Port 3000 Already in Use**
   ```bash
   # Kill process using port 3000
   npx kill-port 3000
   ```

2. **Build Failures**
   ```bash
   # Clean and rebuild
   pnpm clean
   pnpm build
   ```

3. **Icon Not Showing**
   - Ensure `assets/icon.png` and `assets/icon.ico` exist
   - Check file permissions
   - Verify icon dimensions (512x512 PNG, 256x256 ICO)

### Development Tips

- Use `Ctrl+Shift+I` to open DevTools in development
- Check console for IPC communication errors
- Verify Next.js app is running before starting Electron
- Use `pnpm dev:main` for faster iteration on main process changes

## Production Deployment

### Distribution Files

After running `pnpm dist:win`, you'll find:

- `release/LNN Legal Desktop Setup.exe` - NSIS installer
- `release/LNN Legal Desktop.msi` - MSI installer
- `release/win-unpacked/` - Unpacked application files

### Installation Requirements

- Windows 10 or later
- 64-bit architecture
- ~200MB disk space
- No additional dependencies required

## License

Private - All rights reserved
