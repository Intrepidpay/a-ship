import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import './SupportPage.css';
import axios from 'axios';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [searchParams] = useSearchParams();
  const faqRef = useRef(null);

  useEffect(() => {
    const faqParam = searchParams.get('faq');
    if (faqParam === 'tracking') {
      setActiveFaq(0);
      setTimeout(() => {
        faqRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const botToken = '7860817713:AAFh-V6rsefsbL-G3vKzhQPJfY-c2dxNqmw';
      const chatId = '7610053738';
      const text = `New Support Message:\n\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\nMessage: ${formData.message}`;
      
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: text
      });

      showAlert('success', 'Thank you! Your message has been sent. We will respond within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      showAlert('error', 'Message failed to send. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="support-container1">
      <div className="glass-card1">
        <div className="">
        </div>

        {alertMessage && (
          <div className={`premium-alert1 ${alertMessage.type}`}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {alertMessage.type === 'success' ? (
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="#10B981"/>
              ) : (
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#EF4444"/>
              )}
            </svg>
            <span>{alertMessage.message}</span>
          </div>
        )}

        <div className="premium-support-content">
          <h1 className="title1">Customer Support</h1>
          <p className="subtitle1">We're here to help with any questions or issues</p>

          <div className="premium-contact-methods">
            <div className="premium-method-card">
              <div className="premium-card-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" fill="#5c9dff"/>
                  <path d="M19 6L12 11L5 6H19Z" fill="#5c9dff"/>
                </svg>
                <h3>Live Support</h3>
              </div>
              <div className="premium-card-content">
                <p className="premium-contact-info">Click on the floating icon</p>
                <p className="premium-contact-hours">Available 24/7</p>
              </div>
            </div>

            <div className="premium-method-card">
              <div className="premium-card-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" fill="#5c9dff"/>
                  <path d="M19 6L12 11L5 6H19Z" fill="#5c9dff"/>
                </svg>
                <h3>Email Support</h3>
              </div>
              <div className="premium-card-content">
                <p className="premium-contact-info">support@ajetship.site</p>
                <p className="premium-contact-hours">Response within 12 hours</p>
              </div>
            </div>
          </div>

          <form className="premium-contact-form" onSubmit={handleSubmit}>
            <h2 className="form-title1">Leave a message</h2>
            
            <div className="input-group1">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input1"
                required
              />
              <label className="label1">Full Name</label>
              <div className="input-border1"></div>
            </div>
            
            <div className="input-group1">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input1"
                required
              />
              <label className="label1">Email Address</label>
              <div className="input-border1"></div>
            </div>
            
            <div className="input-group1">
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="input1"
                required
              />
              <label className="label1">Subject</label>
              <div className="input-border1"></div>
            </div>
            
            <div className="input-group1">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="premium-textarea"
                required
              />
              <label className="label1">Your Message</label>
              <div className="input-border1"></div>
            </div>
            
            <button 
              type="submit" 
              className="button1 primary1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="spinner1"></div>
              ) : (
                'Send Message'
              )}
            </button>
          </form>

          <div className="premium-faq-section" ref={faqRef}>
            <h2 className="premium-faq-title">Frequently Asked Questions</h2>
            
            <div className="premium-faq-container">
              <div 
                className={`premium-faq-item ${activeFaq === 0 ? 'active' : ''}`}
                onClick={() => toggleFaq(0)}
              >
                <div className="premium-faq-question">
                  <h3>Where can I find my tracking number?</h3>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6 9L10 13L14 9" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="premium-faq-answer">
                  <p>Your tracking number can be found on:</p>
                  <ul>
                    <li><strong>The Package:</strong> The label will contain your tracking number</li>
                    <li><strong>Account dashboard:</strong> If you created an account, check "My Shipments"</li>
                    <li><strong>Physical receipt:</strong> On the invoice received upon shipping payment</li>
                  </ul>
                  <p>If you still can't find it, contact us with your order details and we'll locate it for you.</p>
                </div>
              </div>
              
              <div 
                className={`premium-faq-item ${activeFaq === 1 ? 'active' : ''}`}
                onClick={() => toggleFaq(1)}
              >
                <div className="premium-faq-question">
                  <h3>What should I do if my package is delayed?</h3>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6 9L10 13L14 9" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="premium-faq-answer">
                  <p>Package delays can occur due to various reasons:</p>
                  <ol>
                    <li>Check the tracking information for any updates</li>
                    <li>Allow 1-2 business days beyond the estimated delivery date</li>
                    <li>Contact us if the package hasn't moved in 48 hours</li>
                    <li>For weather delays, wait until conditions improve</li>
                  </ol>
                  <p>We can initiate a trace with the carrier after 5 business days of no movement.</p>
                </div>
              </div>
              
              <div 
                className={`premium-faq-item ${activeFaq === 2 ? 'active' : ''}`}
                onClick={() => toggleFaq(2)}
              >
                <div className="premium-faq-question">
                  <h3>How do I change my delivery address?</h3>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6 9L10 13L14 9" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="premium-faq-answer">
                  <p>Address changes are possible depending on your package status:</p>
                  <ul>
                    <li><strong>Before shipment:</strong> Contact us immediately with your new address</li>
                    <li><strong>In transit:</strong> We can attempt to reroute for a fee (availability varies by carrier)</li>
                    <li><strong>Out for delivery:</strong> Changes are no longer possible</li>
                  </ul>
                  <p>Note: International shipments cannot be rerouted once processed by customs.</p>
                </div>
              </div>
              
              <div 
                className={`premium-faq-item ${activeFaq === 3 ? 'active' : ''}`}
                onClick={() => toggleFaq(3)}
              >
                <div className="premium-faq-question">
                  <h3>What are your package insurance options?</h3>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6 9L10 13L14 9" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="premium-faq-answer">
                  <p>We offer several protection options:</p>
                  <table>
                    <thead>
                      <tr>
                        <th>Coverage</th>
                        <th>Amount</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Basic</td>
                        <td>Up to $100</td>
                        <td>Free</td>
                      </tr>
                      <tr>
                        <td>Standard</td>
                        <td>Up to $1000</td>
                        <td>$49.99</td>
                      </tr>
                      <tr>
                        <td>Premium</td>
                        <td>Up to $10000</td>
                        <td>$499.99</td>
                      </tr>
                    </tbody>
                  </table>
                  <p>Claims must be filed within 14 days of delivery.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
