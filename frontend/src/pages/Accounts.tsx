import { useEffect, useState } from 'react';

interface Account {
  id: number;
  name: string;
  balance: string;
  accountType: string;
}

function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('Please log in to view your accounts.');
        }

        const response = await fetch(
          'http://localhost:5000/api/accounts',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to load accounts.');
        }

        const data = await response.json();
        setAccounts(data.accounts);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong.',
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, []);

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
            .reduce(
              (total, account) => total + Number(account.balance),
              0,
            )
            .toLocaleString('en-ZA', {
              style: 'currency',
              currency: 'ZAR',
            })}
        </h2>
        <span>{accounts.length} account(s)</span>
      </section>

      <section className="accounts-list-section">
        <h2>Your accounts</h2>

        {accounts.length === 0 ? (
          <p className="accounts-empty">
            You haven't added any accounts yet.
          </p>
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
                  {Number(account.balance).toLocaleString('en-ZA', {
                    style: 'currency',
                    currency: 'ZAR',
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
