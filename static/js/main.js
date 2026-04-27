// Dark Mode Toggle (mantido)
const darkModeToggle = document.getElementById('darkModeToggle');
const htmlElement = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
updateDarkModeIcon(savedTheme);

darkModeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateDarkModeIcon(newTheme);
});

function updateDarkModeIcon(theme) {
    const icon = darkModeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Download CV
const downloadCVBtn = document.getElementById('downloadCVBtn');
if (downloadCVBtn) {
    downloadCVBtn.addEventListener('click', () => {
        // Link direto para o PDF do Aristides
        window.location.href = '/static/files/CV_BUDIMBO.pdf';
    });
}

// LinkedIn Integration
async function loadLinkedInData() {
    const linkedinWidget = document.getElementById('linkedinWidget');
    if (!linkedinWidget) return;
    try {
        const response = await fetch('/api/linkedin-profile');
        const data = await response.json();
        const followersSpan = document.getElementById('linkedinFollowers');
        if (followersSpan) followersSpan.textContent = data.followers.toLocaleString();
        const followBtn = document.getElementById('linkedinFollowBtn');
        if (followBtn && data.profile_url) followBtn.href = data.profile_url;
    } catch (error) {
        console.error('Erro ao carregar dados do LinkedIn:', error);
        const followersSpan = document.getElementById('linkedinFollowers');
        if (followersSpan) followersSpan.textContent = '1.200';
    }
}

// Skills Chart
function initSkillsChart() {
    const canvas = document.getElementById('skillsChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Liderança', 'Análise Técnica', 'Gestão de Pessoas', 'Estratégia', 'Comunicação', 'Inovação'],
            datasets: [{
                label: 'Nível de Competência',
                data: [95, 98, 88, 92, 85, 90],
                backgroundColor: 'rgba(26, 60, 52, 0.2)',
                borderColor: 'rgba(26, 60, 52, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(212, 163, 115, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(212, 163, 115, 1)'
            }]
        },
        options: { responsive: true, maintainAspectRatio: true, scales: { r: { beginAtZero: true, max: 100 } } }
    });
}

// ==================== FEATURED CAROUSEL (Home Page) ====================
const featuredProjects = [
    { title: "Reestruturação de Infraestrutura de Rede", description: "+95% de estabilidade, equipa capacitada, redução de custos operacionais.", tags: ["Redes", "Gestão de Mudança", "Formação"], image: "eng_ar21.jpeg" },
    { title: "Programa de Mentoria Técnica", description: "+70% de retenção de talentos, formação em pensamento sistémico.", tags: ["Mentoria", "Formação", "Carreira"], image: "ens_ar21.jpeg" },
    { title: "Diagnóstico de Perfis para Equipa de TI", description: "Redução de 40% na rotatividade, melhoria mensurável no clima organizacional.", tags: ["Análise de Perfil", "Gestão de Pessoal", "Estratégia"], image: "trab_ar21.jpeg" }
];

let featuredCurrentSlide = 0;
let featuredInterval;

function initFeaturedCarousel() {
    const slidesContainer = document.getElementById('featuredCarouselSlides');
    const indicatorsContainer = document.getElementById('featuredIndicators');
    if (!slidesContainer) return;

    slidesContainer.innerHTML = '';
    indicatorsContainer.innerHTML = '';

    featuredProjects.forEach((project, index) => {
        const slide = document.createElement('div');
        slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `
            <div class="project-card">
                <div class="project-image">
                    <img src="/static/images/${project.image}" alt="${project.title}">
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                    <a href="/projetos" class="project-link">Ver detalhes →</a>
                </div>
            </div>
        `;
        slidesContainer.appendChild(slide);

        const indicator = document.createElement('div');
        indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToFeaturedSlide(index));
        indicatorsContainer.appendChild(indicator);
    });

    document.getElementById('featuredPrevBtn')?.addEventListener('click', () => { featuredPrevSlide(); resetFeaturedInterval(); });
    document.getElementById('featuredNextBtn')?.addEventListener('click', () => { featuredNextSlide(); resetFeaturedInterval(); });
    startFeaturedInterval();

    const container = document.querySelector('#featuredCarousel');
    container?.addEventListener('mouseenter', () => { if (featuredInterval) clearInterval(featuredInterval); });
    container?.addEventListener('mouseleave', startFeaturedInterval);
}

function goToFeaturedSlide(index) {
    const slides = document.querySelectorAll('#featuredCarouselSlides .carousel-slide');
    const indicators = document.querySelectorAll('#featuredIndicators .carousel-indicator');
    if (!slides.length) return;
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    featuredCurrentSlide = index;
}

function featuredNextSlide() { let newIndex = (featuredCurrentSlide + 1) % featuredProjects.length; goToFeaturedSlide(newIndex); }
function featuredPrevSlide() { let newIndex = (featuredCurrentSlide - 1 + featuredProjects.length) % featuredProjects.length; goToFeaturedSlide(newIndex); }
function startFeaturedInterval() { featuredInterval = setInterval(() => featuredNextSlide(), 5000); }
function resetFeaturedInterval() { if (featuredInterval) clearInterval(featuredInterval); startFeaturedInterval(); }

// ==================== PROJECT CAROUSELS (Projetos Page) ====================
function initProjectCarousels() {
    document.querySelectorAll('.project-carousel-container').forEach(container => {
        const projectId = container.dataset.projectId;
        const slides = container.querySelectorAll('.project-carousel-slide');
        const dots = container.querySelectorAll('.dot');
        let currentIndex = 0;

        if (slides.length <= 1) return;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentIndex = index;
        }

        container.querySelector('.project-carousel-prev')?.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        });

        container.querySelector('.project-carousel-next')?.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        });

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => showSlide(idx));
        });

        let interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }, 5000);

        container.addEventListener('mouseenter', () => clearInterval(interval));
        container.addEventListener('mouseleave', () => {
            interval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                showSlide(currentIndex);
            }, 5000);
        });
    });
}

// ==================== GALLERY LIGHTBOX ====================
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item, .knowledge-card');
    const modal = document.getElementById('lightboxModal');
    const modalImg = document.getElementById('lightboxImage');
    const captionText = document.getElementById('lightboxCaption');
    const closeBtn = document.querySelector('.close-lightbox');

    if (!modal) return;

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('h3')?.innerText || '';
            const category = item.querySelector('.gallery-categoria')?.innerText || '';
            modal.style.display = 'block';
            modalImg.src = img.src;
            captionText.innerHTML = `<h3>${title}</h3><p>${category}</p>`;
        });
    });

    closeBtn?.addEventListener('click', () => { modal.style.display = 'none'; });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
}

// ==================== MOBILE NAVIGATION ====================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle) {
    navToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
}
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navMenu?.classList.remove('active'));
});

// ==================== NAVBAR SCROLL EFFECT ====================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'var(--bg-navbar-scrolled)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'var(--bg-navbar)';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// ==================== AOS INIT ====================
AOS.init({ duration: 800, once: true, offset: 100 });

// ==================== CONTACT FORM ====================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        try {
            const response = await fetch('/api/enviar-mensagem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: document.getElementById('nome').value,
                    email: document.getElementById('email').value,
                    mensagem: document.getElementById('mensagem').value
                })
            });
            const data = await response.json();
            if (data.success) {
                formMessage.textContent = '✅ Mensagem enviada com sucesso! Entrarei em contacto em breve.';
                formMessage.className = 'form-message success';
                contactForm.reset();
            } else throw new Error(data.message);
        } catch (error) {
            formMessage.textContent = '❌ Erro ao enviar mensagem. Por favor, tente novamente.';
            formMessage.className = 'form-message error';
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            setTimeout(() => { formMessage.style.display = 'none'; }, 5000);
        }
    });
}

// ==================== INIT ALL ====================
document.addEventListener('DOMContentLoaded', () => {
    loadLinkedInData();
    initSkillsChart();
    initFeaturedCarousel();
    initProjectCarousels();
    initGalleryLightbox();
});