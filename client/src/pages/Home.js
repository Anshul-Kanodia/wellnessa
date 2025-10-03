import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content/home');
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error('Error fetching home content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!content) {
    return <div className="error">Failed to load content</div>;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-logo">
            <div className="logo-placeholder">
              <span className="logo-icon">🏥</span>
              <h1 className="hero-title">{content.hero?.title || 'Wellnessa'}</h1>
            </div>
          </div>
          <p className="hero-subtitle">
            {content.hero?.subtitle || 'Your comprehensive healthcare management platform'}
            </p>
        </div>
      </section>

      {/* Accreditations Section */}
      <section className="accreditations">
        <div className="section-container">
          <h2 className="section-title">{content.accreditations?.title || 'Accreditations'}</h2>
          <div className="accreditation-badges">
            {[1, 2, 3, 4, 5].map((item, index) => (
              <div key={item} className={`badge badge-${index + 1}`}></div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Product Section */}
      <section className="product-section">
        <div className="section-container">
          <div className="product-content">
            <div className="product-text">
              <h2>{content.product?.title || 'Our Product'}</h2>
              <p className="product-description">
                {content.product?.description1 || 'Comprehensive digital health platform...'}
              </p>
              <p className="product-description">
                {content.product?.description2 || 'Our platform integrates seamlessly...'}
              </p>
            </div>
            <div className="product-visual">
              <div className="device-mockup">
                <div className="screens">
                  <div className="screen"></div>
                  <div className="screen"></div>
                  <div className="screen"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-container">
          <h2 className="section-title">{content.howItWorks?.title || 'How it works'}</h2>
          <p className="section-subtitle">{content.howItWorks?.subtitle || 'Step-by-step implementation'}</p>
          
          <div className="steps">
            {(content.howItWorks?.steps || []).map((step) => (
              <div key={step.number} className="step">
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="section-container">
          <h2 className="section-title">{content.testimonials?.title || 'Testimonials'}</h2>
          <div className="testimonial-grid">
            {(content.testimonials?.items || []).map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-avatar"></div>
                <h4 className="testimonial-name">{testimonial.name}</h4>
                <p className="testimonial-role">{testimonial.role}</p>
                <p className="testimonial-text">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="section-container">
          <div className="footer-content">
            <div className="footer-column">
              <a href="#" className="footer-link">Home</a>
              <a href="#" className="footer-link">About Us</a>
            </div>
            <div className="footer-column">
              <a href="#" className="footer-link">Contact Us</a>
              <a href="#" className="footer-link">Dashboard</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;