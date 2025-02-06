// script.js
document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.querySelector("#signup-form");
    console.log(signupForm);
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("error-message");
    
    // Add error message element to the form
    signupForm.prepend(errorMessage);

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        const passwordField = document.getElementById("password");
        const confirmPasswordField = document.getElementById("confirm-password");
        const isChecked = document.getElementById("show-password").checked;
        const termsAccepted = document.getElementById("terms");
        const type = isChecked ? "text" : "password";
        passwordField.type = type;
        confirmPasswordField.type = type;
    };

    // Helper function to validate email
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Attach the toggle function to the checkbox
    document.getElementById("show-password").addEventListener("click", togglePasswordVisibility);

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Clear any previous error messages
        errorMessage.textContent = "";

        // Get form field values
        const name = signupForm.querySelector('input[name="name"]').value.trim();
        const email = signupForm.querySelector('input[name="email"]').value.trim();
        const password = signupForm.querySelector('input[name="password"]').value.trim();
        const confirmPassword = signupForm.querySelector('input[name="confirm-password"]').value.trim();
        const termsAccepted = signupForm.querySelector('input[name="terms"]').checked;

        // Validate form fields
        if (!name) {
            errorMessage.textContent = "Please enter your name.";
            return;
        }

        if (!email || !isValidEmail(email)) {
            errorMessage.textContent = "Please enter a valid email address.";
            return;
        }

        if (!password || password.length < 6) {
            errorMessage.textContent = "Password must be at least 6 characters long.";
            return;
        }

        if (password !== confirmPassword) {
            errorMessage.textContent = "Passwords do not match.";
            return;
        }

        if (!termsAccepted) {
            errorMessage.textContent = "You must accept the terms and conditions.";
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    termsAccepted
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Signup successful!");
                signupForm.reset();
            } else {
                errorMessage.textContent = data.error || "Signup failed. Please try again.";
            }
        } catch (error) {
            errorMessage.textContent = "Server error. Please try again later.";
            console.error('Error:', error);
        }
    });
});