import React, { useState } from 'react';
import './PinAuth.css';

interface PinAuthProps {
  onAuthenticate: () => void;
}

const PinAuth: React.FC<PinAuthProps> = ({ onAuthenticate }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError('');
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const handleSubmit = () => {
    if (pin.length === 4) {
      setIsVerifying(true);
      // Import verifyPin dynamically to avoid circular dependency
      import('../firebase/authService').then(({ verifyPin }) => {
        if (verifyPin(pin)) {
          import('../firebase/authService').then(({ setAuthenticated }) => {
            setAuthenticated(true);
            onAuthenticate();
          });
        } else {
          setError('Incorrect PIN');
          setPin('');
        }
        setIsVerifying(false);
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && pin.length === 4) {
      handleSubmit();
    }
  };

  return (
    <div className="pin-auth-container">
      <div className="pin-auth-card">
        <div className="pin-auth-header">
          <div className="logo-icon">🎯</div>
          <h1>AR Navigation Admin</h1>
          <p>Enter PIN to continue</p>
        </div>

        <div className="pin-display">
          <input
            type="password"
            value={pin}
            readOnly
            placeholder="••••"
            onKeyDown={handleKeyDown}
            className="pin-input"
          />
          <div className="pin-dots">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`pin-dot ${pin[i] ? 'filled' : ''}`}>
                {pin[i] ? '●' : '○'}
              </span>
            ))}
          </div>
        </div>

        {error && <div className="pin-error">{error}</div>}

        <div className="pin-pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((num, idx) => (
            <button
              key={idx}
              className={`pin-button ${num === '' ? 'empty' : ''}`}
              onClick={() => {
                if (num === '⌫') handleDelete();
                else if (num !== '') handleNumberClick(String(num));
              }}
              disabled={num === '' || isVerifying}
            >
              {num}
            </button>
          ))}
        </div>

        <button
          className="pin-submit"
          onClick={handleSubmit}
          disabled={pin.length !== 4 || isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default PinAuth;
