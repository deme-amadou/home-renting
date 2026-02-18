/**
 * Stitch Home Dashboard - Core Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
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
    }
});

/**
 * Global Navigation & Shared Components
 */
function initGlobalNavigation() {
    // Logo redirect
    const logos = document.querySelectorAll('.flex.items-center.gap-2.text-primary, .flex.items-center.gap-2.text-primary h1, .flex.items-center.gap-2.text-primary h2');
    logos.forEach(logo => {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    });

    // Notify user on inactive links
    const inactiveLinks = document.querySelectorAll('a[href="#"]');
    inactiveLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('This feature is coming soon!');
        });
    });
}

/**
 * Toast Notification System
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-8 right-8 px-6 py-3 rounded-xl shadow-2xl z-[100] transform translate-y-20 transition-all duration-300 font-bold text-sm flex items-center gap-3`;
    
    if (type === 'success') {
        toast.classList.add('bg-green-500', 'text-white');
    } else {
        toast.classList.add('bg-primary', 'text-white');
    }

    toast.innerHTML = `
        <span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : 'info'}</span>
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
    const categoryButtons = document.querySelectorAll('button span + span');

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
    categoryButtons.forEach(btn => {
        const parent = btn.parentElement;
        parent.addEventListener('click', () => {
            document.querySelectorAll('button.bg-primary').forEach(b => {
                b.classList.remove('bg-primary', 'text-white');
                b.classList.add('bg-surface-dark', 'text-slate-300');
            });
            parent.classList.add('bg-primary', 'text-white');
            parent.classList.remove('bg-surface-dark', 'text-slate-300');
            
            showToast(`Showing ${btn.textContent} listings`);
            // Mock filter by showing/hiding alternate cards
            propertyCards.forEach((card, i) => {
                card.style.display = (i % 2 === 0) ? 'flex' : 'none';
            });
        });
    });
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
    const steps = ['Dates', 'Terms', 'Review'];
    let currentStep = 0;
    
    const stepTabs = document.querySelectorAll('.flex.items-center.gap-16.mb-8 > div');
    const sections = document.querySelectorAll('main > .grid > .lg\\:col-span-2 > div');
    const nextButton = document.querySelector('button.bg-primary');
    const priceDisplay = document.querySelector('.text-3xl.font-bold.text-primary');

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
            const isSubmit = nextButton.textContent.includes('Submit');
            
            if (isSubmit) {
                const termsChecked = document.getElementById('terms').checked;
                if (!termsChecked) {
                    showToast('Please agree to the terms', 'error');
                    return;
                }
                showToast('Application Submitted Successfully!', 'success');
                setTimeout(() => window.location.href = 'index.html', 2000);
            } else {
                // Future step logic can go here
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
            
            // Mock reply
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
