import React, { useMemo, useState } from "react";

function DismissibleAlert({ type = "danger", message = "", onClose }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {message}
      <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose}></button>
    </div>
  );
}

function ProductInput({ index, value, onChange, onFocus }) {
  return (
    <div className="col-12 col-md-6">
      <label htmlFor={`prod-${index}`} className="form-label">
        Producto {index + 1}
      </label>
      <div className="input-group">
        <span className="input-group-text">HNL</span>
        <input
          id={`prod-${index}`}
          className="form-control"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={value}
          onChange={(e) => onChange(index, e.target.value)}
          onFocus={onFocus}
          required
        />
      </div>

    </div>
  );
}

export default function App() {

  const [prices, setPrices] = useState(["", "", "", "", ""]);
  const [alert, setAlert] = useState({ type: "danger", message: "" });
  const [results, setResults] = useState(null);

  const nf = useMemo(
    () =>
      new Intl.NumberFormat("es-HN", {
        style: "currency",
        currency: "HNL",
        maximumFractionDigits: 2,
      }),
    []
  );

  const resetAlert = () => setAlert((a) => ({ ...a, message: "" }));

  const handlePriceChange = (i, val) => {
    const next = [...prices];
    next[i] = val;
    setPrices(next);
  };

  const getDiscountPercent = (subtotal) => {
    if (subtotal >= 13000) return 40;
    if (subtotal >= 9000) return 30;
    if (subtotal >= 5000) return 20;
    if (subtotal >= 1000) return 10;
    return 0;
  };

  const validate = () => {

    for (let i = 0; i < prices.length; i++) {
      const raw = prices[i];
      if (raw === "" || raw === null) {
        return `El campo del Producto ${i + 1} no puede estar vacío.`;
      }
      const num = Number(raw);
      if (!Number.isFinite(num)) {
        return `El campo del Producto ${i + 1} debe ser un número válido.`;
      }
      if (num < 0) {
        return `El precio del Producto ${i + 1} no puede ser negativo.`;
      }
    }
    return "";
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    resetAlert();

    const error = validate();
    if (error) {
      setResults(null);
      setAlert({ type: "warning", message: error });
      return;
    }

    const nums = prices.map((p) => Number(p));
    const subtotal = nums.reduce((acc, n) => acc + n, 0);
    const pct = getDiscountPercent(subtotal);
    const discount = subtotal * (pct / 100);
    const total = subtotal - discount;

    setResults({ subtotal, pct, discount, total });
    setAlert({
      type: "success",
      message: `Cálculo realizado. Se aplicó un ${pct}% de descuento.`,
    });
  };

  const handleClear = () => {
    setPrices(["", "", "", "", ""]);
    setResults(null);
    setAlert({ type: "info", message: "Formulario reiniciado." });
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="h4 text-center mb-3">Calculadora de Descuentos — Despensa</h1>

              <DismissibleAlert
                type={alert.type}
                message={alert.message}
                onClose={resetAlert}
              />

              <form onSubmit={handleCalculate} noValidate>
                <div className="row g-3">
                  {prices.map((val, i) => (
                    <ProductInput
                      key={i}
                      index={i}
                      value={val}
                      onChange={handlePriceChange}
                      onFocus={resetAlert}
                    />
                  ))}
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button type="submit" className="btn btn-primary flex-grow-1">
                    Calcular
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={handleClear}>
                    Limpiar
                  </button>
                </div>
              </form>

              

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
