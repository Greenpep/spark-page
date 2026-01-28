/**
 * Spark Landing Page - Main JavaScript
 * Handles waitlist form submission via Netlify Forms
 */

(function() {
    'use strict';

    // Configuration
    const MESSAGES = {
        SUCCESS: "You're on the list! We'll be in touch soon.",
        ERROR: 'Something went wrong. Please try again.',
        INVALID_EMAIL: 'Please enter a valid email address.',
        NETWORK_ERROR: 'Network error. Please check your connection.'
    };

    // DOM Elements
    const form = document.getElementById('waitlist-form');
    const emailInput = document.getElementById('email');
    const submitButton = form?.querySelector('.btn-submit');
    const messageElement = document.getElementById('form-message');
    const yearElement = document.getElementById('year');

    // Set current year in footer
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    /**
     * Validate email format
     * @param {string} email - Email address to validate
     * @returns {boolean} - True if valid
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Show message to user
     * @param {string} message - Message to display
     * @param {string} type - 'success' or 'error'
     */
    function showMessage(message, type) {
        if (!messageElement) return;

        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
    }

    /**
     * Clear form message
     */
    function clearMessage() {
        if (!messageElement) return;

        messageElement.textContent = '';
        messageElement.className = 'form-message';
    }

    /**
     * Set loading state on button
     * @param {boolean} isLoading - Whether to show loading state
     */
    function setLoading(isLoading) {
        if (!submitButton) return;

        submitButton.disabled = isLoading;
        submitButton.classList.toggle('loading', isLoading);
    }

    /**
     * Handle form submission
     * @param {Event} event - Form submit event
     */
    async function handleSubmit(event) {
        event.preventDefault();
        clearMessage();

        const email = emailInput?.value.trim();

        // Validate email
        if (!email) {
            showMessage(MESSAGES.INVALID_EMAIL, 'error');
            emailInput?.focus();
            return;
        }

        if (!isValidEmail(email)) {
            showMessage(MESSAGES.INVALID_EMAIL, 'error');
            emailInput?.focus();
            return;
        }

        // Submit to Netlify Forms
        setLoading(true);

        try {
            const formData = new FormData(form);

            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });

            if (response.ok) {
                showMessage(MESSAGES.SUCCESS, 'success');
                emailInput.value = '';
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);

            if (!navigator.onLine) {
                showMessage(MESSAGES.NETWORK_ERROR, 'error');
            } else {
                showMessage(MESSAGES.ERROR, 'error');
            }
        } finally {
            setLoading(false);
        }
    }

    // Initialize form
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    // Clear message when user starts typing
    if (emailInput) {
        emailInput.addEventListener('input', clearMessage);
    }

    // Tab navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(tabId) {
        // Update buttons
        tabButtons.forEach(btn => {
            const isActive = btn.dataset.tab === tabId;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive);
        });

        // Update content
        tabContents.forEach(content => {
            const isActive = content.id === `tab-${tabId}`;
            content.classList.toggle('active', isActive);
            content.hidden = !isActive;
        });
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });
})();
