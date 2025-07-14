// components/AuthCallbackHandler.tsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserManager } from 'oidc-client-ts';

const userManager = new UserManager({
  authority: "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_uj0x1RCWC",
  client_id: "7nq6vuoqq12tjbv9sson7lceb3",
  redirect_uri: window.location.origin,
  response_type: "code",
  scope: "openid email phone",
});

const AuthCallbackHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const hasCode = location.search.includes("code=");
      const hasState = location.search.includes("state=");

      if (hasCode && hasState) {
        try {
          const user = await userManager.signinRedirectCallback();
          console.log("✅ Logged in user:", user);
          navigate("/logs");
        } catch (err) {
          console.error("❌ signinRedirectCallback failed:", err);
        }
      }
    };

    handleCallback();
  }, [location.search]);

  return null;
};

export default AuthCallbackHandler;
