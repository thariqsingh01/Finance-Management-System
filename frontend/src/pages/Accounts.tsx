import { useEffect, useState } from "react";
import './Accounts.css';

interface Account {
  id: number;
  name: string;
  balance: string;
  accountType: string;
}

interface AccountType {
  id: number;
  type: string;
}

interface NewAccount {
  name: string;
  accountTypeId: string;
  balance: string;
}

function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);

  const [formData, setFormData] = useState<NewAccount>({
    name: "",
    accountTypeId: "",
    balance: "0",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view your accounts.");
        }

        const response = await fetch("http://localhost:5000/api/accounts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load accounts.");
        }

        const data = await response.json();
        setAccounts(data.accounts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();

    async function fetchAccountTypes() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to continue.");
        }

        const response = await fetch(
          "http://localhost:5000/api/account-types",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load account types.");
        }

        const data = await response.json();
        setAccountTypes(data.accountTypes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    }

    fetchAccountTypes();
  }, []);

  async function handleAddAccount(
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
        throw new Error("Please log in to add an account.");
      }

      const response = await fetch("http://localhost:5000/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          accountTypeId: Number(formData.accountTypeId),
          balance: Number(formData.balance),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add account.");
      }

      setAccounts((currentAccounts) => [...currentAccounts, data.account]);
      setFormData({
        name: "",
        accountTypeId: "",
        balance: "0",
      });
      setSuccess("Account added successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="accounts-page">Loading accounts...</main>;
  }

  if (error) {
    return <main className="accounts-page">{error}</main>;
  }

  return (
    <main className="accounts-page">
      <header className="accounts-heading">
        <div>
          <p className="accounts-eyebrow">YOUR FINANCES</p>
          <h1>Accounts</h1>
          <p>View and manage your financial accounts.</p>
        </div>
      </header>

      <section className="accounts-summary">
        <p>Total balance</p>
        <h2>
          {accounts
            .reduce((total, account) => total + Number(account.balance), 0)
            .toLocaleString("en-ZA", {
              style: "currency",
              currency: "ZAR",
            })}
        </h2>
        <span>{accounts.length} account(s)</span>
      </section>

      <section className="add-account-section">
        <h2>Add an account</h2>
        <p>Add a bank account, savings account, cash balance, or investment.</p>

        <form className="add-account-form" onSubmit={handleAddAccount}>
          <div className="form-field">
            <label htmlFor="account-name">Account name</label>
            <input
              id="account-name"
              type="text"
              placeholder="e.g. Main Bank Account"
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              required
              maxLength={100}
            />
          </div>

          <div className="form-field">
            <label htmlFor="account-type">Account type</label>
            <select
              id="account-type"
              value={formData.accountTypeId}
              onChange={(event) =>
                setFormData({ ...formData, accountTypeId: event.target.value })
              }
              required
            >
              <option value="">Select an account type</option>
              {accountTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="account-balance">Opening balance (R)</label>
            <input
              id="account-balance"
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
            {saving ? "Adding account..." : "Add account"}
          </button>
        </form>
      </section>

      <section className="accounts-list-section">
        <h2>Your accounts</h2>

        {accounts.length === 0 ? (
          <p className="accounts-empty">You haven't added any accounts yet.</p>
        ) : (
          <div className="accounts-list">
            {accounts.map((account) => (
              <article className="account-card" key={account.id}>
                <div className="account-icon">R</div>

                <div className="account-details">
                  <h3>{account.name}</h3>
                  <p>{account.accountType}</p>
                </div>

                <strong>
                  {Number(account.balance).toLocaleString("en-ZA", {
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

export default Accounts;
