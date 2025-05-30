import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangePublicToken } from '../../services/bankService';
import { usePlaid } from '../../common/PlaidContext';  // Assuming you have this context

export default function OAuthHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAccessToken } = usePlaid();

  useEffect(() => {
    const processOAuth = async () => {
      const publicToken = searchParams.get('public_token');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        // Optionally show a notification here
        navigate('/expenses');
        return;
      }

      if (publicToken) {
        try {
          const accessToken = await exchangePublicToken(publicToken);

          // Store token in your context & localStorage
          setAccessToken(accessToken);
          localStorage.setItem('plaid_access_token', accessToken);

          navigate('/expenses');
        } catch (err) {
          console.error('Token exchange failed:', err);
          // Optionally show a notification here
          navigate('/expenses');
        }
      } else {
        // No token or error in URL, just navigate back
        navigate('/expenses');
      }
    };

    processOAuth();
  }, [searchParams, navigate, setAccessToken]);

  return <div>Processing bank connection...</div>;
}
