document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const socialLinks = document.querySelector('.social-links');

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-active');
        socialLinks.classList.toggle('mobile-active');
        
        // Toggle icon between bars and times
        const icon = menuToggle.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking outside or clicking a link
    document.addEventListener('click', (e) => {
        if ((!e.target.closest('.navbar') || e.target.closest('a')) && navLinks.classList.contains('mobile-active')) {
            if (e.target.closest('.menu-toggle')) return;
            
            navLinks.classList.remove('mobile-active');
            socialLinks.classList.remove('mobile-active');
            
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Handle Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    const scrollContainer = document.querySelector('.content-scroll');

    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollContainer.scrollTop >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${current}`) {
                    item.classList.add('active');
                    // Add code tags for active link
                    const currentHtml = item.innerHTML;
                    if (!currentHtml.includes('code-tag')) {
                        const text = item.textContent;
                        item.innerHTML = `<span class="code-tag">&lt;${text}&gt;</span>`;
                    }
                } else {
                    // Remove code tags for inactive links
                    const text = item.textContent.replace(/[<>]/g, '');
                    item.innerHTML = text;
                }
            });
        });
    }

    // Scroll Animations
    const observerOptions = {
        root: null, // use the viewport or scrollContainer? Since scrollContainer handles scroll, let's observe against the scrollContainer if we can, but since the scrollContainer is just a div taking full height, root: scrollContainer works.
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% visible
    };

    const animateElements = document.querySelectorAll('.hero-content, .icon-wrapper');
    
    // Use the scroll container as the root for observation
    observerOptions.root = document.querySelector('.content-scroll');

    // Type Effect HTML function
    function typeEffectHTML(element, speed = 15) {
        return new Promise(resolve => {
            if (!element.hasAttribute('data-original')) {
                element.setAttribute('data-original', element.innerHTML);
            }
            const html = element.getAttribute('data-original');
            element.innerHTML = '';
            element.style.opacity = '1';
            
            let i = 0;
            let isTag = false;
            let currentHtml = '';
            
            function type() {
                if (i < html.length) {
                    let char = html.charAt(i);
                    currentHtml += char;
                    
                    if (char === '<') isTag = true;
                    if (char === '>') isTag = false;
                    
                    if (isTag) {
                        while (i < html.length && html.charAt(i) !== '>') {
                            i++;
                            currentHtml += html.charAt(i);
                        }
                        isTag = false;
                    }
                    
                    element.innerHTML = currentHtml;
                    i++;
                    
                    element.classList.add('typing-cursor');
                    setTimeout(type, speed);
                } else {
                    element.classList.remove('typing-cursor');
                    resolve();
                }
            }
            type();
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('hero-content')) {
                    if (!entry.target.classList.contains('typed')) {
                        entry.target.classList.add('typed');
                        const children = entry.target.querySelectorAll('.html-tag, h1, .subtitle');
                        
                        // Chain typing promises
                        let chain = Promise.resolve();
                        children.forEach(child => {
                            chain = chain.then(() => typeEffectHTML(child, 15));
                        });
                        
                        // Show buttons after typing finishes
                        chain.then(() => {
                            const btn = entry.target.querySelector('.cta-buttons');
                            if(btn) {
                                btn.style.opacity = '1';
                                btn.style.transform = 'translateY(0)';
                            }
                        });
                    }
                } else {
                    entry.target.classList.add('animate-in'); // for icons
                }
            } else {
                if (!entry.target.classList.contains('hero-content')) {
                    // Only reset icons, leave hero-content typed out
                    entry.target.classList.remove('animate-in'); 
                }
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // Modal Functionality
    const viewCvBtn = document.getElementById('viewCvBtn');
    const cvModal = document.getElementById('cvModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (viewCvBtn && cvModal && closeModalBtn) {
        viewCvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cvModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });

        closeModalBtn.addEventListener('click', () => {
            cvModal.classList.remove('show');
            document.body.style.overflow = '';
        });

        // Close on outside click
        cvModal.addEventListener('click', (e) => {
            if (e.target === cvModal) {
                cvModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cvModal.classList.contains('show')) {
                cvModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }

    // Background Typing Animation
    const codeSnippets = [
        "function init() {",
        "  console.log('Booting...');",
        "  connectDb();",
        "}",
        "const data = await fetch('/api/v1/users');",
        "return data.json();",
        "class App extends Component {",
        "  render() {",
        "    return <div/>;",
        "  }",
        "}",
        "SELECT * FROM users",
        "WHERE active = true;",
        "docker-compose up -d",
        "def calc_metrics(data):",
        "    return sum(data) / len(data)",
        "01010011 01111001 01110011",
        "01110100 01100101 01101101",
        "npm run build",
        "git commit -m 'Deploy'"
    ];

    const leftCol = document.querySelector('.left-col');
    const rightCol = document.querySelector('.right-col');
    
    function highlightSyntax(code) {
        return code
            .replace(/\b(function|const|let|var|await|return|class|extends|def|import|from|SELECT|FROM|WHERE|true|false)\b/g, '<span class="sy-kw">$1</span>')
            .replace(/('.*?'|".*?")/g, '<span class="sy-str">$1</span>')
            .replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span class="sy-fn">$1</span>')
            .replace(/(01[01 ]+)/g, '<span class="sy-bin">$1</span>')
            .replace(/(&lt;.*?&gt;)/g, '<span class="sy-tag">$1</span>');
    }
    
    function startTyping(container) {
        if (!container) return;
        
        let snippetIndex = Math.floor(Math.random() * codeSnippets.length);
        let charIndex = 0;
        let lineDiv = document.createElement('div');
        container.appendChild(lineDiv);
        
        function typeChar() {
            const snippet = codeSnippets[snippetIndex];
            if (charIndex < snippet.length) {
                const currentText = snippet.substring(0, charIndex + 1);
                const escapedText = currentText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                lineDiv.innerHTML = highlightSyntax(escapedText);
                charIndex++;
                setTimeout(typeChar, Math.random() * 50 + 20); // typing speed
            } else {
                // Done typing line
                setTimeout(() => {
                    snippetIndex = Math.floor(Math.random() * codeSnippets.length);
                    charIndex = 0;
                    lineDiv = document.createElement('div');
                    container.appendChild(lineDiv);
                    
                    // Keep maximum of 40 lines to prevent DOM bloat
                    if (container.children.length > 40) {
                        container.removeChild(container.firstChild);
                    }
                    
                    typeChar();
                }, Math.random() * 1000 + 500); // pause before next line
            }
        }
        
        typeChar();
    }

    startTyping(leftCol);
    setTimeout(() => startTyping(rightCol), 1500); // stagger right column

    // Profile Image Hover Effect
    const profileWrapper = document.querySelector('.profile-wrapper');
    if (profileWrapper) {
        profileWrapper.addEventListener('mousemove', (e) => {
            const rect = profileWrapper.getBoundingClientRect();
            // Calculate cursor position relative to the wrapper
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            profileWrapper.style.setProperty('--cursor-x', `${x}px`);
            profileWrapper.style.setProperty('--cursor-y', `${y}px`);
        });
        
        // Reset when mouse leaves
        profileWrapper.addEventListener('mouseleave', () => {
            profileWrapper.style.setProperty('--cursor-x', `-100px`);
            profileWrapper.style.setProperty('--cursor-y', `-100px`);
        });
    }

    // Fetch and populate data from data.json
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load data.json');
            }
            return response.json();
        })
        .then(data => {
            // Populate Portfolio
            const portfolioContainer = document.getElementById('portfolio-grid-container');
            if (portfolioContainer && data.portfolio) {
                data.portfolio.forEach(project => {
                    const card = document.createElement('div');
                    card.className = 'portfolio-card';
                    card.innerHTML = `
                        <div class="card-image">${project.image}</div>
                        <div class="card-content">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                        </div>
                    `;
                    portfolioContainer.appendChild(card);
                });
            }

            // Populate Experience
            const experienceContainer = document.getElementById('experience-list-container');
            if (experienceContainer && data.experience) {
                data.experience.forEach(exp => {
                    const li = document.createElement('li');
                    li.textContent = exp;
                    experienceContainer.appendChild(li);
                });
            }

            // Populate Tech Stacks
            const techStacksContainer = document.getElementById('tech-stacks-container');
            if (techStacksContainer && data.techStacks) {
                data.techStacks.forEach(tech => {
                    const span = document.createElement('span');
                    span.className = 'skill-tag';
                    if (tech.highlight) {
                        span.classList.add('highlight-border');
                    }
                    span.textContent = tech.name;
                    techStacksContainer.appendChild(span);
                });
            }

            // Populate CV Link
            if (data.cv && data.cv.url) {
                const cvIframe = document.getElementById('cv-iframe');
                const cvFallbackLink = document.getElementById('cv-fallback-link');
                if (cvIframe) cvIframe.src = data.cv.url;
                if (cvFallbackLink) cvFallbackLink.href = data.cv.url;
            }

            // Populate Contact Links
            const contactLinksContainer = document.getElementById('contact-links-container');
            if (contactLinksContainer && data.contactLinks) {
                data.contactLinks.forEach(link => {
                    const a = document.createElement('a');
                    a.className = 'btn btn-outline';
                    a.href = link.url;
                    if (link.target) a.target = link.target;
                    
                    const icon = document.createElement('i');
                    icon.className = link.icon;
                    
                    a.appendChild(icon);
                    a.appendChild(document.createTextNode(' ' + link.label));
                    
                    contactLinksContainer.appendChild(a);
                });
            }

            // Populate About Text
            const aboutTextContainer = document.getElementById('about-text-container');
            if (aboutTextContainer && data.aboutText) {
                aboutTextContainer.innerHTML = data.aboutText;
            }

            // Populate Social Links
            const socialLinksContainer = document.getElementById('social-links-container');
            if (socialLinksContainer && data.socialLinks) {
                data.socialLinks.forEach(link => {
                    const a = document.createElement('a');
                    a.target = "_blank";
                    a.href = link.url;
                    
                    const icon = document.createElement('i');
                    icon.className = link.icon;
                    
                    a.appendChild(icon);
                    a.appendChild(document.createTextNode(' ' + link.label));
                    
                    socialLinksContainer.appendChild(a);
                });
            }
        })
        .catch(error => {
            console.error('Error loading portfolio data:', error);
        });
});
