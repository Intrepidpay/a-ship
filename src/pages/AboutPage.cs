/* About Page Premium Styles */
.premium-about-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -4%;
  background: transparent;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.glass-card2 {
  width: 100%;
  max-width: 1000px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(86, 109, 142, 0.333);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2.5rem;
  transition: all 0.3s ease;
}


.title2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.subtitle2 {
  font-size: 1rem;
  color: #6B7280;
  margin: 0 0 2rem 0;
  line-height: 1.5;
}

/* About Sections */
.premium-about-sections {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.premium-about-section {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.premium-about-section.active {
  border-color: #5c9dff;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.1);
}

.premium-section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  cursor: pointer;
  background: #F9FAFB;
  transition: background 0.2s ease;
}

.premium-section-header:hover {
  background: #F3F4F6;
}

.premium-section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex-grow: 1;
}

.premium-chevron {
  transition: transform 0.3s ease;
}

.premium-about-section.active .premium-chevron {
  transform: rotate(180deg);
}

.premium-section-content {
  padding: 0 1.5rem;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
}

.premium-about-section.active .premium-section-content {
  padding: 1.5rem;
  max-height: 1000px;
}

.premium-section-content p {
  font-size: 1rem;
  line-height: 1.6;
  color: #4B5563;
  margin-bottom: 1.5rem;
}

/* Timeline */
.premium-timeline {
  position: relative;
  padding-left: 1.5rem;
  margin: 1.5rem 0;
}

.premium-timeline:before {
  content: '';
  position: absolute;
  left: 0.5rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #E5E7EB;
}

.premium-timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
}

.premium-timeline-year {
  font-weight: 600;
  color: #5c9dff;
  width: 4rem;
  flex-shrink: 0;
}

.premium-timeline-dot {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #5c9dff;
  margin: 0 1rem;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.premium-timeline-info {
  flex-grow: 1;
  font-size: 0.95rem;
  color: #4B5563;
}

/* Stats */
.premium-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.premium-stat-card {
  background: #F9FAFB;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.premium-stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #5c9dff;
  margin-bottom: 0.25rem;
}

.premium-stat-label {
  font-size: 0.85rem;
  color: #6B7280;
}

/* Team */
.premium-team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.premium-team-member {
  text-align: center;
}

.premium-team-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #E5E7EB;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9CA3AF;
  font-weight: 600;
}

/* Add this to your existing AboutPage.css */
.premium-team-avatar {
  /* Replace the existing .premium-team-avatar styles with these: */
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin: 0 auto 1rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Add individual team member images */
.premium-team-member:nth-child(1) .premium-team-avatar {
  background-image: url('../KeremSarp.png');
}

.premium-team-member:nth-child(2) .premium-team-avatar {
  background-image: url('https://example.com/path-to/michael-chen.jpg');
}

.premium-team-member:nth-child(3) .premium-team-avatar {
  background-image: url('https://example.com/path-to/david-rodriguez.jpg');
}

.premium-team-member:nth-child(4) .premium-team-avatar {
  background-image: url('https://example.com/path-to/emily-wilson.jpg');
}

/* Fallback styling if images don't load */
.premium-team-avatar::before {
  content: attr(data-initials);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #E5E7EB;
  color: #6B7280;
  font-weight: 600;
  border-radius: 50%;
}

.premium-team-member h4 {
  font-size: 1rem;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.premium-team-member p {
  font-size: 0.85rem;
  color: #6B7280;
  margin: 0;
}

/* Values */
.premium-values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.premium-value-card {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.premium-value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.premium-value-icon {
  width: 48px;
  height: 48px;
  background: #EEF2FF;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.premium-value-card h4 {
  font-size: 1rem;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.premium-value-card p {
  font-size: 0.9rem;
  color: #6B7280;
  margin: 0;
  line-height: 1.5;
}

/* Responsive */
/* About Page Premium Styles - Mobile Optimization */
@media (max-width: 768px) {
  .premium-about-container {
    margin-top: 1%;
    padding: 1rem;
  }

  .glass-card2 {
    width: 100% !important;
    padding: 1.5rem;
    margin-bottom: 2rem;
    border-radius: 16px;
  }

  .title2 {
    font-size: 1.5rem;
  }
  
  .subtitle2 {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .premium-about-section {
    width: 100%;
    margin-bottom: 1rem;
  }

  .premium-section-header {
    padding: 1.25rem;
  }
  
  .premium-about-section.active .premium-section-content {
    padding: 1.25rem;
  }

  .premium-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .premium-team-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .premium-values-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .premium-about-container {
    padding: 0.5rem;
    margin-top: 0;
  }

  .glass-card2 {
    padding: 1.25rem;
    border-radius: 12px;
  }

  .title2 {
    font-size: 1.4rem;
  }

  .premium-section-header {
    padding: 1rem;
    gap: 0.5rem;
  }

  .premium-section-header h2 {
    font-size: 1.1rem;
  }

  .premium-stats {
    grid-template-columns: 1fr;
  }

  .premium-team-grid {
    grid-template-columns: 1fr;
  }

  .premium-timeline {
    padding-left: 1rem;
  }

  .premium-timeline-year {
    width: 3.5rem;
  }
}

@media (max-width: 375px) {
  .glass-card2 {
    padding: 1rem;
  }

  .title2 {
    font-size: 1.3rem;
  }

  .premium-section-header {
    padding: 0.75rem;
  }

  .premium-section-header svg {
    width: 20px;
    height: 20px;
  }

  .premium-section-content {
    padding: 0 0.75rem;
  }

  .premium-about-section.active .premium-section-content {
    padding: 0.75rem;
  }

  .premium-team-avatar {
    width: 60px;
    height: 60px;
  }

  .premium-value-card {
    padding: 1rem;
  }
}