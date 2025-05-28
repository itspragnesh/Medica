import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { AuthContext } from '../App';

const Blog = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  // State to track which blog post is expanded
  const [expandedPost, setExpandedPost] = useState(null);

  // Toggle function for expanding/collapsing blog posts
  const togglePost = (index) => {
    setExpandedPost(expandedPost === index ? null : index);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setUser(null);
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Sample blog posts data
  const blogPosts = [
    {
      title: "5 Tips for a Healthier Morning Routine",
      excerpt: "Start your day right with these simple tips to boost energy and productivity.",
      fullContent: (
        <div className="blog-post-detail">
          <h2>5 Tips for a Healthier Morning Routine</h2>
          <p>A consistent morning routine can set the tone for a productive day. Here are five tips to make your mornings healthier:</p>
          <h3>1. Wake Up at the Same Time</h3>
          <p>Consistency helps regulate your body clock. Aim to wake up at the same time every day, even on weekends.</p>
          <h3>2. Hydrate First Thing</h3>
          <p>Drink a glass of water upon waking to rehydrate your body after a night’s sleep.</p>
          <h3>3. Incorporate Movement</h3>
          <p>Do a quick 5-minute stretch or a short walk to get your blood flowing and energize your body.</p>
          <h3>4. Eat a Nutritious Breakfast</h3>
          <p>Opt for a balanced meal with protein, healthy fats, and complex carbs, like oatmeal with nuts and berries.</p>
          <h3>5. Plan Your Day</h3>
          <p>Take a few minutes to review your tasks and set goals, helping you feel organized and focused.</p>
          <p>With these tips, your mornings can become a powerful start to a healthier lifestyle.</p>
        </div>
      )
    },
    {
      title: "How to Stay Active Without a Gym",
      excerpt: "You don’t need a gym to stay fit. Learn easy ways to incorporate exercise into your daily life.",
      fullContent: (
        <div className="blog-post-detail">
          <h2>How to Stay Active Without a Gym</h2>
          <p>Staying active is key to good health, and you don’t need a gym membership to do it. Here are five ways to stay fit:</p>
          <h3>1. Walk More</h3>
          <p>Take the stairs, walk to nearby errands, or go for a brisk evening stroll to get your steps in.</p>
          <h3>2. Use Bodyweight Exercises</h3>
          <p>Do push-ups, squats, and lunges at home—no equipment needed.</p>
          <h3>3. Try Outdoor Activities</h3>
          <p>Go hiking, biking, or jogging in a local park to enjoy nature while staying active.</p>
          <h3>4. Join a Sports Group</h3>
          <p>Play soccer, basketball, or frisbee with friends for a fun way to exercise.</p>
          <h3>5. Use Online Workouts</h3>
          <p>Follow free workout videos on YouTube for guided exercises you can do anywhere.</p>
          <p>Staying active without a gym is all about creativity and consistency!</p>
        </div>
      )
    },
    {
      title: "Simple Ways to Reduce Stress Daily",
      excerpt: "Feeling overwhelmed? Discover practical tips to manage stress and find calm in your day.",
      fullContent: (
        <div className="blog-post-detail">
          <h2>Simple Ways to Reduce Stress Daily</h2>
          <p>Stress can take a toll on your health, but small changes can make a big difference. Here are five tips to reduce stress:</p>
          <h3>1. Practice Deep Breathing</h3>
          <p>Take 5 minutes to breathe deeply—inhale for 4 seconds, hold for 4, exhale for 4.</p>
          <h3>2. Take Short Breaks</h3>
          <p>Step away from your work every hour to stretch or clear your mind.</p>
          <h3>3. Stay Organized</h3>
          <p>Use a planner to manage tasks and avoid last-minute stress.</p>
          <h3>4. Connect with Loved Ones</h3>
          <p>Call a friend or family member to chat and feel supported.</p>
          <h3>5. Unplug from Technology</h3>
          <p>Take a break from screens and spend time in nature or reading a book.</p>
          <p>These simple steps can help you manage stress and improve your well-being.</p>
        </div>
      )
    },
    {
      title: "5 Foods to Boost Your Immune System",
      excerpt: "Support your body’s defenses with these nutrient-rich foods to stay healthy.",
      fullContent: (
        <div className="blog-post-detail">
          <h2>5 Foods to Boost Your Immune System</h2>
          <p>Your diet plays a big role in keeping your immune system strong. Here are five foods to include:</p>
          <h3>1. Citrus Fruits</h3>
          <p>Oranges, grapefruits, and lemons are high in vitamin C, which supports immune function.</p>
          <h3>2. Garlic</h3>
          <p>Garlic has natural antimicrobial properties that can help fight infections.</p>
          <h3>3. Yogurt</h3>
          <p>Choose plain yogurt with live cultures to support gut health, which is linked to immunity.</p>
          <h3>4. Spinach</h3>
          <p>Rich in vitamins and antioxidants, spinach helps your body fight off illness.</p>
          <h3>5. Nuts and Seeds</h3>
          <p>Almonds and sunflower seeds are high in vitamin E, which boosts immune response.</p>
          <p>Add these foods to your diet to give your immune system a natural boost.</p>
        </div>
      )
    },
    {
      title: "Tips for Better Sleep Habits",
      excerpt: "Struggling to sleep? These tips will help you create a better nighttime routine.",
      fullContent: (
        <div className="blog-post-detail">
          <h2>Tips for Better Sleep Habits</h2>
          <p>Quality sleep is essential for health and productivity. Here are five tips to improve your sleep habits:</p>
          <h3>1. Set a Consistent Bedtime</h3>
          <p>Go to bed at the same time every night to regulate your sleep cycle.</p>
          <h3>2. Limit Screen Time</h3>
          <p>Avoid screens an hour before bed to reduce blue light exposure.</p>
          <h3>3. Create a Calming Routine</h3>
          <p>Read a book or meditate to relax your mind before sleep.</p>
          <h3>4. Keep Your Room Dark and Cool</h3>
          <p>Use blackout curtains and set your thermostat to 60-67°F (15-19°C) for optimal sleep.</p>
          <h3>5. Avoid Caffeine Late in the Day</h3>
          <p>Skip coffee or tea after 2 PM to ensure it doesn’t disrupt your sleep.</p>
          <p>Better sleep habits can lead to more restful nights and energized days.</p>
        </div>
      )
    },
    {
      title: "5 Ways to Improve Your Mental Well-Being",
      excerpt: "Take care of your mind with these simple strategies to enhance mental health.",
      fullContent: (
        <div className="blog-post-detail">
          <h2>5 Ways to Improve Your Mental Well-Being</h2>
          <p>Mental health is just as important as physical health. Here are five ways to nurture your mental well-being:</p>
          <h3>1. Practice Gratitude</h3>
          <p>Each day, write down three things you’re thankful for to foster a positive mindset.</p>
          <h3>2. Stay Connected</h3>
          <p>Spend time with friends or family, even virtually, to combat loneliness and build support networks.</p>
          <h3>3. Engage in Physical Activity</h3>
          <p>Exercise, like a 20-minute walk, can boost endorphins and reduce stress.</p>
          <h3>4. Practice Mindfulness</h3>
          <p>Try meditation or deep breathing for 5 minutes daily to stay present and reduce anxiety.</p>
          <h3>5. Get Quality Sleep</h3>
          <p>Aim for 7-8 hours of sleep per night to allow your brain to recharge and process emotions.</p>
          <p>Incorporating these habits can help you maintain a healthier, happier mind.</p>
        </div>
      )
    }
  ];

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <Link to="/">Medica</Link>
          {user && (
            <span className="user-greeting" aria-label={`Welcome ${user.name || user.email.split('@')[0]}`}>
              Hello,&nbsp;
              <span className="user-name">{user.name || user.email.split('@')[0]}</span>!
            </span>
          )}
        </div>
        <ul className="nav-links">
          {['Home', 'Pharma', 'MedicAIl', 'Appointments', 'Blog Resources', 'About Us', 'Contact Us'].map((link, idx) => (
            <li key={idx}>
              <Link to={`/${link.toLowerCase().replace(/\s/g, '-')}`}>{link}</Link>
            </li>
          ))}
          <li>
            {user ? (
              <button onClick={handleLogout} className="login-btn">Logout</button>
            ) : (
              <Link to="/login" className="login-btn">Login</Link>
            )}
          </li>
        </ul>
      </nav>

      {/* Blog Header Section */}
      <section className="blog-header">
        <div className="hero1-overlay">
          <div className="hero1-content">
            <h1>Blog Resources</h1>
            <p>Explore health tips, insights, and advice to help you live a healthier life.</p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="blog-posts">
        <h2>Latest Blog Posts</h2>
        <div className="blog-cards">
          {blogPosts.map((post, idx) => (
            <div key={idx} className="blog-card">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <button
                className="btn"
                onClick={() => togglePost(idx)}
              >
                {expandedPost === idx ? 'Read Less' : 'Read More'}
              </button>
              {expandedPost === idx && post.fullContent}
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-top">
          <p>© 2025 Medica. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/about-us">About Us</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact-us">Contact</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Connect with us:</p>
          <div className="social-icons">
            <a href="https://www.facebook.com/pragnesh.reddy.96" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com/praxx.9/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.linkedin.com/in/pragnesh-reddy-g-014242255/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Blog;