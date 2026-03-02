
// Get year info in the copyright footer
// Automatically update the footer year
document.getElementById('current-year').textContent = new Date().getFullYear();


function sendThemedEmail() {
    // 1. Get values from the form
    const name = document.getElementById('contact_name').value;
    const email = document.getElementById('contact_email').value;
    const message = document.getElementById('contact_message').value;

    // 2. Validate basic input
    if (!name || !email || !message) {
        alert("Please fill in all required fields.");
        return;
    }

    // 3. Define your receiving email address
    const recipient = "humachlab@outlook.com";
    const subject = `Inquiry from ${name} via HumachLab Website`;

    // 4. Construct the body
    const body = `Name: ${name}%0D%0A` +
                 `Email: ${email}%0D%0A%0D%0A` +
                 `Message:%0D%0A${message}`;

    // 5. Open the email client
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${body}`;
}

