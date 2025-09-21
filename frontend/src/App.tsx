import React, { useState, useEffect } from "react";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [docs, setDocs] = useState<any[]>([]);

  async function upload() {
    if (!file) return alert("Choose a file");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("http://localhost:8000/ingest", { method: "POST", body: fd });
    const j = await res.json();
    alert("Uploaded: " + (j.document_id ?? JSON.stringify(j)));
    fetchDocs();
  }

  async function fetchDocs() {
    try {
      const r = await fetch("http://localhost:8000/documents");
      const j = await r.json();
      setDocs(j);
    } catch (e) {
      console.warn(e);
    }
  }

  useEffect(() => { fetchDocs(); }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>KMRL — Document Overload (starter)</h1>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button onClick={upload} style={{ marginLeft: 8 }}>Upload</button>

      <h2>Documents</h2>
      <ul>
        {docs.map((d: any) => (
          <li key={d._id}>{d.filename} — {d.size} bytes</li>
        ))}
      </ul>
    </div>
  );
}
