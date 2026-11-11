document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (filterButtons.length > 0 && productCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                productCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    const productButtons = document.querySelectorAll('.product-cta');

    productButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productName = button.getAttribute('data-name') || 'Unknown Product';
            const price = parseFloat(button.getAttribute('data-price') || '0.00');
            const category = button.getAttribute('data-category') || 'General';

            console.log(`GA4 Event: select_item -> ${productName} ($${price})`);

            if (typeof gtag === 'function') {
                gtag('event', 'select_item', {
                    item_list_name: 'Catalog List',
                    items: [{
                        item_name: productName,
                        item_category: category,
                        price: price
                    }]
                });
            }
        });
    });

    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
            const feedbackEl = document.getElementById('form-feedback');
            feedbackEl.className = 'form-feedback';
            feedbackEl.textContent = '';

            let isValid = true;

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            if (!nameInput.value.trim()) {
                document.getElementById('name-error').textContent = 'Please enter your full name.';
                isValid = false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
                document.getElementById('email-error').textContent = 'Please enter a valid email address.';
                isValid = false;
            }

            if (!subjectInput.value) {
                document.getElementById('subject-error').textContent = 'Please select a subject option.';
                isValid = false;
            }

            if (!messageInput.value.trim()) {
                document.getElementById('message-error').textContent = 'Please write your message.';
                isValid = false;
            }

            if (isValid) {
                feedbackEl.classList.add('success');
                feedbackEl.textContent = 'Thank you! Your message has been sent successfully (Demonstration Mode).';

                if (typeof gtag === 'function') {
                    gtag('event', 'demo_form_submit', {
                        form_name: 'contact_form',
                        subject_selected: subjectInput.value
                    });
                    console.log('GA4 Event: demo_form_submit triggered successfully.');
                }

                contactForm.reset();
            } else {
                feedbackEl.classList.add('error');
                feedbackEl.textContent = 'Please fix the errors above before submitting.';
            }
        });
    }

    const newsletterForms = document.querySelectorAll('form[id^="footer-newsletter"]');

    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');

            if (emailInput && emailInput.value.trim()) {
                alert('Thank you for subscribing to Aura Botanicals updates!');

                if (typeof gtag === 'function') {
                    gtag('event', 'sign_up', {
                        method: 'footer_newsletter'
                    });
                    console.log('GA4 Event: sign_up triggered successfully.');
                }

                emailInput.value = '';
            }
        });
    });
});