import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";
import "./errorPage.css";

const ErrorPage = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon">
          <AlertCircle size={64} />
        </div>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <Link to="/" className="error-link">
          <Home size={20} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
