import { useState } from 'react';
import { ThemeProvider } from './ThemeContext';
import HiringWizard from './components/wizard/HiringWizard';
import About from './components/About';

function App() {
  const [showAbout, setShowAbout] = useState(false);

  const handleNavigateToAbout = () => {
    setShowAbout(true);
  };

  const handleBackFromAbout = () => {
    setShowAbout(false);
  };

  return (
    <ThemeProvider>
      {showAbout ? (
        <About onBack={handleBackFromAbout} />
      ) : (
        <HiringWizard />
      )}
    </ThemeProvider>
  );
}

export default App;
