document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for section animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    // Observe all animated sections
    document.querySelectorAll('.section-animate').forEach(section => {
        observer.observe(section);
    });

    // Add skill item click handlers
    document.querySelectorAll('.skill-item').forEach(item => {
        item.addEventListener('click', () => {
            // Toggle active class
            item.classList.toggle('active');
            
            // Close other open skills
            document.querySelectorAll('.skill-item.active').forEach(activeItem => {
                if (activeItem !== item) {
                    activeItem.classList.remove('active');
                }
            });
        });
    });
});
