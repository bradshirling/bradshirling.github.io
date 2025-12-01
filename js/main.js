document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.section-animate').forEach(section => observer.observe(section));

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
