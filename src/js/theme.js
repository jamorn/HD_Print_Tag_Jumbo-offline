// Logo Position Calculator
function calculateLogoPositions(controlPrint) {
  const positions = {
    1: { mfgLeft: null, qrLeft: null, sirimLeft: 180 },
    2: { mfgLeft: 160, qrLeft: 295, sirimLeft: null },
    3: { mfgLeft: 75, qrLeft: 210, sirimLeft: 335 },
  };

  return positions[controlPrint] || { mfgLeft: 0, qrLeft: 0, sirimLeft: 0 };
}

function applyLogoPositions(controlPrint) {
  const logoPositions = calculateLogoPositions(controlPrint);

  if (logoPositions.mfgLeft !== null) {
    const mfgLogo = document.getElementById('mfgLogo');
    if (mfgLogo) {
      mfgLogo.style.left = `${logoPositions.mfgLeft}px`;
    }
  }

  if (logoPositions.qrLeft !== null) {
    const qrLogo = document.getElementById('qrLogo');
    if (qrLogo) {
      qrLogo.style.left = `${logoPositions.qrLeft}px`;
    }
  }

  if (logoPositions.sirimLeft !== null) {
    const sirimLogo = document.getElementById('sirimLogo');
    if (sirimLogo) {
      sirimLogo.style.left = `${logoPositions.sirimLeft}px`;
    }
  }
}

// Adjusted the positioning logic for the SIRIM logo and its associated text to ensure proper centering.
function applySirimLogoPositions() {
  const sirimLogo = document.querySelector('.sirim-logo');
  const sirimText = document.querySelector('.sirim-text');

  if (sirimLogo && sirimText) {
    const logoRect = sirimLogo.getBoundingClientRect();
    const textRect = sirimText.getBoundingClientRect();

    // Calculate the center position based on the logo dimensions
    const centerX = logoRect.left + logoRect.width / 2;

    // Adjust text position to align with the center of the logo
    sirimText.style.position = 'absolute';
    sirimText.style.left = `${centerX - textRect.width / 2}px`;
    sirimText.style.top = `${logoRect.bottom + 10}px`; // Add spacing below the logo
    sirimText.style.textAlign = 'center'; // Ensure text alignment is centered
  }
}

// Call the function after the DOM is fully loaded
window.addEventListener('load', applySirimLogoPositions);

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateLogoPositions, applyLogoPositions, applySirimLogoPositions };
}