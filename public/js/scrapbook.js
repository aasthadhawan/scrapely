// =============================
// SCRAPBOOK VARIABLES
// =============================

const scrapbookTitle = document.getElementById("scrapbookTitle");
const scrapbookDescription = document.getElementById("description");

const saveScrapbook = document.getElementById("saveScrapbook");
const newScrapbookBtn = document.getElementById("newScrapbookBtn");
const scrapbooksGrid = document.getElementById("scrapbooksGrid");

const emptyState = document.getElementById("emptyState");
const filledDashboard = document.getElementById("filledDashboard");
const dashboardTop = document.getElementById("dashboardTop");

const addPageBtn = document.getElementById("addPageBtn");
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const deletePageBtn = document.getElementById("deletePageBtn");

const pageCounter = document.getElementById("pageCounter");
const changeImageBtn = document.getElementById("changeImageBtn");

const colorOptions = document.querySelectorAll(".color");
const stickersLayer = document.getElementById("stickersLayer");
const stickerOptions = document.querySelectorAll(".sticker-grid span");

const stickers = {
    hearts: [
        "❤️", "🩷", "💜", "💛", "🩵",
        "💖", "💝", "💘", "💕", "💞",
        "🤍", "🧡", "🖤", "🩶", "💚"
    ],

    sparkles: [
        "✨", "⭐", "🎀", "💫", "☀️",
        "🌙", "☁️", "⚡", "❄️", "🔥",
        "💎", "⛄️", "🧿", "🌠", "🔮"
    ],

    rainbow: [
        "🌈", "🌸", "🌼", "🌺", "🦋",
        "🍄", "🌻", "🌷", "🍓", "🍒",
        "🎄", "☘️", "🍁", "🧸", "🫧"
    ],

    smileys: [
        "😊", "🥹", "😍", "🥰", "😌",
        "🙂", "😝", "🤗", "😇", "😋",
        "🥳", "😎", "😡", "😱", "😴"
    ],

    animals: [
        "🐾", "🐱", "🐶", "🐰", "🦊",
        "🐻", "🐼", "🐸", "🐥", "🦄",
        "🐹", "🐵", "🐙", "🐬", "🦦"
    ]
};

const stickerTabs = document.querySelectorAll(".sticker-tabs span");
const stickerGrid = document.querySelector(".sticker-grid");
const pagePreview = document.getElementById("pagePreview");


const imageUploadBox = document.querySelector(".image-upload-box");
const coverImageInput = document.getElementById("coverImage");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");



// =============================
// APP STATE
// =============================

const scrapbooks = [];
const MAX_PAGES = 20;
let currentScrapbook = null;
let currentPageIndex = 0;
let isEditing = false;
let pendingImage = null;
let selectedImageFile = null;
let selectedFrameColor = "";
let activeSticker = null;
let activeStickerData = null;
let isDraggingSticker = false;
let dragOffsetX = 0;
let dragOffsetY = 0;



// =============================
// IMAGE PICKER
// =============================

if (changeImageBtn) {
    changeImageBtn.addEventListener("click", () => {
        coverImageInput.click();
    });
}

// =============================
// FRAME COLORS
// =============================
colorOptions.forEach(color => {
    color.addEventListener("click", () => {
        colorOptions.forEach(c => {
            c.classList.remove("active");
        });
        color.classList.add("active");
        selectedFrameColor = color.classList[1];
        imageUploadBox.style.border =
            `5px solid ${getComputedStyle(color).backgroundColor}`;
    });
});


// =============================
// CREATE BLANK PAGE
// =============================

function createBlankPage() {
    return {
        coverImage: "",
        imageFile: null,
        description: "",
        frameColor: "",
        stickers: [],
        photos: []
    };
}

// =============================
// CREATE Sticker
// =============================

function createStickerElement(stickerData) {
    const sticker = document.createElement("div");
    sticker.className = "page-sticker";
    sticker.dataset.id = stickerData.id;

    sticker.innerHTML = `
    <span class="sticker-emoji">${stickerData.emoji}</span>
    <button class="delete-sticker">&times;</button>
    `;

    sticker.style.left = stickerData.x + "px";
    sticker.style.top = stickerData.y + "px";
    stickersLayer.appendChild(sticker);

    const deleteBtn = sticker.querySelector(".delete-sticker");
    deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const page = currentScrapbook.pages[currentPageIndex];
        page.stickers = page.stickers.filter(s =>
            s.id !== stickerData.id
        );
        sticker.remove();
    });

    sticker.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("delete-sticker")) return;
        document.body.style.cursor = "grabbing";
        e.preventDefault();
        e.stopPropagation();
        activeSticker = sticker;
        activeStickerData = stickerData;
        isDraggingSticker = true;
        dragOffsetX = e.offsetX;
        dragOffsetY = e.offsetY;

    });

}

document.addEventListener("mousemove", (e) => {

    if (!isDraggingSticker || !activeSticker) return;
    const rect = stickersLayer.getBoundingClientRect();

    let x = e.clientX - rect.left - dragOffsetX;
    let y = e.clientY - rect.top - dragOffsetY;

    activeSticker.style.left = x + "px";
    activeSticker.style.top = y + "px";

});

document.addEventListener("mouseup", () => {
    document.body.style.cursor = "default";

    if (!isDraggingSticker) return;

    isDraggingSticker = false;

    activeStickerData.x = parseInt(activeSticker.style.left);
    activeStickerData.y = parseInt(activeSticker.style.top);

    activeSticker = null;
    activeStickerData = null;

});

// =============================
// RENDER STICKER CATEGORY
// =============================

function renderStickerCategory(category) {
    stickerGrid.innerHTML = "";
    stickers[category].forEach(emoji => {
        const span = document.createElement("span");
        span.textContent = emoji;
        span.addEventListener("click", () => {
            const page = currentScrapbook.pages[currentPageIndex];
            const stickerData = {
                id: Date.now(),
                emoji: emoji,
                x: 120,
                y: 80
            };
            page.stickers.push(stickerData);
            createStickerElement(stickerData);
        });
        stickerGrid.appendChild(span);
    });
}
renderStickerCategory("hearts");
// ONLY ONCE when the page loads
stickerTabs[0].classList.add("active");
stickerTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        stickerTabs.forEach(t => {
            t.classList.remove("active");
        });
        tab.classList.add("active");
        renderStickerCategory(tab.dataset.category);
    });
});


// =============================
// CREATE NEW SCRAPBOOK
// =============================

function createNewScrapbook() {
    currentScrapbook = {
        title: "",
        pages: [
            createBlankPage()
        ]
    };
    currentPageIndex = 0;
    isEditing = false;
}


// =============================
// RESET UI
// =============================

function clearPageUI() {
    scrapbookDescription.value = "";
    coverImageInput.value = "";
    uploadPlaceholder.innerHTML = `
        <span class="plus">+</span>
        <p>Add an image</p>
    `;
}



// =============================
// UPDATE PAGE COUNTER
// =============================

function updatePageCounter() {
    pageCounter.textContent =
        `Page ${currentPageIndex + 1} of ${currentScrapbook.pages.length}`;
}


// =============================
// LOAD CURRENT PAGE
// =============================

function loadCurrentPage() {
    const page =
        currentScrapbook.pages[currentPageIndex];

    // Always clear temporary upload
    pendingImage = null;
    coverImageInput.value = "";

    scrapbookTitle.value =
        currentScrapbook.title;
    scrapbookDescription.value =
        page.description;
    selectedFrameColor =
        page.frameColor;
    stickersLayer.innerHTML = "";
    if (page.coverImage !== "") {
        uploadPlaceholder.innerHTML = `
            <img src="${page.coverImage}">
        `;
    }

    else {
        // pendingImage = null;
        // coverImageInput.value = "";
        uploadPlaceholder.innerHTML = `
        <span class="plus">+</span>
        <p>Add an image</p>
    `;

    }
    colorOptions.forEach(c => c.classList.remove("active"));
    if (page.frameColor !== "") {
        const colorCircle =
            document.querySelector("." + page.frameColor);
        colorCircle.classList.add("active");
        imageUploadBox.style.border =
            `5px solid ${getComputedStyle(colorCircle).backgroundColor}`;
    }
    else {
        imageUploadBox.style.border =
            "1px solid #FF95AC";
    }
    page.stickers.forEach(sticker => {
        createStickerElement(sticker);

    });
    updatePageCounter();
    updatePagePreview();
}


// =============================
// SAVE CURRENT PAGE
// =============================

function saveCurrentPage() {
    const page =
        currentScrapbook.pages[currentPageIndex];
    currentScrapbook.title =
        scrapbookTitle.value.trim();
    page.description =
        scrapbookDescription.value.trim();
    page.frameColor = selectedFrameColor;
    if (pendingImage) {
        page.coverImage = pendingImage;
        pendingImage = null;
        coverImageInput.value = "";
    }
    updatePagePreview();
}


// =============================
// ADD PAGE
// =============================
addPageBtn.addEventListener("click", () => {
    if (currentScrapbook.pages.length >= MAX_PAGES) {
        alert("A scrapbook can have a maximum of 20 pages. 📖");
        return;
    }
    saveCurrentPage();
    currentScrapbook.pages.push(createBlankPage());
    currentPageIndex = currentScrapbook.pages.length - 1;
    loadCurrentPage();
});

// =============================
// PREVIOUS PAGE
// =============================
prevPageBtn.addEventListener("click", () => {
    if (currentPageIndex === 0) return;
    saveCurrentPage();
    currentPageIndex--;
    loadCurrentPage();
});


// =============================
// NEXT PAGE
// =============================
nextPageBtn.addEventListener("click", () => {
    if (currentPageIndex === currentScrapbook.pages.length - 1) return;
    saveCurrentPage();
    currentPageIndex++;
    loadCurrentPage();
});


// =============================
// DELETE PAGE
// =============================
deletePageBtn.addEventListener("click", () => {
    if (currentScrapbook.pages.length === 1) {
        alert("A scrapbook must have at least one page.");
        return;
    }
    currentScrapbook.pages.splice(currentPageIndex, 1);
    if (currentPageIndex >= currentScrapbook.pages.length) {
        currentPageIndex--;
    }
    loadCurrentPage();
});


// =============================
// NEW SCRAPBOOK
// =============================
newScrapbookBtn.addEventListener("click", () => {
    createNewScrapbook();
    loadCurrentPage();
    openModal(scrapbookModal);
});


// For the first "Create your First Scrapbook" button

if (openScrapbook) {

    openScrapbook.addEventListener("click", () => {

        createNewScrapbook();

        loadCurrentPage();

    });

}

// =============================
// UPDATE DASHBOARD
// =============================


function updateDashboardState() {

    if (scrapbooks.length === 0) {

        emptyState.style.display = "block";
        filledDashboard.style.display = "none";
        dashboardTop.style.display = "none";

    }
    else {

        emptyState.style.display = "none";
        filledDashboard.style.display = "block";
        dashboardTop.style.display = "flex";

    }

}

// =============================
// CREATE DASHBOARD CARD
// =============================

function createScrapbookCard(scrapbook) {

    const card = document.createElement("div");

    card.className = "scrapbook-card";

    card.innerHTML = `
        <div class="scrapbook-cover">
            <img src="${scrapbook.pages[0].coverImage}" alt="">
        </div>

        <div class="scrapbook-info">

            <div class="scrapbook-text">

                <h3>${scrapbook.title}</h3>

                <p>${scrapbook.pages.length} pages</p>

            </div>

            <div class="card-actions">

                <button class="icon-btn edit-btn">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button class="icon-btn delete-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>

        </div>
    `;

    card.addEventListener("click", (e) => {
        if (e.target.closest(".card-actions")) return;
        currentScrapbook = scrapbook;
        currentPageIndex = 0;
        isEditing = true;
        loadCurrentPage();
        openModal(scrapbookModal);
    });

    const editBtn = card.querySelector(".edit-btn");
    const deleteBtn = card.querySelector(".delete-btn");

    editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentScrapbook = scrapbook;
        currentPageIndex = 0;
        isEditing = true;
        loadCurrentPage();
        openModal(scrapbookModal);
    });


    deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (!confirm("Delete this scrapbook?")) return;
        try {
            const response = await fetch(`/api/scrapbooks/${scrapbook._id}`, {
                method: "DELETE"
            });
            const data = await response.json();
            console.log(data);
            await loadScrapbooks();
        } catch (error) {
            console.error(error);
        }
    });

    scrapbook.card = card;
    return card;

}


// =============================
// SAVE SCRAPBOOK
// =============================

saveScrapbook.addEventListener("click", async () => {
    const title = scrapbookTitle.value.trim();
    if (title === "") {
        alert("Your scrapbook needs a title before you can save it. 💖");
        scrapbookTitle.focus();
        return;
    }

    const page = currentScrapbook.pages[currentPageIndex];
    if (!page.coverImage && !pendingImage) {
        alert("Please add a cover image before saving your scrapbook. 🖼️💖");
        return;
    }

    saveCurrentPage();


    const userId = localStorage.getItem("userId");
    try {
        const formData = new FormData();

        formData.append("user", userId);
        formData.append("title", currentScrapbook.title);
        formData.append("pages", JSON.stringify(currentScrapbook.pages));

        currentScrapbook.pages.forEach((page, index) => {
            if (page.imageFile) {
                formData.append("coverImages", page.imageFile);
                formData.append("coverImageIndexes", index);
            }
        });


        let response;
        if (isEditing) {
            response = await fetch(`/api/scrapbooks/${currentScrapbook._id}`, {
                method: "PUT",
                body: formData
            });
        } else {
            response = await fetch("/api/scrapbooks", {
                method: "POST",
                body: formData
            });
        }

        const data = await response.json();
        console.log(data);
        await loadScrapbooks();
        updateDashboardState();
        closeModal(scrapbookModal);

    } catch (error) {
        console.error(error);
    }


    // if (!isEditing) {
    //     scrapbooks.push(currentScrapbook);
    //     const card = createScrapbookCard(currentScrapbook);
    //     scrapbooksGrid.appendChild(card);
    // }

    // else {
    //     currentScrapbook.card.querySelector("h3").textContent =
    //         currentScrapbook.title;
    //     currentScrapbook.card.querySelector("p").textContent =
    //         `${currentScrapbook.pages.length} pages`;
    //     currentScrapbook.card.querySelector("img").src =
    //         currentScrapbook.pages[0].coverImage;
    // }
});

// =============================
// PAGE PREVIEW
// =============================
function updatePagePreview() {
    const page = currentScrapbook.pages[currentPageIndex];
    if (page.coverImage === "") {
        pagePreview.innerHTML = "";
    } else {
        pagePreview.innerHTML = `
            <img src="${page.coverImage}" alt="Page Preview">
        `;
    }
}


// ==========================
// COVER IMAGE PREVIEW
// ==========================
if (uploadPlaceholder && coverImageInput) {
    uploadPlaceholder.addEventListener("click", (e) => {
        e.stopPropagation();
        coverImageInput.click();
    });
}

if (coverImageInput && uploadPlaceholder) {
    coverImageInput.addEventListener("change", () => {
        const file = coverImageInput.files[0];
        if (!file) return;
        const page = currentScrapbook.pages[currentPageIndex];
        page.imageFile = file;
        pendingImage = URL.createObjectURL(file);
        uploadPlaceholder.innerHTML = `
            <img src="${pendingImage}" alt="Cover Image">
        `;
        pagePreview.innerHTML = `
        <img src="${pendingImage}" alt="Page Preview">
        `;
        // updatePagePreview();
    });
}


async function loadScrapbooks() {
    try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const response = await fetch(`/api/scrapbooks?user=${userId}`);
        const data = await response.json();
        scrapbooks.length = 0;
        scrapbooksGrid.innerHTML = "";
        data.forEach(scrapbook => {

            console.log("Loaded scrapbook:", scrapbook);

            scrapbooks.push(scrapbook);

            const card = createScrapbookCard(scrapbook);

            scrapbooksGrid.appendChild(card);
        });
        updateDashboardState();
    } catch (error) {
        console.error("Error loading scrapbooks:", error);
    }
}
loadScrapbooks();