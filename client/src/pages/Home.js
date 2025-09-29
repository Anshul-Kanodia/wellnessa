import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <h1 className="hero-title">Wellnessa</h1>
          <p className="hero-subtitle">
            Your comprehensive healthcare management platform for better patient outcomes
          </p>
        </div>
      </section>

      {/* Accreditations Section */}
      <section className="accreditations">
        <div className="section-container">
          <h2 className="section-title">Accreditations</h2>
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
              <h2>Our Product</h2>
              <p className="product-description">
                Comprehensive digital health platform that enables healthcare providers to deliver 
                personalized care, track patient progress, and improve health outcomes through 
                innovative technology solutions.
              </p>
              <p className="product-description">
                Our platform integrates seamlessly with existing healthcare systems to provide 
                real-time insights and streamlined workflows for better patient care.
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
          <h2 className="section-title">How it works</h2>
          <p className="section-subtitle">Step-by-step implementation</p>
          
          <div className="steps">
            {[
              { number: 1, title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
              { number: 2, title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
              { number: 3, title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
              { number: 4, title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
              { number: 5, title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." }
            ].map((step) => (
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
          <h2 className="section-title">Testimonials</h2>
          <div className="testimonial-grid">
            {[1, 2, 3].map((item) => (
              <div key={item} className="testimonial-card">
                <div className="testimonial-avatar"></div>
                <h4 className="testimonial-name">Anshul Kanodia</h4>
                <p className="testimonial-role">CEO and Founder</p>
                <p className="testimonial-text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
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
