import React, { useState, useEffect } from 'react';
import './About.css';

const About = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content/about');
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
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
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <h1 className="about-title">{content.hero?.title || 'About Wellnessa'}</h1>
            <p className="about-description">
              {content.hero?.description || 'Lorem ipsum dolor sit amet...'}
            </p>
            <button className="btn btn-primary">{content.hero?.buttonText || 'Get Started'}</button>
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
                <h2 className="section-title white-text">{content.whyWellnessa?.title || 'Why Wellnessa?'}</h2>
                <p className="why-description">
                  {content.whyWellnessa?.description1 || 'Wellnessa offers an expert...'}
                </p>
                <p className="why-description">
                  {content.whyWellnessa?.description2 || 'Our team of healthcare professionals...'}
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
              <h2 className="section-title">{content.monitorPatient?.title || 'Monitor patient mental health from afar'}</h2>
              <p className="monitor-description">
                {content.monitorPatient?.description || 'Our comprehensive remote monitoring system...'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="our-values">
        <div className="values-bg">
          <div className="container">
            <h2 className="section-title white-text">{content.values?.title || 'Our Values'}</h2>
            <p className="values-subtitle white-text">{content.values?.subtitle || 'What our team believes in'}</p>
            
            <div className="values-grid">
              {(content.values?.items || []).map((value, index) => (
                <div key={index} className="value-item">
                  <div className="value-icon">
                    <span>{value.icon}</span>
                  </div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="our-team">
        <div className="container">
          <h2 className="section-title">{content.team?.title || 'Our Team'}</h2>
          <div className="team-grid">
            {(content.team?.members || []).map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-photo">
                  <img src="/api/placeholder/200/200" alt="Team Member" />
                </div>
                <h4 className="member-name">{member.name}</h4>
                <p className="member-role">{member.role}</p>
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