document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-animate').forEach(section => {
        observer.observe(section);
    });

    document.querySelectorAll('.skill-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
            document.querySelectorAll('.skill-item.active').forEach(activeItem => {
                if (activeItem !== item) {
                    activeItem.classList.remove('active');
                }
            });
        });
    });
});
