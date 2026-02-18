/**
 * Stitch Home Dashboard - Core Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initGlobalNavigation();

    const path = window.location.pathname;
    const page = path.split("/").pop();

    if (page === 'index.html' || page === '') {
        initHomePage();
    } else if (page === 'property-details.html') {
        initPropertyDetailsPage();
    } else if (page === 'complete-application.html') {
        initApplicationPage();
    } else if (page === 'messages.html') {
        initMessagesPage();
    } else if (page === 'login.html') {
        initLoginPage();
    } else if (page === 'profile.html') {
        initProfilePage();
    } else if (page === 'add-home.html') {
        initAddHomePage();
    }

    // Apply saved profile info globally
    updateGlobalProfileUI();
});

/**
 * Mock Auth System
 */
function initAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const isLoginPage = window.location.pathname.includes('login.html');

    if (!user && !isLoginPage && !window.location.pathname.includes('index.html')) {
        // window.location.href = 'login.html'; // Disabled for demo stability
    }
}

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            localStorage.setItem('user', JSON.stringify({ email, name: 'Julianne Rossi' }));
            showToast('Welcome back, Julianne!', 'success');
            setTimeout(() => window.location.href = 'index.html', 1500);
        });
    }
}

/**
 * Global Navigation & Shared Components
 */
function initGlobalNavigation() {
    // Logo redirect and cursor
    const logos = document.querySelectorAll('.flex.items-center.gap-2.text-primary');
    logos.forEach(logo => {
        logo.style.cursor = 'pointer';
        if (!logo.closest('a')) {
            logo.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user');
            showToast('Signed out successfully');
            setTimeout(() => window.location.href = 'login.html', 1000);
        });
    }

    // Notify user on inactive links
    const inactiveLinks = document.querySelectorAll('a[href="#"]');
    inactiveLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('This feature is coming soon!');
        });
    });
}

function updateGlobalProfileUI() {
    const profileData = JSON.parse(localStorage.getItem('profile_data')) || {
        fullName: 'Julianne Rossi',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJBcjM6ElpDfrf32dYntVulWpnnrjR18wpmCObKLeSLVeXX4ikgDrDgwaxHAsNaEKztHoi0GdesHiKgMPOWN0f55K0o_8Wl9nQ6n3zKFYa-I-oX5WrGrYTBnLZBNvx9LPjc39STE0ZReE9Kc3I2neSURmdKMJCODNT2UmZtCYUEfseV2cfWh06IO6OXDwQsHoUNSxG6pmtHofjyZjZKXNuukflh6C62LSQohncf9Ve_8Jt4_brCUzc2hb5nlqC3MGWt_6m763VPaI'
    };

    const avatars = document.querySelectorAll('#headerAvatar, #profileAvatar');
    avatars.forEach(img => img.src = profileData.avatar);

    const profileNames = document.querySelectorAll('header span.hidden.sm\\:block');
    profileNames.forEach(span => span.textContent = profileData.fullName.split(' ')[0]);
}

/**
 * Toast Notification System
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-8 right-8 px-6 py-3 rounded-xl shadow-2xl z-[100] transform translate-y-20 transition-all duration-300 font-bold text-sm flex items-center gap-3`;

    if (type === 'success') {
        toast.classList.add('bg-green-500', 'text-white');
    } else if (type === 'error') {
        toast.classList.add('bg-red-500', 'text-white');
    } else {
        toast.classList.add('bg-primary', 'text-white');
    }

    toast.innerHTML = `
        <span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : (type === 'error' ? 'cancel' : 'info')}</span>
        ${message}
    `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-y-20');
        toast.classList.add('translate-y-0');
    }, 10);

    // Remove
    setTimeout(() => {
        toast.classList.remove('translate-y-0');
        toast.classList.add('translate-y-20');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Home Page Logic
 */
function initHomePage() {
    const searchInput = document.querySelector('input[placeholder="Search homes..."]');
    const heroSearchInput = document.querySelector('input[placeholder="Where are you going?"]');
    const propertyCards = document.querySelectorAll('.grid > .group.flex.flex-col');
    const categoryButtons = document.querySelectorAll('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4.gap-6 + div button, section.px-6.md\\:px-10.pb-8 button');

    const filterProperties = (query) => {
        const lowerQuery = query.toLowerCase();
        propertyCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const location = card.querySelector('p.text-slate-400').textContent.toLowerCase();
            if (title.includes(lowerQuery) || location.includes(lowerQuery)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    };

    if (searchInput) searchInput.addEventListener('input', (e) => filterProperties(e.target.value));
    if (heroSearchInput) heroSearchInput.addEventListener('input', (e) => filterProperties(e.target.value));

    // Category button mock filtering
    categoryButtons.forEach(parent => {
        parent.addEventListener('click', () => {
            const btnText = parent.querySelector('span:last-child').textContent;

            document.querySelectorAll('button.bg-primary').forEach(b => {
                b.classList.remove('bg-primary', 'text-white');
                b.classList.add('bg-surface-dark', 'text-slate-300');
            });
            parent.classList.add('bg-primary', 'text-white');
            parent.classList.remove('bg-surface-dark', 'text-slate-300');

            showToast(`Showing ${btnText} listings`);
            // Mock filter by showing/hiding alternate cards
            propertyCards.forEach((card, i) => {
                card.style.display = (i % 2 === 0) ? 'flex' : 'none';
            });
        });
    });

    // Date picker sync
    const checkIn = document.getElementById('checkInDate');
    const checkOut = document.getElementById('checkOutDate');
    if (checkIn && checkOut) {
        checkIn.addEventListener('change', () => {
            if (checkIn.value) checkOut.min = checkIn.value;
        });
    }
}

/**
 * Profile Page Logic
 */
function initProfilePage() {
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(profileForm);
            const data = {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                bio: formData.get('bio'),
                avatar: document.getElementById('profileAvatar').src
            };
            localStorage.setItem('profile_data', JSON.stringify(data));
            updateGlobalProfileUI();
            showToast('Profile updated successfully!', 'success');
        });
    }
}

/**
 * Add Home Page Logic
 */
function initAddHomePage() {
    const addHomeForm = document.getElementById('addHomeForm');
    if (addHomeForm) {
        addHomeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Your listing has been submitted for review!', 'success');
            setTimeout(() => window.location.href = 'index.html', 2000);
        });
    }
}

/**
 * Property Details Logic
 */
function initPropertyDetailsPage() {
    const galleryImages = document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-4 img');
    const mainImage = document.querySelector('.md\\:col-span-2.md\\:row-span-2 img');

    galleryImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            if (mainImage && img !== mainImage) {
                const tempSrc = mainImage.src;
                mainImage.src = img.src;
                img.src = tempSrc;
            }
        });
    });

    const bookButton = document.querySelector('a[href="complete-application.html"]');
    if (bookButton) {
        bookButton.addEventListener('click', (e) => {
            const price = document.querySelector('.text-2xl.font-bold.text-white').textContent;
            localStorage.setItem('booking_price', price);
        });
    }
}

/**
 * Application Page Logic
 */
function initApplicationPage() {
    const priceDisplay = document.querySelector('.text-3xl.font-bold.text-primary');
    const nextButton = document.querySelector('button.bg-primary');

    // Lease duration toggle
    const leaseOptions = document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-3.gap-4 > div');
    leaseOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            leaseOptions.forEach(o => {
                o.classList.remove('border-primary', 'border-2', 'bg-surface-dark');
                o.classList.add('border-slate-800', 'bg-surface-dark/50');
                const badge = o.querySelector('.absolute.top-0');
                if (badge) badge.style.display = 'none';
            });
            opt.classList.add('border-primary', 'border-2', 'bg-surface-dark');
            const price = opt.querySelector('p').textContent.split(' ')[0];
            updatePricing(price);
        });
    });

    function updatePricing(monthlyPrice) {
        if (!priceDisplay) return;
        const base = parseInt(monthlyPrice.replace(/[^0-9]/g, ''));
        const total = base + base + 45 + 250; // Rent + Deposit + Fee + Cleaning
        priceDisplay.textContent = `$${total.toLocaleString()}.00`;
    }

    if (nextButton) {
        nextButton.addEventListener('click', (e) => {
            if (nextButton.textContent.includes('Submit')) {
                const termsChecked = document.getElementById('terms').checked;
                if (!termsChecked) {
                    showToast('Please agree to the terms', 'error');
                    return;
                }
                showToast('Application Submitted Successfully!', 'success');
                setTimeout(() => window.location.href = 'index.html', 2000);
            }
        });
    }
}

/**
 * Messages Page Logic
 */
function initMessagesPage() {
    const conversations = document.querySelectorAll('aside .overflow-y-auto > div');
    const chatTitle = document.querySelector('section h3.font-bold');
    const sendButton = document.querySelector('section button.bg-primary');
    const chatInput = document.querySelector('section input[placeholder="Type a message..."]');
    const messagesArea = document.querySelector('section .overflow-y-auto');

    conversations.forEach(conv => {
        conv.addEventListener('click', () => {
            conversations.forEach(c => c.classList.remove('bg-surface-dark', 'border-l-4', 'border-primary'));
            conv.classList.add('bg-surface-dark', 'border-l-4', 'border-primary');

            const name = conv.querySelector('h3').textContent;
            chatTitle.textContent = name.split(' (')[0];
            showToast(`Opening chat with ${chatTitle.textContent}`);
        });
    });

    if (sendButton && chatInput) {
        const sendMessage = () => {
            const text = chatInput.value.trim();
            if (!text) return;

            const msgDiv = document.createElement('div');
            msgDiv.className = 'flex items-start gap-4 max-w-[80%] self-end flex-row-reverse';
            msgDiv.innerHTML = `
                <div class="h-8 w-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center overflow-hidden shrink-0">
                    <span class="material-symbols-outlined text-primary text-sm">person</span>
                </div>
                <div class="flex flex-col gap-1 items-end">
                    <div class="bg-primary p-4 rounded-2xl rounded-tr-none text-sm text-white leading-relaxed shadow-lg">
                        ${text}
                    </div>
                    <span class="text-[10px] text-slate-600 pr-1 text-right">Just now</span>
                </div>
            `;
            messagesArea.appendChild(msgDiv);
            chatInput.value = '';
            messagesArea.scrollTop = messagesArea.scrollHeight;

            setTimeout(() => {
                const replyDiv = document.createElement('div');
                replyDiv.className = 'flex items-start gap-4 max-w-[80%]';
                replyDiv.innerHTML = `
                    <div class="h-8 w-8 rounded-full bg-slate-700 overflow-hidden shrink-0">
                        <span class="material-symbols-outlined text-slate-400 p-2">person</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <div class="bg-surface-dark border border-slate-800 p-4 rounded-2xl rounded-tl-none text-sm text-slate-200 leading-relaxed shadow-lg">
                            Thanks for your message! I'll get back to you shortly.
                        </div>
                        <span class="text-[10px] text-slate-600 pl-1">Just now</span>
                    </div>
                `;
                messagesArea.appendChild(replyDiv);
                messagesArea.scrollTop = messagesArea.scrollHeight;
            }, 1000);
        };

        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
}
