import React from 'react';
import './AnimatedShippingBackground.css';

export default function AnimatedShippingBackground() {
  return (
    <div className="shipping-background">
      {/* Shipping Container Outline */}
      <div className="shipping-container" />
      
      {/* Cargo Ship Silhouette */}
      <div className="cargo-ship" />
      
      {/* Truck Outline */}
      <div className="truck" />
    </div>
  );
}