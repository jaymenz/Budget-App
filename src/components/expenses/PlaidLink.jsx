// src/components/expenses/PlaidLink.jsx
import { usePlaidLink } from 'react-plaid-link';

const PlaidLink = ({ linkToken, onSuccess }) => {
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess, // Make sure this is passed from parent
    onExit: (err, metadata) => {
      console.log("User exited Plaid:", err, metadata);
    },
  });

  return (
    <button onClick={() => open()} disabled={!ready}>
      Connect Bank
    </button>
  );
};

export default PlaidLink;