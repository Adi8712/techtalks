document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const htmlElement = document.documentElement;
        
        if (htmlElement.classList.contains('dark-mode')) {
            htmlElement.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('theme', 'dark');
        }
    });
});