const { useState, useEffect } = React;
const BASE_PRICE = 60000;

const PRICE_TABLE = {
  processor: { "": 0, i5: 5000, i7: 12000, i9: 25000 },
  ram: { "": 0, "8GB": 0, "16GB": 6000, "32GB": 12000 },
  storage: { "": 0, "512GB SSD": 0, "1TB SSD": 8000, "2TB HDD": 4000 },
  color: { "": 0, Silver: 0, Black: 0, Blue: 0 }, 
};


function calculateTotalPrice(cfg) {
  return (
    BASE_PRICE +
    (PRICE_TABLE.processor[cfg.processor] || 0) +
    (PRICE_TABLE.ram[cfg.ram] || 0) +
    (PRICE_TABLE.storage[cfg.storage] || 0)
  );
}


function App() {
 
  const [config, setConfig] = useState({
    processor: "",
    ram: "",
    storage: "",
    color: "Silver",
    totalPrice: BASE_PRICE,
  });


  const [saved, setSaved] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("laptop_saved_configs_v1");
      if (raw) setSaved(JSON.parse(raw));
    } catch (e) {

    }
  }, []);


  useEffect(() => {
    try {
      localStorage.setItem("laptop_saved_configs_v1", JSON.stringify(saved));
    } catch (e) {}
  }, [saved]);

  function handleChange(key, value) {
    setConfig((prev) => {
      const updated = { ...prev, [key]: value };
      updated.totalPrice = calculateTotalPrice(updated);
      return updated;
    });
  }

 
  function handleSave() {
    const snapshot = { ...config, id: editingId ?? Date.now() };
    if (editingId) {
   
      setSaved((prev) => prev.map((s) => (s.id === editingId ? snapshot : s)));
      setEditingId(null);
    } else {
    
      setSaved((prev) => [snapshot, ...prev]);
    }

  }

  function handleReset() {
    setConfig({
      processor: "",
      ram: "",
      storage: "",
      color: "Silver",
      totalPrice: BASE_PRICE,
    });
    setEditingId(null);
  }

  function handleEdit(id) {
    const toEdit = saved.find((s) => s.id === id);
    if (!toEdit) return;

    setConfig({
      processor: toEdit.processor || "",
      ram: toEdit.ram || "",
      storage: toEdit.storage || "",
      color: toEdit.color || "Silver",
      totalPrice: toEdit.totalPrice || calculateTotalPrice(toEdit),
    });
    setEditingId(id);
   
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id) {
    setSaved((prev) => prev.filter((s) => s.id !== id));
    if (editingId === id) {
      handleReset();
    }
  }

  function colorToBorder(color) {
    if (color === "Silver") return "#e5e7eb";
    if (color === "Black") return "#0f172a";
    if (color === "Blue") return "#3b82f6";
    return "#e5e7eb";
  }
  function colorToFill(color) {
    if (color === "Silver") return "#f3f4f6";
    if (color === "Black") return "#111827";
    if (color === "Blue") return "#bfdbfe";
    return "#f3f4f6";
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Laptop Customizer</h1>
        <p style={{ color: "#111110ff", marginTop: 6 }}>
          Configure processor, RAM, storage and color. Price updates live.
        </p>
      </div>

      <div className="card">
        <div className="form-row">
          <label>Processor</label>
          <select
            value={config.processor}
            onChange={(e) => handleChange("processor", e.target.value)}
          >
            <option value="">Select Processor</option>
            <option value="i5">i5 (+₹{PRICE_TABLE.processor.i5.toLocaleString()})</option>
            <option value="i7">i7 (+₹{PRICE_TABLE.processor.i7.toLocaleString()})</option>
            <option value="i9">i9 (+₹{PRICE_TABLE.processor.i9.toLocaleString()})</option>
          </select>
        </div>

        <div className="form-row">
          <label>RAM</label>
          <select value={config.ram} onChange={(e) => handleChange("ram", e.target.value)}>
            <option value="">Select RAM</option>
            <option value="8GB">8GB (+₹{PRICE_TABLE.ram["8GB"].toLocaleString()})</option>
            <option value="16GB">16GB (+₹PRICE_TABLE.ram["16GB"].toLocaleString() || "₹6,000")</option>
            <option value="32GB">32GB (+₹{PRICE_TABLE.ram["32GB"].toLocaleString()})</option>
          </select>
        </div>

        <div className="form-row">
          <label>Storage</label>
          <select value={config.storage} onChange={(e) => handleChange("storage", e.target.value)}>
            <option value="">Select Storage</option>
            <option value="512GB SSD">512GB SSD (+₹{PRICE_TABLE.storage["512GB SSD"].toLocaleString()})</option>
            <option value="1TB SSD">1TB SSD (+₹{PRICE_TABLE.storage["1TB SSD"].toLocaleString()})</option>
            <option value="2TB HDD">2TB HDD (+₹{PRICE_TABLE.storage["2TB HDD"].toLocaleString()})</option>
          </select>
        </div>

        <div className="form-row">
          <label>Color</label>
          <div className="color-controls">
            {Object.keys(PRICE_TABLE.color)
              .filter(Boolean)
              .map((c) => (
                <button
                  key={c}
                  type="button"
                  className={"color-btn " + (config.color === c ? "active" : "")}
                  onClick={() => handleChange("color", c)}
                >
                  {c}
                </button>
              ))}
          </div>
        </div>

        <div className="actions">
          <button className="btn btn-primary" onClick={handleSave}>
            {editingId ? "Update Configuration" : "Save Configuration"}
          </button>
          <button className="btn btn-ghost" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Preview</h3>

        <div
          className="preview"
          style={{ borderColor: colorToBorder(config.color), marginBottom: 12 }}
        >
          <div className="color-box" style={{ background: colorToFill(config.color) }} />
          <div className="meta">
            <div>
              <small>Processor</small>
              <div style={{ fontWeight: 700 }}>{config.processor || "—"}</div>
            </div>

            <div style={{ marginTop: 8 }}>
              <small>RAM</small>
              <div style={{ fontWeight: 700 }}>{config.ram || "—"}</div>
            </div>

            <div style={{ marginTop: 8 }}>
              <small>Storage</small>
              <div style={{ fontWeight: 700 }}>{config.storage || "—"}</div>
            </div>

            <div style={{ marginTop: 8 }}>
              <small>Color</small>
              <div style={{ fontWeight: 700 }}>{config.color}</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <small style={{ color: "#6b7280" }}>Total Price</small>
          <div style={{ fontSize: 20, fontWeight: 800 }}>₹{config.totalPrice.toLocaleString()}</div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #eef2ff", margin: "12px 0" }} />

        <h4 style={{ margin: "8px 0" }}>Saved Configurations ({saved.length})</h4>

        <div className="saved-list">
          {saved.length === 0 && <div style={{ color: "#6b7280" }}>No saved configurations yet.</div>}

          {saved.map((s) => (
            <div className="saved-item" key={s.id}>
              <div>
                <div style={{ fontWeight: 700 }}>
                  {s.processor || "—"} / {s.ram || "—"} / {s.storage || "—"}
                </div>
                <div style={{ color: "#3469d2ff", marginTop: 4 }}>Color: {s.color || "—"}</div>
                <div style={{ marginTop: 6, fontWeight: 800 }}>₹{(s.totalPrice || calculateTotalPrice(s)).toLocaleString()}</div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-ghost" onClick={() => handleEdit(s.id)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
