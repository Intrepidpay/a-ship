import { useState } from 'react';
import './AboutPage.css';

const About = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="premium-about-container">
      <div className="glass-card2">
        <div className="">
          
        </div>

        <div className="premium-about-content">
          <h1 className="title2">About AjetShip</h1>
          <p className="subtitle2">Delivering Excellence</p>

          <div className="premium-about-sections">
            <div 
              className={`premium-about-section ${activeSection === 'story' ? 'active' : ''}`}
              onClick={() => toggleSection('story')}
            >
              <div className="premium-section-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#5c9dff"/>
                </svg>
                <h2>Our Story</h2>
                <svg className="premium-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 9L10 13L14 9" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="premium-section-content">
                <p>
                AjetShip is a logistics and shipping company founded in 2017 under its parent company Ajet Co. Specializing in freight forwarding, cargo transport, and supply chain solutions, Ajet Shipping quickly established itself as a competitive player in the maritime and logistics industry. Our company focuses on efficient, cost-effective shipping services, leveraging modern technology and strategic partnerships to serve global markets.
                </p>
                <div className="premium-timeline">
                  <div className="premium-timeline-item">
                    <div className="premium-timeline-year">2017</div>
                    <div className="premium-timeline-dot"></div>
                    <div className="premium-timeline-info">Founded by Ajet Co. </div>
                  </div>
                 
                  <div className="premium-timeline-item">
                    <div className="premium-timeline-year">2018</div>
                    <div className="premium-timeline-dot"></div>
                    <div className="premium-timeline-info">National coverage achieved</div>
                  </div>
                  <div className="premium-timeline-item">
                    <div className="premium-timeline-year">2023</div>
                    <div className="premium-timeline-dot"></div>
                    <div className="premium-timeline-info">Serving 500k+ customers annually</div>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className={`premium-about-section ${activeSection === 'mission' ? 'active' : ''}`}
              onClick={() => toggleSection('mission')}
            >
              <div className="premium-section-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM12 19C9.24 19 7 16.76 7 14C7 11.24 9.24 9 12 9C14.76 9 17 11.24 17 14C17 16.76 14.76 19 12 19ZM12 11C10.34 11 9 12.34 9 14C9 15.66 10.34 17 12 17C13.66 17 15 15.66 15 14C15 12.34 13.66 11 12 11Z" fill="#5c9dff"/>
                </svg>
                <h2>Our Mission</h2>
                <svg className="premium-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 9L10 13L14 9" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="premium-section-content">
                <p>
                  To provide fast, affordable, and reliable shipping solutions that connect people 
                  and businesses across the globe, while maintaining the highest standards of 
                  customer service and operational excellence.
                </p>
                <div className="premium-stats">
                  <div className="premium-stat-card">
                    <div className="premium-stat-value">98.9%</div>
                    <div className="premium-stat-label">On-time delivery rate</div>
                  </div>
                  <div className="premium-stat-card">
                    <div className="premium-stat-value">24/7</div>
                    <div className="premium-stat-label">Customer support</div>
                  </div>
                  <div className="premium-stat-card">
                    <div className="premium-stat-value">50+</div>
                    <div className="premium-stat-label">Countries served</div>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className={`premium-about-section ${activeSection === 'team' ? 'active' : ''}`}
              onClick={() => toggleSection('team')}
            >
              <div className="premium-section-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 0 14.17 0 16.5V18C0 18.55 0.45 19 1 19H15C15.55 19 16 18.55 16 18V16.5C16 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V18C17 18.35 16.93 18.69 16.82 19H23C23.55 19 24 18.55 24 18V16.5C24 14.17 18.33 13 16 13Z" fill="#5c9dff"/>
                </svg>
                <h2>Our Team</h2>
                <svg className="premium-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 9L10 13L14 9" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="premium-section-content">
                <p>
                  AjetShip's success is built on the dedication of our team members. From our 
                  customer service representatives to our logistics experts and delivery personnel, 
                  every member of our team plays a vital role in ensuring your packages arrive 
                  safely and on time.
                </p>
                <div className="premium-team-grid">
                  <div className="premium-team-member">
                    <div className="premium-team-avatar"></div>
                    <h4>Kerem Sarp</h4>
                    <p>CEO</p>
                  </div>
                  <div className="premium-team-member">
                    <div className="premium-team-avatar"></div>
                    <h4>Mert Yuzsever</h4>
                    <p>COO</p>
                  </div>
                  <div className="premium-team-member">
                    <div className="premium-team-avatar"></div>
                    <h4>Emily Hampton</h4>
                    <p>Head of Logistics</p>
                  </div>
                  <div className="premium-team-member">
                    <div className="premium-team-avatar"></div>
                    <h4> Altan Erdoğan</h4>
                    <p>Customer Experience</p>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className={`premium-about-section ${activeSection === 'values' ? 'active' : ''}`}
              onClick={() => toggleSection('values')}
            >
              <div className="premium-section-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM18 11.09C18 15.09 15.45 18.79 12 19.92C8.55 18.79 6 15.1 6 11.09V6.3L12 4.19L18 6.3V11.09ZM12 7C10.34 7 9 8.34 9 10C9 11.66 10.34 13 12 13C13.66 13 15 11.66 15 10C15 8.34 13.66 7 12 7ZM12 11C11.45 11 11 10.55 11 10C11 9.45 11.45 9 12 9C12.55 9 13 9.45 13 10C13 10.55 12.55 11 12 11Z" fill="#5c9dff"/>
                </svg>
                <h2>Our Values</h2>
                <svg className="premium-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 9L10 13L14 9" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="premium-section-content">
                <div className="premium-values-grid">
                  <div className="premium-value-card">
                    <div className="premium-value-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM12 19C9.24 19 7 16.76 7 14C7 11.24 9.24 9 12 9C14.76 9 17 11.24 17 14C17 16.76 14.76 19 12 19ZM12 11C10.34 11 9 12.34 9 14C9 15.66 10.34 17 12 17C13.66 17 15 15.66 15 14C15 12.34 13.66 11 12 11Z" fill="#5c9dff"/>
                      </svg>
                    </div>
                    <h4>Reliability</h4>
                    <p>We deliver what we promise, when we promise it.</p>
                  </div>
                  <div className="premium-value-card">
                    <div className="premium-value-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#5c9dff"/>
                      </svg>
                    </div>
                    <h4>Speed</h4>
                    <p>We optimize every step of our process for fastest delivery.</p>
                  </div>
                  <div className="premium-value-card">
                    <div className="premium-value-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#5c9dff"/>
                      </svg>
                    </div>
                    <h4>Transparency</h4>
                    <p>We keep you informed every step of the way.</p>
                  </div>
                  <div className="premium-value-card">
                    <div className="premium-value-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM7 13.5C7 12.67 7.67 12 8.5 12C9.33 12 10 12.67 10 13.5C10 14.33 9.33 15 8.5 15C7.67 15 7 14.33 7 13.5ZM15.5 15C14.67 15 14 14.33 14 13.5C14 12.67 14.67 12 15.5 12C16.33 12 17 12.67 17 13.5C17 14.33 16.33 15 15.5 15ZM18 10.5C18 9.67 17.33 9 16.5 9C15.67 9 15 9.67 15 10.5C15 11.33 15.67 12 16.5 12C17.33 12 18 11.33 18 10.5Z" fill="#5c9dff"/>
                      </svg>
                    </div>
                    <h4>Customer Focus</h4>
                    <p>Your satisfaction is our top priority.</p>
                  </div>
                  <div className="premium-value-card">
                    <div className="premium-value-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3C7.05 3 3 7.05 3 12C3 16.95 7.05 21 12 21C16.95 21 21 16.95 21 12C21 7.05 16.95 3 12 3ZM12 19C8.14 19 5 15.86 5 12C5 8.14 8.14 5 12 5C15.86 5 19 8.14 19 12C19 15.86 15.86 19 12 19ZM13 17H11V15H13V17ZM15.07 7.75L14.17 8.67C13.45 9.54 13 10.67 13 12H11V11.5C11 10.42 11.45 9.35 12.17 8.67L13.41 7.41C13.78 7.05 14 6.55 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6H8C8 3.79 9.79 2 12 2C14.21 2 16 3.79 16 6C16 6.88 15.64 7.68 15.07 8.25Z" fill="#5c9dff"/>
                      </svg>
                    </div>
                    <h4>Innovation</h4>
                    <p>We continuously improve our services through technology.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
