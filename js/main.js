document.addEventListener('DOMContentLoaded', () => {
    // Only use IntersectionObserver when it's supported. On older browsers / non-supporting
    // environments (some mobile browsers or restricted contexts) we fall back to revealing
    // sections immediately so content isn't left hidden.
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.section-animate').forEach(section => observer.observe(section));
    } else {
        // graceful fallback: show everything immediately
        document.querySelectorAll('.section-animate').forEach(section => section.classList.add('visible'));
    }

    const nav = document.querySelector('.nav');
    const toggleNavState = () => {
        if (!nav) return;
        nav.classList.toggle('nav-scrolled', window.scrollY > 10);
    };
    toggleNavState();
    window.addEventListener('scroll', toggleNavState, { passive: true });

    const skillChips = document.querySelectorAll('.skill-chip');
    const skillPanels = document.querySelectorAll('.skill-panel');

    skillChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const targetId = chip.dataset.skill;
            skillChips.forEach(c => c.classList.toggle('active', c === chip));
            skillPanels.forEach(panel => panel.classList.toggle('active', panel.id === targetId));
        });
    });
});
