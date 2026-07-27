// ==========================
// DOM ELEMENT REFERENCES
// ==========================
const openLogin = document.getElementById("openLogin");
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");
const openSignup = document.getElementById("openSignup");
const signupModal = document.getElementById("signupModal");
const closeSignup = document.getElementById("closeSignup");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");
const openScrapbook = document.getElementById("openScrapbook");
const scrapbookModal = document.getElementById("scrapbookModal");
const closeScrapbook = document.getElementById("closeScrapbook");



// ==========================
// MODAL HELPER FUNCTIONS
// ==========================
function setupOpenButton(button, modal) {
    button.addEventListener("click", () => openModal(modal));
}

function setupCloseButton(button, modal) {
    button.addEventListener("click", () => closeModal(modal));
}

function setupOutsideClick(modal) {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
}

function setupModal(openBtn, closeBtn, modal) {
    setupOpenButton(openBtn, modal);
    setupCloseButton(closeBtn, modal);
    setupOutsideClick(modal);
}

// ==========================
// INITIALIZE MODALS
// ==========================
if (openLogin && closeLogin && loginModal) {
    setupModal(openLogin, closeLogin, loginModal);
}

if (openSignup && closeSignup && signupModal) {
    setupModal(openSignup, closeSignup, signupModal);
}

if (openScrapbook && closeScrapbook && scrapbookModal) {
    setupModal(openScrapbook, closeScrapbook, scrapbookModal);
}


// ==========================
// HERO START CREATING BUTTON
// ==========================
if (openScrapbook && !scrapbookModal) {
    openScrapbook.addEventListener("click", () => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            window.location.href = "/dashboard.html";
        } else {
            openModal(loginModal);
        }
    });
}


// ==========================
// SWITCH BETWEEN LOGIN & SIGNUP
// ==========================
function switchModal(link, currentModal, nextModal) {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        closeModal(currentModal);
        openModal(nextModal);
    });
}

if (showSignup) {
    switchModal(showSignup, loginModal, signupModal);
}
if (showLogin) {
    switchModal(showLogin, signupModal, loginModal);
}


// ==========================
// OPEN / CLOSE MODALS
// ==========================

// Opens the selected modal and disables background scrolling.
function openModal(modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

// Closes the selected modal and restores page scrolling.
function closeModal(modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
}


// ==========================
// SIGNUP
// ==========================
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const signupButton = signupForm.querySelector(".modal-btn");
        setButtonLoading(signupButton, "Creating Account...");

        const username = document.getElementById("signupUsername").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            showToast(
                "❌ Passwords do not match.",
                "error"
            );
            resetButton(signupButton);
            return;
        }
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })

            });

            const data = await response.json();
            if (!response.ok) {
                showToast(data.message, "error");
                resetButton(signupButton);
                return;
            }
            showToast(data.message, "success");
            signupForm.reset();
            closeModal(signupModal);
            resetButton(signupButton);
        } catch (error) {
            console.error(error);
            showToast(
                "❌ Something went wrong.",
                "error"
            );
            resetButton(signupButton);
        }
    });
}


// ==========================
// LOGIN
// ==========================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const loginButton =
            loginForm.querySelector(".modal-btn");
        setButtonLoading(loginButton, "Logging in...");
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const data = await response.json();
            if (!response.ok) {
                showToast(data.message, "error");
                resetButton(loginButton);
                return;
            }
            localStorage.setItem("userId", data.id);
            localStorage.setItem("username", data.username);
            localStorage.setItem("email", data.email);
            localStorage.setItem("justLoggedIn", "true");
            window.location.href = "/dashboard.html";
        } catch (error) {
            console.error(error);
            showToast(
                "❌ Something went wrong.",
                "error"
            );
            resetButton(loginButton);
        }
    });
}


// =============================
// TOAST
// =============================
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");
    toast.className = "toast";
    toast.classList.add(type);
    toastMessage.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


// =============================
// BUTTON LOADING STATES
// =============================
function setButtonLoading(button, loadingText) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
}
function resetButton(button) {
    button.disabled = false;
    if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
    }
}



// ==========================
// PASSWORD VISIBILITY TOGGLE
// ==========================
function setupPasswordToggle() {
    const toggles = document.querySelectorAll(".password-toggle");
    toggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
            const input =
                document.getElementById(toggle.dataset.target);
            const icon =
                toggle.querySelector("i");
            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");
                toggle.setAttribute("aria-label", "Hide password");
            } else {
                input.type = "password";
                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");
                toggle.setAttribute("aria-label", "Show password");
            }
        });
    });
}
setupPasswordToggle();
