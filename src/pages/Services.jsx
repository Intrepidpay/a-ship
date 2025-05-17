import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ServicesPage.css';

const Services = () => {
  const [activeSection, setActiveSection] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Memoize sections data to prevent recreation on every render
  const sections = useMemo(() => [
    { id: 'express', title: 'Express Shipping', icon: '🚀', offset: 80 },
    { id: 'refrigerated', title: 'Refrigerated Logistics', icon: '❄️', offset: 80 },
    { id: 'customs', title: 'Customs Protection', icon: '🛡️', offset: 80 },
    { id: 'terms', title: 'Terms of Service', icon: '📜', offset: 80 },
    { id: 'shipping-policy', title: 'Shipping Policy', icon: '📦', offset: 80 },
    { id: 'privacy', title: 'Privacy Policy', icon: '🔒', offset: 80 },
    { id: 'customers', title: 'To Our Valued Customers', icon: '❤️', offset: 80 }
  ], []);

  // Handle hash navigation with precise scroll control
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      const section = sections.find(s => s.id === sectionId);
      
      if (section) {
        setActiveSection(sectionId);
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            const yOffset = section.offset || 0;
            const y = element.getBoundingClientRect().top + window.pageYOffset - yOffset;
            
            window.scrollTo({
              top: y,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    }
  }, [location, sections]); // Proper dependencies

  const toggleSection = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    if (activeSection === sectionId) {
      setActiveSection(null);
      navigate('#');
    } else {
      setActiveSection(sectionId);
      navigate(`#${sectionId}`, { replace: true });
      
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const yOffset = section.offset || 0;
          const y = element.getBoundingClientRect().top + window.pageYOffset - yOffset;
          
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
        }
      }, 120);
    }
  };

  return (
    <div className="services-container3">
      <div className="glass-card3">
        <div className="">
          
        </div>

        <div className="services-content3">
          <h1 className="title3">Our Premium Services</h1>
          <p className="subtitle3">Delivering excellence with specialized solutions</p>

          <div className="premium-services-grid">
            {sections.map((section) => (
              <div 
                key={section.id}
                className={`premium-service-card ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => toggleSection(section.id)}
              >
                <div className="premium-service-icon">{section.icon}</div>
                <h3>{section.title}</h3>
              </div>
            ))}
          </div>

          <div className="sections-container3">
            {/* Section 1: Express Shipping */}
            <section 
              id="express"
              className={`content-section3 ${activeSection === 'express' ? 'active' : ''}`}
            >
              <h2>Express Shipping Service</h2>
              <div className="section-content3">
                <p>Our Express Shipping service guarantees fast and reliable delivery for time-sensitive packages:</p>
                <ul>
                  <li><strong>Three Days Delivery:</strong> Guaranteed three days delivery</li>
                  <li><strong>Priority Handling:</strong> Your packages skip regular queues at all facilities</li>
                  <li><strong>Real-Time Tracking:</strong> Minute-by-minute updates with GPS monitoring</li>
                  <li><strong>Dedicated Support:</strong> 24/7 access to our express shipping specialists</li>
                </ul>
                <div className="premium-stats">
                  <div className="premium-stat-card">
                    <div className="premium-stat-value">98.9%</div>
                    <div className="premium-stat-label">On-time delivery rate</div>
                  </div>
                  <div className="premium-stat-card">
                    <div className="premium-stat-value">2-4 hrs</div>
                    <div className="premium-stat-label">Processing time</div>
                  </div>
                  <div className="premium-stat-card">
                    <div className="premium-stat-value">50+</div>
                    <div className="premium-stat-label">Countries served</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Refrigerated Logistics */}
            <section 
              id="refrigerated"
              className={`content-section3 ${activeSection === 'refrigerated' ? 'active' : ''}`}
            >
              <h2>Refrigerated Logistics</h2>
              <div className="section-content3">
                <p>Specialized temperature-controlled solutions for sensitive shipments:</p>
                <div className="premium-feature-grid">
                  <div className="premium-feature">
                    <h4>Precision Temperature Control</h4>
                    <p>Maintain exact temperatures from -30°C to +25°C with our advanced refrigeration units</p>
                  </div>
                  <div className="premium-feature">
                    <h4>Pharmaceutical Grade</h4>
                    <p>GDP-compliant transport for medicines and vaccines with temperature logging</p>
                  </div>
                  <div className="premium-feature">
                    <h4>Food Safety Certified</h4>
                    <p>HACCP-certified handling for perishable food items</p>
                  </div>
                  <div className="premium-feature">
                    <h4>Emergency Protocols</h4>
                    <p>Immediate response teams for temperature deviations</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Customs Protection */}
            <section 
              id="customs"
              className={`content-section3 ${activeSection === 'customs' ? 'active' : ''}`}
            >
              <h2>Customs Protection Service</h2>
              <div className="section-conten3t">
                <p>Our comprehensive approach to ensure smooth customs clearance:</p>
                <ol>
                  <li><strong>Pre-Clearance Documentation:</strong> We prepare and verify all paperwork before shipment</li>
                  <li><strong>Legal Compliance Review:</strong> Our experts ensure your items meet all regulations</li>
                  <li><strong>Dedicated Customs Brokers:</strong> Licensed professionals handle all communications</li>
                  <li><strong>Dispute Resolution:</strong> Immediate response to any customs inquiries or holds</li>
                </ol>
                <div className="premium-alert4 info">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#3B82F6"/>
                  </svg>
                  <span>Our success rate for avoiding confiscations is 99.3% across all markets</span>
                </div>
              </div>
            </section>

            {/* Section 4: Terms of Service */}
            <section 
              id="terms"
              className={`content-section3 ${activeSection === 'terms' ? 'active' : ''}`}
            >
              <h2>Terms of Service</h2>
              <div className="section-content3">
                <div className="premium-tos-section">
                  <h4> Acceptance of Terms</h4>
                  <p>
  1. <strong>Compliance</strong>: Follow all applicable laws and regulations for shipped items.<br /><br />
  2. <strong>Prohibited Items</strong>: No dangerous goods (e.g., weapons, hazardous materials).<br /><br />
  3. <strong>Accuracy</strong>: Provide correct addresses, weights, and customs documentation.<br /><br />
  4. <strong>Liability</strong>: AjetShip’s liability for lost/damaged shipments is limited to the declared value.<br /><br />
  5. <strong>Payments</strong>: Pay all fees promptly; disputes must be reported within 14 days.<br /><br />
  6. <strong>Changes</strong>: AjetShip may update terms with prior notice.
</p>
                </div>
                <div className="premium-tos-section">
                  <h4>Service Limitations</h4>
                  <p>
  - Remote locations may incur extended transit times or surcharges.<br /><br />
  - No hazardous materials<br /><br />
  - 30-day claim deadline<br /><br />
  - Delivery delays may occur
</p>
                </div>
                <div className="premium-tos-section">
                  
                </div>
                
              </div>
            </section>

            {/* Section 5: Shipping Policy */}
            <section 
              id="shipping-policy"
              className={`content-section3 ${activeSection === 'shipping-policy' ? 'active' : ''}`}
            >
              <h2>Shipping Policy</h2>
              <div className="section-content3">
                <h3>Our Commitment to You</h3>
                <p>We guarantee transparent and reliable shipping processes:</p>
                
                <div className="premium-policy-points">
                  <div className="premium-policy-point">
                    <h4>Packaging Standards</h4>
                    <p>All packages must meet our protective packaging requirements...</p>
                  </div>
                  <div className="premium-policy-point">
                    <h4>Delivery Times</h4>
                    <p>Estimated delivery windows are calculated based on origin, destination, and service level...</p>
                  </div>
                  <div className="premium-policy-point">
                    <h4>International Shipping</h4>
                    <p>Additional documentation may be required for cross-border shipments...</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6: Privacy Policy */}
            <section 
              id="privacy"
              className={`content-section3 ${activeSection === 'privacy' ? 'active' : ''}`}
            >
              <h2>Privacy Policy</h2>
              <div className="section-content3">
                <h3>Your Data Security</h3>
                <p>We are committed to protecting your personal information:</p>
                
                <div className="premium-privacy-grid">
                  <div className="premium-privacy-card">
                    <h4>Data Collected</h4>
                    <ul>
                      <li>Contact information</li>
                      <li>Payment details</li>
                      <li>Shipping history</li>
                    </ul>
                  </div>
                  <div className="premium-privacy-card">
                    <h4>How We Use It</h4>
                    <ul>
                      <li>Service fulfillment</li>
                      <li>Customer support</li>
                      <li>Service improvement</li>
                    </ul>
                  </div>
                  <div className="premium-privacy-card">
                    <h4>Your Rights</h4>
                    <ul>
                      <li>Access your data</li>
                      <li>Request corrections</li>
                      <li>Delete your account</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7: Customer Appreciation */}
            <section 
              id="customers"
              className={`content-section3 ${activeSection === 'customers' ? 'active' : ''}`}
            >
              <h2>To Our Valued Customers</h2>
              <div className="section-content3">
                <div className="premium-customer-message">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" fill="#EF4444"/>
                  </svg>
                  <h3>Thank You for Choosing AjetShip</h3>
                  <p>
                    We’re honored to serve you and will always go the extra mile to deliver excellence. Your business drives our success.
                  </p>
                 
                  <div className="premium-signature">
                    <p>With gratitude,</p>
                    <p><strong>The AjetShip Team</strong></p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;