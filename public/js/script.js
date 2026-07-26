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
    modal.addEventListener("click", function (event) {
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
// SWITCH BETWEEN LOGIN & SIGNUP
// ==========================
function switchModal(link, currentModal, nextModal) {
    link.addEventListener("click", function (event) {
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
        const username = document.getElementById("signupUsername").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
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
                alert(data.message);
                return;
            }
            alert(data.message);
            signupForm.reset();
            closeModal(signupModal);
        } catch (error) {
            console.error(error);
            alert("Something went wrong.");
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
            alert(data.message);
            if (response.ok) {
                localStorage.setItem("userId", data.id);
                localStorage.setItem("username", data.username);
                localStorage.setItem("email", data.email);
                window.location.href = "/dashboard.html";
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong.");
        }
    });
}

