# AVION.EXE Zero Data Loss Schemas

## Local Data Schema (IndexedDB)
```javascript
// Existing schema + sync metadata
const localRecord = {
  // Original data fields
  id: "unique-id",
  data: { /* original record data */ },
  
  // Sync metadata
  syncMeta: {
    lastModified: "2026-01-11T10:30:00Z",
    syncStatus: "synced" | "pending" | "failed",
    version: 1,
    deviceId: "device-uuid",
    conflictResolved: false
  }
}
```

## Cloud Backup Schema
```javascript
const cloudBackup = {
  userId: "user-auth-id",
  deviceId: "device-uuid",
  backupId: "backup-uuid",
  timestamp: "2026-01-11T10:30:00Z",
  version: "2.0.0",
  
  // Encrypted data payload
  encryptedData: "AES256-encrypted-json",
  
  // Metadata (unencrypted for conflict resolution)
  metadata: {
    recordCount: 1250,
    lastActivity: "2026-01-11T10:30:00Z",
    dataChecksum: "sha256-hash",
    schemaVersion: 4
  },
  
  // Conflict resolution
  conflictsWith: ["backup-uuid-2", "backup-uuid-3"],
  isResolved: false
}
```

## Sync Queue Schema
```javascript
const syncQueueItem = {
  id: "sync-item-uuid",
  operation: "create" | "update" | "delete",
  storeName: "dailyTasks",
  recordId: "record-id",
  data: { /* record data */ },
  timestamp: "2026-01-11T10:30:00Z",
  retryCount: 0,
  maxRetries: 3,
  status: "pending" | "syncing" | "completed" | "failed"
}
```

## Version Control Schema
```javascript
const versionRecord = {
  recordId: "original-record-id",
  versions: [
    {
      version: 1,
      timestamp: "2026-01-10T15:20:00Z",
      deviceId: "device-1",
      data: { /* snapshot of data at this version */ },
      operation: "create" | "update" | "delete"
    },
    {
      version: 2,
      timestamp: "2026-01-11T10:30:00Z",
      deviceId: "device-2",
      data: { /* updated data */ },
      operation: "update"
    }
  ],
  currentVersion: 2,
  conflictResolution: {
    hasConflict: false,
    resolvedBy: "user" | "auto",
    resolvedAt: "2026-01-11T10:35:00Z"
  }
}
```