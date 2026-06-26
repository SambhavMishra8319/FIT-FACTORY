import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  createFirestoreBackup,
  getBackupHistory,
  restoreFirestoreBackup,
  formatBytes,
} from "../../firebase/backupService";
import "../../styles/backup.css";

export default function Backup() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoreFile, setRestoreFile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
    current: "",
    count: 0,
  });

  function addLog(message) {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${time}] ${message}`]);
  }

  async function loadHistory() {
    try {
      const data = await getBackupHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load backup history");
    }
  }

  async function handleCreateBackup() {
    try {
      setLoading(true);
      setLogs([]);
      setProgress({
        completed: 0,
        total: 0,
        current: "",
        count: 0,
      });

      const result = await createFirestoreBackup(addLog, setProgress);

      toast.success(`Backup created: ${result.fileName}`);
      await loadHistory();
    } catch (err) {
      console.error(err);
      addLog(`ERROR: ${err.message}`);
      toast.error("Backup failed");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    setRestoreFile(file || null);

    if (file) {
      addLog(`Selected restore file: ${file.name}`);
    }
  }

  async function handleRestore() {
    if (!restoreFile) {
      toast.error("Please select backup JSON file");
      return;
    }

    const confirmRestore = window.confirm(
      "Are you sure? This will restore data into Firestore. Existing documents with same ID will be updated. Extra current documents will NOT be deleted."
    );

    if (!confirmRestore) return;

    try {
      setLoading(true);
      setLogs([]);
      setProgress({
        completed: 0,
        total: 0,
        current: "",
        count: 0,
      });

      addLog(`Reading file: ${restoreFile.name}`);

      const text = await restoreFile.text();
      const json = JSON.parse(text);

      await restoreFirestoreBackup(json, addLog, setProgress);

      toast.success("Backup restored successfully");
      setRestoreFile(null);
      await loadHistory();
    } catch (err) {
      console.error(err);
      addLog(`ERROR: ${err.message}`);
      toast.error("Restore failed. Invalid file or Firestore error.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  const latestBackup = useMemo(() => {
    return history.find((item) => item.type === "backup" || !item.restored);
  }, [history]);

  const progressPercent = progress.total
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  return (
    <div className="backup-page">
      <h1 className="backup-title">Backup & Restore</h1>

      <p className="backup-subtitle">
        Download full Firestore backup and restore it later if data is lost.
      </p>

      <div className="backup-cards">
        <div className="backup-card">
          <p className="backup-card-label">Last Backup</p>
          <h2 className="backup-card-value">
            {latestBackup?.createdAt?.toDate
              ? latestBackup.createdAt.toDate().toLocaleString()
              : "No backup yet"}
          </h2>
        </div>

        <div className="backup-card">
          <p className="backup-card-label">Total Records</p>
          <h2 className="backup-card-value">
            {latestBackup?.totalRecords || 0}
          </h2>
        </div>

        <div className="backup-card">
          <p className="backup-card-label">Backup Size</p>
          <h2 className="backup-card-value">
            {formatBytes(latestBackup?.sizeBytes || 0)}
          </h2>
        </div>
      </div>

      <div className="backup-section">
        <h2>Create Backup</h2>

        <button
          onClick={handleCreateBackup}
          disabled={loading}
          className="backup-btn backup-btn-primary"
        >
          {loading ? "Working..." : "Download Full Backup"}
        </button>

        <p className="backup-note">
          Save this JSON file in your laptop and Google Drive.
        </p>

        {progress.total > 0 && (
          <div className="backup-progress-box">
            <div className="backup-progress-info">
              <span>
                {progress.completed} / {progress.total} collections completed
              </span>
              <span>{progressPercent}%</span>
            </div>

            <div className="backup-progress-bar">
              <div
                className="backup-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {progress.current && (
              <p className="backup-current">
                Current: {progress.current} ({progress.count} records)
              </p>
            )}
          </div>
        )}

        {logs.length > 0 && (
          <div className="backup-log">
            {logs.map((log, index) => (
              <div key={`${log}-${index}`}>{log}</div>
            ))}
          </div>
        )}
      </div>

      <div className="backup-section">
        <h2>Restore Backup</h2>

        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="backup-file-input"
          disabled={loading}
        />

        <button
          onClick={handleRestore}
          disabled={loading || !restoreFile}
          className="backup-btn backup-btn-danger"
        >
          {loading ? "Working..." : "Restore Backup"}
        </button>

        <p className="backup-warning">
          Restore is merge-safe. It updates/adds documents but does not delete
          extra current data.
        </p>
      </div>

      <div className="backup-section">
        <h2>Backup History</h2>

        <div className="backup-table-wrap">
          <table className="backup-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>File</th>
                <th>Records</th>
                <th>Size</th>
                <th>Type</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.createdAt?.toDate
                      ? item.createdAt.toDate().toLocaleString()
                      : "-"}
                  </td>

                  <td>{item.fileName || "-"}</td>

                  <td>{item.totalRecords || "-"}</td>

                  <td>{formatBytes(item.sizeBytes || 0)}</td>

                  <td>
                    {item.restored || item.type === "restore" ? (
                      <span className="backup-type-restore">Restore</span>
                    ) : (
                      <span className="backup-type-backup">Backup</span>
                    )}
                  </td>
                </tr>
              ))}

              {history.length === 0 && (
                <tr>
                  <td colSpan="5">No backup history found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}