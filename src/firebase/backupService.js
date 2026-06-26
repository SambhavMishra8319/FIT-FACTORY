import {
  collection,
  getDocs,
  doc,
  writeBatch,
  serverTimestamp,
  addDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./config";

const COLLECTIONS = [
  "members",
  "payments",
  "attendance",
  "users",
  "trainers",
  "trainerPayments",
  "personalTraining",
  "balance_sheet",
  "bca_readings",
  "steam_bookings",
  "steam_slots",
  "notifications",
  "workout_logs",
  "achievements",
  "leaderboard",
];

export async function createFirestoreBackup(onProgress, onStep) {
  const backup = {
    app: "F2 FIT FACTORY",
    version: "1.0",
    createdAt: new Date().toISOString(),
    collections: {},
    counts: {},
  };

  let completed = 0;
  const total = COLLECTIONS.length;

  onProgress?.("Starting Firestore backup...");

  for (const colName of COLLECTIONS) {
    onProgress?.(`Reading ${colName}...`);

    const snap = await getDocs(collection(db, colName));
    backup.collections[colName] = [];

    for (const docSnap of snap.docs) {
      const data = docSnap.data();

      if (colName === "members") {
        onProgress?.(
          `Backing up member: ${data.memberId || docSnap.id} - ${
            data.name || "Unknown"
          }`
        );
      }

      backup.collections[colName].push({
        id: docSnap.id,
        ...data,
      });
    }

    backup.counts[colName] = snap.size;
    completed += 1;

    onProgress?.(`✓ ${colName} backed up (${snap.size} records)`);

    onStep?.({
      completed,
      total,
      current: colName,
      count: snap.size,
    });
  }

  onProgress?.("Generating JSON backup file...");

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json" });

  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 8).replaceAll(":", "-");
  const fileName = `F2_BACKUP_${date}_${time}.json`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);

  const totalRecords = Object.values(backup.counts).reduce(
    (sum, count) => sum + count,
    0
  );

  await addDoc(collection(db, "backup_history"), {
    fileName,
    createdAt: serverTimestamp(),
    counts: backup.counts,
    totalRecords,
    totalCollections: total,
    sizeBytes: blob.size,
    type: "backup",
  });

  onProgress?.(`Download started: ${fileName}`);
  onProgress?.(`Backup completed successfully. Total records: ${totalRecords}`);

  return {
    backup,
    fileName,
    totalRecords,
    sizeBytes: blob.size,
  };
}

export async function getBackupHistory() {
  const q = query(
    collection(db, "backup_history"),
    orderBy("createdAt", "desc"),
  
  );

  const snap = await getDocs(q);

  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function restoreFirestoreBackup(backupJson, onProgress, onStep) {
  if (!backupJson?.collections) {
    throw new Error("Invalid backup file");
  }

  const entries = Object.entries(backupJson.collections);
  let completed = 0;
  let restoredRecords = 0;

  onProgress?.("Starting restore...");

  for (const [colName, docs] of entries) {
    onProgress?.(`Restoring ${colName}...`);

    let batch = writeBatch(db);
    let count = 0;

    for (const item of docs) {
      const { id, ...data } = item;
      if (!id) continue;

      if (colName === "members") {
        onProgress?.(
          `Restoring member: ${data.memberId || id} - ${
            data.name || "Unknown"
          }`
        );
      }

      const docRef = doc(db, colName, id);
      batch.set(docRef, data, { merge: true });

      count++;
      restoredRecords++;

      if (count === 400) {
        await batch.commit();
        batch = writeBatch(db);
        count = 0;
      }
    }

    if (count > 0) {
      await batch.commit();
    }

    completed++;

    onProgress?.(`✓ ${colName} restored (${docs.length} records)`);

    onStep?.({
      completed,
      total: entries.length,
      current: colName,
      count: docs.length,
    });
  }

  await addDoc(collection(db, "backup_history"), {
    fileName: "RESTORE_OPERATION",
    createdAt: serverTimestamp(),
    restored: true,
    type: "restore",
    totalCollections: entries.length,
    totalRecords: restoredRecords,
  });

  onProgress?.(`Restore completed. Total restored: ${restoredRecords}`);

  return true;
}

export function formatBytes(bytes = 0) {
  if (!bytes) return "0 B";

  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}