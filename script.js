const DEFAULT_PROFILES = [
    {
        id: 1,
        name: "Alex Thompson",
        role: "Frontend Developer",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        platform: "GitHub",
        handle: "@alexdev"
    },
    {
        id: 2,
        name: "Mike Chen",
        role: "Data Scientist",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        platform: "LinkedIn",
        handle: "@mikechendata"
    },
    {
        id: 3,
        name: "Sarah Davis",
        role: "UI/UX Designer",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        platform: "Dribbble",
        handle: "@sarahdesigns"
    },
    {
        id: 4,
        name: "David Miller",
        role: "DevOps Engineer",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        platform: "Twitter",
        handle: "@davidops"
    }
];

function initializeData() {
    if (!localStorage.getItem('userProfiles')) {
        localStorage.setItem('userProfiles', JSON.stringify(DEFAULT_PROFILES));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeData();

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
        });
    }
    
    if (closeMenuBtn && mobileMenu) {
        closeMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    }

    const path = window.location.pathname;
    if (path.includes('feed.html')) {
        renderFeed();
    } else if (path.includes('admin-creators.html')) {
        renderAdminCreators();
    } else if (path.includes('admin.html') && !path.includes('admin-')) {
        renderAdminDashboard();
    }
});

function renderFeed() {
    const container = document.getElementById('feed-container');
    if (!container) return;

    const profiles = JSON.parse(localStorage.getItem('userProfiles') || '[]');

    container.innerHTML = profiles.map(profile => `
        <div class="bg-brand-card rounded-xl overflow-hidden border border-slate-700 hover:border-brand-purple transition group">
            <div class="h-48 overflow-hidden">
                <img src="${profile.image}" alt="${profile.name}" class="w-full h-full object-cover transition duration-500 group-hover:scale-110">
            </div>
            <div class="p-6 text-center">
                <h3 class="text-white font-bold text-lg">${profile.name}</h3>
                <p class="text-brand-purple text-sm mb-4">${profile.role}</p>
                <div class="flex justify-center gap-2 mb-4">
                   <span class="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400 border border-slate-700">${profile.platform}</span>
                </div>
                <a href="#" class="text-slate-400 hover:text-white text-sm transition">${profile.handle}</a>
            </div>
        </div>
    `).join('');

    if (profiles.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-slate-500 py-10">No profiles listed currently.</p>`;
    }
}

function renderAdminCreators() {
    const tbody = document.getElementById('admin-table-body');
    const countEl = document.getElementById('profile-count');
    const emptyState = document.getElementById('empty-state-admin');
    
    if (!tbody) return;

    const profiles = JSON.parse(localStorage.getItem('userProfiles') || '[]');
    
    if (countEl) countEl.innerText = `${profiles.length} Users`;

    if (profiles.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    } else {
        if (emptyState) emptyState.classList.add('hidden');
    }

    tbody.innerHTML = profiles.map(profile => `
        <tr class="hover:bg-slate-800/30 transition">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <img src="${profile.image}" alt="" class="w-10 h-10 rounded-full object-cover border border-slate-700">
                    <div class="font-medium text-white">${profile.name}</div>
                </div>
            </td>
            <td class="px-6 py-4">${profile.role}</td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 bg-brand-purple/10 text-brand-purple rounded text-xs">${profile.platform}</span>
            </td>
            <td class="px-6 py-4 text-right">
                <button onclick="deleteProfile(${profile.id})" class="text-slate-500 hover:text-red-500 transition p-2">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderAdminDashboard() {
    const profiles = JSON.parse(localStorage.getItem('userProfiles') || '[]');
    const countEl = document.getElementById('total-creators-count');
    if(countEl) countEl.innerText = profiles.length;
}

window.deleteProfile = function(id) {
    if(confirm('Are you sure you want to delete this profile?')) {
        let profiles = JSON.parse(localStorage.getItem('userProfiles') || '[]');
        profiles = profiles.filter(p => p.id !== id);
        localStorage.setItem('userProfiles', JSON.stringify(profiles));
        renderAdminCreators();
    }
};

window.resetData = function() {
    localStorage.setItem('userProfiles', JSON.stringify(DEFAULT_PROFILES));
    if(window.location.pathname.includes('admin-creators.html')) {
        renderAdminCreators();
    } else if(window.location.pathname.includes('admin.html')) {
        window.location.reload();
    }
};
