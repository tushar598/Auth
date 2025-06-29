// Add some interactive effects
document.addEventListener("DOMContentLoaded", function () {
  // Trigger celebration animation
  setTimeout(() => {
    const particles = document.querySelectorAll(".particle");
    particles.forEach((particle, index) => {
      setTimeout(() => {
        particle.style.animationPlayState = "running";
      }, index * 100);
    });
  }, 1000);
});

// Add hover effects to the success container
const container = document.querySelector(".success-container");
container.addEventListener("mouseenter", function () {
  this.style.transform = "translateY(-5px)";
  this.style.boxShadow = "0 35px 70px rgba(0, 0, 0, 0.4)";
});

container.addEventListener("mouseleave", function () {
  this.style.transform = "translateY(0)";
  this.style.boxShadow = "0 30px 60px rgba(0, 0, 0, 0.3)";
});
