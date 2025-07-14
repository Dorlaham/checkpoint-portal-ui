import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const authConfig = {
  authority: "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_uj0x1RCWC",
  client_id: "7nq6vuoqq12tjbv9sson7lceb3",
  redirect_uri: window.location.origin,
  response_type: "code",
  scope: "openid email phone",
};

createRoot(document.getElementById("root")!).render(
    <App />
);
