# File Storage System Documentation

This document provides comprehensive documentation for the File Storage System, including content-addressed file storage, PDF viewer functionality, and drag & drop file upload capabilities.

## Overview

The File Storage System provides:
- **Content-Addressed Storage**: Files stored using SHA-256 hashes for deduplication
- **PDF Viewer**: Embedded PDF viewer with toolbar controls
- **Drag & Drop Upload**: Seamless file upload to cases and orders
- **File Management**: Complete file lifecycle management
- **Audit Logging**: Comprehensive audit logging for all file operations
- **Permission Control**: Role-based access control for files
- **Storage Optimization**: Automatic deduplication and cleanup

## System Architecture

### Core Components

#### **File Storage Service**
- **Content Addressing**: Files stored using SHA-256 content hashes
- **Deduplication**: Automatic deduplication of identical files
- **Directory Structure**: Organized storage using hash prefixes
- **File Validation**: MIME type and size validation
- **Metadata Management**: JSON-based metadata storage
- **Cleanup Operations**: Orphaned file cleanup

#### **File Management Service**
- **Database Integration**: File records stored in database
- **Audit Logging**: All operations logged with audit trail
- **Permission Control**: Role-based access control
- **Soft Delete**: Files can be soft deleted and restored
- **Search & Query**: Advanced file search and filtering
- **Statistics**: Comprehensive file statistics

#### **PDF Viewer Component**
- **Embedded Viewer**: In-app PDF viewing capability
- **Toolbar Controls**: Print, download, and navigation controls
- **Temporary Files**: Secure temporary file handling
- **Error Handling**: Graceful error handling and retry
- **Responsive Design**: Mobile-friendly PDF viewing

#### **Drag & Drop Upload**
- **React Dropzone**: Modern drag & drop interface
- **File Validation**: Client-side file validation
- **Progress Tracking**: Upload progress indication
- **Multiple Files**: Support for multiple file uploads
- **Error Handling**: Comprehensive error handling

### Data Flow

1. **File Upload** → Drag & drop or file selection
2. **Validation** → MIME type and size validation
3. **Content Hashing** → SHA-256 hash calculation
4. **Deduplication Check** → Check if file already exists
5. **Storage** → Store file with content addressing
6. **Database Record** → Create file record in database
7. **Audit Logging** → Log file operation
8. **Response** → Return file metadata to client

## Content-Addressed Storage

### Hash-Based Storage

Files are stored using SHA-256 content hashes for several benefits:

#### **Deduplication**
- Identical files share the same storage location
- Reduces storage space requirements
- Prevents duplicate file storage

#### **Integrity Verification**
- File integrity can be verified using hash
- Detects file corruption or tampering
- Ensures data consistency

#### **Efficient Retrieval**
- Files can be retrieved by content hash
- Fast file lookup and comparison
- Optimized storage structure

### Directory Structure

```
DATA_DIR/
├── files/
│   ├── ab/
│   │   ├── cd/
│   │   │   └── abcdef1234567890... (hash)
│   │   └── ef/
│   │       └── abcdef1234567890... (hash)
│   └── 12/
│       ├── 34/
│       │   └── 1234567890abcdef... (hash)
│       └── 56/
│           └── 1234567890abcdef... (hash)
└── metadata/
    ├── file-id-1.json
    ├── file-id-2.json
    └── file-id-3.json
```

### File Metadata

```typescript
interface FileMetadata {
  id: string
  originalName: string
  mimeType: string
  size: number
  hash: string
  uploadedAt: Date
  uploadedBy: string
  caseId?: string
  orderId?: string
  tags?: string[]
  description?: string
}
```

## PDF Viewer

### Desktop PDF Viewer

The desktop app provides a native PDF viewer using Electron's BrowserWindow:

#### **Features**
- **Embedded Viewer**: PDF displayed in dedicated window
- **Toolbar Controls**: Back, print, download buttons
- **Temporary Files**: Secure temporary file handling
- **Auto Cleanup**: Temporary files cleaned on window close
- **Error Handling**: Graceful error handling

#### **Implementation**
```typescript
// Open PDF in embedded viewer
const pdfWindow = new BrowserWindow({
  width: 1000,
  height: 800,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  },
  title: `PDF Viewer - ${fileName}`
})

// Load PDF viewer HTML
pdfWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(pdfViewerHtml)}`)
```

### Web PDF Viewer

The web app provides a React-based PDF viewer:

#### **Features**
- **Blob URL**: PDF displayed using blob URLs
- **Responsive Design**: Mobile-friendly interface
- **Toolbar Controls**: Print, download, and navigation
- **Error Handling**: Retry functionality for failed loads
- **Loading States**: Progress indication during load

#### **Implementation**
```typescript
// Create blob URL for PDF
const blob = new Blob([fileContent], { type: 'application/pdf' })
const url = URL.createObjectURL(blob)
setPdfUrl(url)

// Display in iframe
<iframe
  src={pdfUrl}
  className="w-full h-96 border-0"
  title={`PDF Viewer - ${fileName}`}
/>
```

## Drag & Drop Upload

### React Dropzone Integration

The drag & drop functionality uses react-dropzone for modern file handling:

#### **Features**
- **Drag & Drop**: Intuitive drag & drop interface
- **File Validation**: Client-side validation
- **Progress Tracking**: Upload progress indication
- **Multiple Files**: Support for multiple file uploads
- **Error Handling**: Comprehensive error handling
- **File Preview**: Uploaded files list with actions

#### **Implementation**
```typescript
const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  accept: acceptedFileTypes.reduce((acc, type) => {
    acc[type] = []
    return acc
  }, {} as Record<string, string[]>),
  maxSize: maxFileSize,
  multiple,
  disabled: isUploading
})
```

### File Upload Process

1. **File Selection**: User drags files or clicks to select
2. **Validation**: Client-side validation of file type and size
3. **Base64 Conversion**: File converted to base64 for transmission
4. **IPC Upload**: File sent to desktop app via IPC
5. **Server Processing**: File processed and stored
6. **Response**: Upload result returned to client
7. **UI Update**: File list updated with new files

## File Management

### Database Schema

```sql
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  hash TEXT UNIQUE NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  uploaded_by TEXT NOT NULL,
  case_id TEXT,
  order_id TEXT,
  tags TEXT DEFAULT '[]',
  description TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME,
  deleted_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (uploaded_by) REFERENCES users(id),
  FOREIGN KEY (case_id) REFERENCES cases(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Indexes
CREATE INDEX idx_files_hash ON files(hash);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX idx_files_case_id ON files(case_id);
CREATE INDEX idx_files_order_id ON files(order_id);
CREATE INDEX idx_files_mime_type ON files(mime_type);
CREATE INDEX idx_files_uploaded_at ON files(uploaded_at);
CREATE INDEX idx_files_is_deleted ON files(is_deleted);
CREATE INDEX idx_files_deleted_at ON files(deleted_at);
```

### File Operations

#### **Upload File**
```typescript
const result = await fileManagementService.uploadFile({
  originalName: 'document.pdf',
  mimeType: 'application/pdf',
  fileBuffer: fileBuffer,
  uploadedBy: 'user-id',
  caseId: 'case-id',
  orderId: 'order-id',
  tags: ['important', 'legal'],
  description: 'Legal document'
})
```

#### **Get File Content**
```typescript
const fileContent = await fileManagementService.getFileContent(fileId)
```

#### **Get Case Files**
```typescript
const caseFiles = await fileManagementService.getCaseFiles(caseId)
```

#### **Get Order PDFs**
```typescript
const orderPdfs = await fileManagementService.getOrderPdfs(orderId)
```

#### **Update File Metadata**
```typescript
const result = await fileManagementService.updateFile(fileId, {
  originalName: 'updated-name.pdf',
  tags: ['updated'],
  description: 'Updated description'
})
```

#### **Delete File**
```typescript
const result = await fileManagementService.deleteFile(fileId, userId)
```

#### **Restore File**
```typescript
const result = await fileManagementService.restoreFile(fileId, userId)
```

## IPC Handlers

### Desktop App IPC Handlers

The desktop app provides several IPC handlers for file operations:

#### **files:openPdf**
```typescript
ipcMain.handle('files:openPdf', async (event, fileData) => {
  // Get file content
  const fileContent = await fileManagementService.getFileContent(fileData.fileId)
  
  // Create temporary file
  const tempFilePath = path.join(tempDir, `pdf-${fileData.fileId}.pdf`)
  fs.writeFileSync(tempFilePath, fileContent)
  
  // Open PDF viewer window
  const pdfWindow = new BrowserWindow({...})
  pdfWindow.loadURL(pdfViewerHtml)
})
```

#### **files:upload**
```typescript
ipcMain.handle('files:upload', async (event, uploadData) => {
  // Convert base64 to buffer
  const fileBuffer = Buffer.from(uploadData.fileData, 'base64')
  
  // Upload file
  const result = await fileManagementService.uploadFile({
    originalName: uploadData.fileName,
    mimeType: uploadData.mimeType,
    fileBuffer,
    uploadedBy: uploadData.uploadedBy,
    caseId: uploadData.caseId,
    orderId: uploadData.orderId
  })
  
  return { success: true, fileId: result.id }
})
```

#### **files:getCaseFiles**
```typescript
ipcMain.handle('files:getCaseFiles', async (event, caseData) => {
  const files = await fileManagementService.getCaseFiles(caseData.caseId)
  return { success: true, files }
})
```

#### **files:getOrderPdfs**
```typescript
ipcMain.handle('files:getOrderPdfs', async (event, orderData) => {
  const pdfs = await fileManagementService.getOrderPdfs(orderData.orderId)
  return { success: true, pdfs }
})
```

## Usage Examples

### Basic File Upload

```typescript
// Upload file via drag & drop
const handleFileUpload = async (files: File[]) => {
  for (const file of files) {
    const base64 = await fileToBase64(file)
    
    const result = await window.app.invoke('files:upload', {
      fileName: file.name,
      mimeType: file.type,
      fileData: base64,
      uploadedBy: 'current-user-id',
      caseId: 'case-id'
    })
    
    if (result.success) {
      console.log('File uploaded:', result.fileId)
    }
  }
}
```

### PDF Viewer Usage

```typescript
// Open PDF in viewer
const openPdf = async (fileId: string, fileName: string) => {
  const result = await window.app.invoke('files:openPdf', {
    fileId,
    fileName
  })
  
  if (result.success) {
    console.log('PDF opened in viewer')
  }
}
```

### File Management

```typescript
// Get case files
const getCaseFiles = async (caseId: string) => {
  const result = await window.app.invoke('files:getCaseFiles', {
    caseId
  })
  
  if (result.success) {
    return result.files
  }
}

// Get order PDFs
const getOrderPdfs = async (orderId: string) => {
  const result = await window.app.invoke('files:getOrderPdfs', {
    orderId
  })
  
  if (result.success) {
    return result.pdfs
  }
}
```

### React Components

```typescript
// File upload dropzone
<FileUploadDropzone
  caseId="case-id"
  onUploadComplete={(file) => console.log('Uploaded:', file)}
  onUploadError={(error) => console.error('Upload error:', error)}
  acceptedFileTypes={['.pdf', '.doc', '.docx']}
  maxFileSize={100 * 1024 * 1024}
  multiple={true}
/>

// PDF viewer
<PDFViewer
  fileId="file-id"
  fileName="document.pdf"
  onError={(error) => console.error('PDF error:', error)}
/>

// Case detail page with file management
<CaseDetailPage
  caseId="case-id"
  caseNumber="CASE-001"
  title="Sample Case"
/>
```

## Security Considerations

### File Validation

- **MIME Type Validation**: Only allowed MIME types accepted
- **File Size Limits**: Maximum file size enforcement
- **File Extension Validation**: File extension validation
- **Content Scanning**: Optional malware scanning

### Access Control

- **Role-Based Permissions**: Files access controlled by user roles
- **Case/Order Scoping**: Files scoped to specific cases/orders
- **Audit Logging**: All file operations logged
- **PII Protection**: Sensitive files protected based on user role

### Storage Security

- **Content Addressing**: Files stored by content hash
- **Temporary Files**: Temporary files cleaned up automatically
- **Access Logging**: File access logged for security
- **Encryption**: Optional file encryption at rest

## Performance Considerations

### Storage Optimization

- **Deduplication**: Identical files stored only once
- **Compression**: Optional file compression
- **Cleanup**: Automatic cleanup of orphaned files
- **Indexing**: Optimized database indexes

### Caching

- **Metadata Caching**: File metadata cached for performance
- **Content Caching**: Frequently accessed files cached
- **Query Optimization**: Optimized database queries
- **CDN Integration**: Optional CDN integration

### Scalability

- **Distributed Storage**: Support for distributed storage
- **Load Balancing**: File operations load balanced
- **Horizontal Scaling**: System scales horizontally
- **Performance Monitoring**: Performance metrics and monitoring

## Future Enhancements

### Planned Features

- **File Versioning**: File version control and history
- **Collaborative Editing**: Real-time collaborative editing
- **Advanced Search**: Full-text search within files
- **File Encryption**: End-to-end file encryption
- **Cloud Storage**: Integration with cloud storage providers
- **File Sharing**: Secure file sharing capabilities

### Performance Improvements

- **Streaming Upload**: Streaming file upload for large files
- **Parallel Processing**: Parallel file processing
- **Advanced Caching**: Redis-based caching
- **CDN Integration**: Content delivery network integration

This File Storage System provides a robust foundation for file management while maintaining high performance, security, and user experience standards!
