import '@testing-library/jest-dom';
import * as THREE from 'three';

// Mock matchMedia
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

// Expose THREE globally for tests that might need it without direct imports
(window as any).THREE = THREE;
