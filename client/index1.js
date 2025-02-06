// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      window.scrollTo({
        top: targetElement.offsetTop - 50, // Offset for header height
        behavior: 'smooth'
      });
    });
  });

  // Testimonial slider functionality
  const testimonials = document.querySelectorAll('.testimonial-item');
  let currentTestimonialIndex = 0;

  function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
      testimonial.style.display = i === index ? 'block' : 'none';
    });
  }

  showTestimonial(currentTestimonialIndex); // Show the first testimonial

  // Automatically cycle through testimonials
  setInterval(() => {
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
    showTestimonial(currentTestimonialIndex);
  }, 5000); // Change every 5 seconds

// Select the specific button
const healthAnalysisButton = document.getElementById('health-analysis-btn');

if (healthAnalysisButton) {
  healthAnalysisButton.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1); // Remove the '#' from href
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 50, // Adjust offset for fixed header, if any
        behavior: 'smooth'
      });
    }
  });
}


  // Add functionality for the "Start Health Analysis" button to scroll to the "Get Started" section
  const startHealthAnalysisBtn = document.querySelector('.btn-primary[href="#health-analysis"]');
  const getStartedBtn = document.querySelector('.cta-btn');

  if (startHealthAnalysisBtn && getStartedBtn) {
    startHealthAnalysisBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const getStartedSection = getStartedBtn.closest('section'); // Find the section containing the Get Started button
      
      window.scrollTo({
        top: getStartedSection.offsetTop - 50, // Offset for header height
        behavior: 'smooth'
      });
    });
  }

});