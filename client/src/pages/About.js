import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <h1 className="about-title">About Wellnessa</h1>
            <p className="about-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
        <div className="about-hero-curve"></div>
      </section>

      {/* Why Wellnessa Section */}
      <section className="why-wellnessa">
        <div className="why-wellnessa-bg">
          <div className="container">
            <div className="why-content">
              <div className="why-text">
                <h2 className="section-title white-text">Why Wellnessa?</h2>
                <p className="why-description">
                  Wellnessa offers an expert, convenient approach that will fit 
                  seamlessly into your existing workflow. Our platform provides 
                  comprehensive healthcare management solutions that enable providers 
                  to deliver personalized care while improving patient outcomes through 
                  innovative technology and streamlined processes.
                </p>
                <p className="why-description">
                  Our team of healthcare professionals and technology experts work 
                  together to create solutions that address real-world challenges 
                  in healthcare delivery and patient management.
                </p>
              </div>
              <div className="why-illustration">
                <div className="consultation-scene">
                  <div className="person person-1">
                    <div className="person-head"></div>
                    <div className="person-body"></div>
                  </div>
                  <div className="person person-2">
                    <div className="person-head"></div>
                    <div className="person-body"></div>
                  </div>
                  <div className="consultation-table"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Monitor Patient Section */}
      <section className="monitor-patient">
        <div className="container">
          <div className="monitor-content">
            <div className="monitor-illustration">
              <div className="patient-monitoring-scene">
                <div className="doctor-figure">
                  <div className="person-head"></div>
                  <div className="person-body"></div>
                </div>
                <div className="patient-bed">
                  <div className="bed-base"></div>
                  <div className="patient-figure">
                    <div className="person-head"></div>
                    <div className="person-body"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="monitor-text">
              <h2 className="section-title">Monitor patient mental health from afar</h2>
              <p className="monitor-description">
                Our comprehensive remote monitoring system allows healthcare providers 
                to track patient mental health indicators in real-time, ensuring 
                continuous care and early intervention when needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="our-values">
        <div className="values-bg">
          <div className="container">
            <h2 className="section-title white-text">Our Values</h2>
            <p className="values-subtitle white-text">What our team believes in</p>
            
            <div className="values-grid">
              <div className="value-item">
                <div className="value-icon">
                  <span>🎯</span>
                </div>
                <h3 className="value-title">Focusing in touch with our patients</h3>
                <p className="value-description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              
              <div className="value-item">
                <div className="value-icon">
                  <span>💡</span>
                </div>
                <h3 className="value-title">Focusing in touch with our patients</h3>
                <p className="value-description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              
              <div className="value-item">
                <div className="value-icon">
                  <span>🤝</span>
                </div>
                <h3 className="value-title">Focusing in touch with our patients</h3>
                <p className="value-description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              
              <div className="value-item">
                <div className="value-icon">
                  <span>🔬</span>
                </div>
                <h3 className="value-title">Focusing in touch with our patients</h3>
                <p className="value-description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              
              <div className="value-item">
                <div className="value-icon">
                  <span>❤️</span>
                </div>
                <h3 className="value-title">Focusing in touch with our patients</h3>
                <p className="value-description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="our-team">
        <div className="container">
          <h2 className="section-title">Our Team</h2>
          <div className="team-grid">
            {[1, 2, 3].map((member) => (
              <div key={member} className="team-member">
                <div className="member-photo">
                  <img src="/api/placeholder/200/200" alt="Team Member" />
                </div>
                <h4 className="member-name">Anshul Kanojia</h4>
                <p className="member-role">CEO and Founder</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-bg">
          <div className="container">
            <div className="footer-content">
              <div className="footer-links">
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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
