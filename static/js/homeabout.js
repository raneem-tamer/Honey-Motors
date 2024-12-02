// Ensure DOM is fully loaded before executing
document.addEventListener("DOMContentLoaded", () => {
    // Navigation buttons for redirecting between pages
    const navigationContainer = document.createElement('div');
    navigationContainer.classList.add('navigation-buttons');

    const pages = [
        { name: "Home", link: "/" },
        { name: "Contact Us", link: "/contact" },
        { name: "Help & FAQs", link: "/help" },
        { name: "Our Services", link: "/services" }
    ];

    // Create navigation buttons dynamically
    pages.forEach(page => {
        const button = document.createElement('a');
        button.classList.add('home-btn');
        button.href = page.link;
        button.innerText = page.name;
        navigationContainer.appendChild(button);
    });

    // Append navigation buttons container to the body (if dynamic addition is desired)
    document.body.insertBefore(navigationContainer, document.body.firstChild);
});
