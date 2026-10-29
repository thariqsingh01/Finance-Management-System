import { useEffect, useState } from "react";
import './Transactions.css';

interface Transactions {
  id: number;
  name: string;
  balance: string;
  TransactionsType: string;
}

interface Categories{
    id: number;
    category: string;
}

interface Statuses{
    id: number;
    status: string;
}

interface NewTransactions{
    category_id: number;
    amount: number;
    date: Date;
    description: string;
    notes: string;
    status_id: number;
}

interface Account_Transactions{
    id: number;
    Transactions_id: number;
    transaction_id: number;
    Transactions_role_id: number;
    transaction_type: number;   
}




//----------------------------------------------------------------------------------------------------


function Transactions() {
  const [transactions, settransactions] = useState<Transactions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<NewTransactions>({
    category_id: 0,
    amount: 0,
    date: new Date(),
    description: "",
    notes: "",
    status_id: 0, 
  });

  //const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchtransactions() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view your transactions.");
        }

        const response = await fetch("http://localhost:5000/api/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load transactions.");
        }

        const data = await response.json();
        settransactions(data.transactions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchtransactions();

    async function fetchTransactionsTypes() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to continue.");
        }

        const statuses = await fetch(
          "http://localhost:5000/api/statuses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const categories = await fetch(
          "http://localhost:5000/api/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!statuses.ok) {
          throw new Error("Failed to load statuses.");
        }

        if (!categories.ok) {
          throw new Error("Failed to load categories.");
        }

        const data = await statuses.json();
        setTransactionsTypes(data.TransactionsTypes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    }

    fetchTransactionsTypes();
  }, []);

  async function handleAddTransactions(
    event: Parameters<
      NonNullable<import("react").ComponentProps<"form">["onSubmit"]>
    >[0],
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in to add an Transactions.");
      }

      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          TransactionsTypeId: Number(formData.TransactionsTypeId),
          balance: Number(formData.balance),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add Transactions.");
      }

      settransactions((currenttransactions) => [...currenttransactions, data.Transactions]);
      setFormData({
        name: "",
        TransactionsTypeId: "",
        balance: "0",
      });
      setSuccess("Transactions added successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="transactions-page">Loading transactions...</main>;
  }

  if (error) {
    return <main className="transactions-page">{error}</main>;
  }

  return (
    <main className="transactions-page">
      <header className="transactions-heading">
        <div>
          <p className="transactions-eyebrow">YOUR FINANCES</p>
          <h1>transactions</h1>
          <p>View and manage your financial transactions.</p>
        </div>
      </header>

      {/* <section className="transactions-summary">
        <p>Total balance</p>
        <h2>
          {transactions
            .reduce((total, Transactions) => total + Number(Transactions.balance), 0)
            .toLocaleString("en-ZA", {
              style: "currency",
              currency: "ZAR",
            })}
        </h2>
        <span>{transactions.length} Transactions(s)</span>
      </section> */}

      <section className="add-Transactions-section">
        <h2>Add a transaction</h2>
        <p>Add an income or expense.</p>

        <form className="add-Transactions-form" onSubmit={handleAddTransactions}>
          <div className="form-field">
            <label htmlFor="Transactions-name">Transactions name</label>
            <input
              id="Transactions-name"
              type="text"
              placeholder="e.g. Main Bank Transactions"
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              required
              maxLength={100}
            />
          </div>

          <div className="form-field">
            <label htmlFor="Transactions-type">Transactions type</label>
            <select
              id="Transactions-type"
              value={formData.TransactionsTypeId}
              onChange={(event) =>
                setFormData({ ...formData, TransactionsTypeId: event.target.value })
              }
              required
            >
              <option value="">Select an Transactions type</option>
              {TransactionsTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="Transactions-balance">Opening balance (R)</label>
            <input
              id="Transactions-balance"
              type="number"
              min="0"
              max="9999999999999.99"
              step="0.01"
              value={formData.balance}
              onChange={(event) =>
                setFormData({ ...formData, balance: event.target.value })
              }
              required
            />
          </div>

          {success && <p className="form-success">{success}</p>}

          <button type="submit" disabled={saving}>
            {saving ? "Adding Transactions..." : "Add Transactions"}
          </button>
        </form>
      </section>

      <section className="transactions-list-section">
        <h2>Your transactions</h2>

        {transactions.length === 0 ? (
          <p className="transactions-empty">You haven't added any transactions yet.</p>
        ) : (
          <div className="transactions-list">
            {transactions.map((Transactions) => (
              <article className="Transactions-card" key={Transactions.id}>
                <div className="Transactions-icon">R</div>

                <div className="Transactions-details">
                  <h3>{Transactions.name}</h3>
                  <p>{Transactions.TransactionsType}</p>
                </div>

                <strong>
                  {Number(Transactions.balance).toLocaleString("en-ZA", {
                    style: "currency",
                    currency: "ZAR",
                  })}
                </strong>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Transactions;
