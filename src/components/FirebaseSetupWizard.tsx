import React, { useState } from 'react';
import './FirebaseSetupWizard.css';

interface FirebaseSetupWizardProps {
  onComplete: () => void;
}

const FirebaseSetupWizard: React.FC<FirebaseSetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  });

  const handleSave = () => {
    // Save config to localStorage
    localStorage.setItem('firebase_config', JSON.stringify(config));
    onComplete();
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="setup-wizard-overlay">
      <div className="setup-wizard">
        <div className="wizard-header">
          <h1>🔥 Firebase Setup</h1>
          <p>Configure your Firebase project</p>
        </div>

        <div className="wizard-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        {step === 1 && (
          <div className="wizard-step">
            <h2>Create Firebase Project</h2>
            <ol>
              <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
              <li>Click "Add project"</li>
              <li>Enter project name (e.g., "ar-navigation-admin")</li>
              <li>Enable Google Analytics (optional)</li>
              <li>Click "Create project"</li>
            </ol>
            <button className="btn-next" onClick={nextStep}>
              Next →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-step">
            <h2>Enable Firestore Database</h2>
            <ol>
              <li>In Firebase Console, click "Firestore Database" in left sidebar</li>
              <li>Click "Create database"</li>
              <li>Select "Start in test mode" (for development)</li>
              <li>Choose a location close to you</li>
              <li>Click "Enable"</li>
            </ol>
            <div className="wizard-actions">
              <button className="btn-secondary" onClick={prevStep}>
                ← Back
              </button>
              <button className="btn-next" onClick={nextStep}>
                Next →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-step">
            <h2>Get Firebase Config</h2>
            <ol>
              <li>In Firebase Console, click the ⚙️ icon (Project Settings)</li>
              <li>Scroll to "Your apps" section</li>
              <li>Click the web icon &lt;/&gt; to register a web app</li>
              <li>Copy the firebaseConfig object</li>
              <li>Paste the values below</li>
            </ol>

            <div className="config-form">
              {Object.keys(config).map((key) => (
                <div key={key} className="config-field">
                  <label>{key}</label>
                  <input
                    type="text"
                    value={(config as any)[key]}
                    onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                    placeholder={`Enter your ${key}`}
                  />
                </div>
              ))}
            </div>

            <div className="wizard-actions">
              <button className="btn-secondary" onClick={prevStep}>
                ← Back
              </button>
              <button className="btn-primary" onClick={handleSave}>
                ✓ Save & Continue
              </button>
            </div>
          </div>
        )}

        <div className="wizard-footer">
          <p className="help-text">
            Need help? Check the README.md or QUICKSTART.md for detailed instructions
          </p>
        </div>
      </div>
    </div>
  );
};

export default FirebaseSetupWizard;
