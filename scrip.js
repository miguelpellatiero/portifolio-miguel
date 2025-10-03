// ============ DECLARAÇÕES GLOBAIS ============ //
let bubble; // Variável global para a bolha

// Função global para mover a bolha
function moveBubbleToIndex(index) {
    if (!bubble) {
        bubble = document.querySelector('.bubble');
        if (!bubble) return;
    }
    
    const targetItem = document.querySelector(`.nav-item[data-index="${index}"]`);
    if (targetItem) {
        const itemRect = targetItem.getBoundingClientRect();
        const navRect = document.querySelector('.bubble-nav').getBoundingClientRect();
        
        const left = itemRect.left - navRect.left;
        const top = 8; // Posição fixa do topo do container
        
        bubble.style.transform = `translate(${left}px, ${top}px)`;
    }
}

// ============ PARTICULAS ============ //
(function particles(){
    const wrap = document.getElementById('particles');
    const count = 42;
    for(let i=0;i<count;i++){
        const d = document.createElement('div');
        d.className = 'particle';
        d.style.left = Math.random()*100 + 'vw';
        d.style.top  = Math.random()*100 + 'vh';
        d.style.setProperty('--dur', (4 + Math.random()*6) + 's');
        d.style.opacity = (0.35 + Math.random()*0.6).toFixed(2);
        wrap.appendChild(d);
    }
})();

// ============ BUBBLE NAVIGATION ============ //
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    bubble = document.querySelector('.bubble'); // Atribui à variável global
    const bubbleNav = document.querySelector('.bubble-nav');
    
    // Posiciona a bolha no item ativo inicial
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
        const index = activeItem.getAttribute('data-index');
        moveBubbleToIndex(index);
    }
    
    // Adiciona eventos de mouse para cada item
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const index = this.getAttribute('data-index');
            moveBubbleToIndex(index);
            
            // Atualiza o item ativo
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
        
        // Adiciona clique para navegação
        item.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Efeito de movimento suave ao redor do menu (apenas horizontal)
    document.querySelector('.bubble-nav').addEventListener('mousemove', function(e) {
        const navRect = this.getBoundingClientRect();
        const x = e.clientX - navRect.left;
        
        // Encontra o item mais próximo horizontalmente
        let closestItem = null;
        let minDistance = Infinity;
        
        navItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const itemCenterX = itemRect.left + itemRect.width/2 - navRect.left;
            
            // Calcula apenas a distância horizontal
            const distance = Math.abs(x - itemCenterX);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestItem = item;
            }
        });
        
        // Se o mouse estiver próximo o suficiente de um item, move a bolha
        if (minDistance < 60) {
            const index = closestItem.getAttribute('data-index');
            moveBubbleToIndex(index);
            
            // Atualiza o item ativo
            navItems.forEach(nav => nav.classList.remove('active'));
            closestItem.classList.add('active');
        }
    });
    
    // ============ ESCONDER NAV AO ROLAR ============ //
    let lastScrollTop = 0;
    let scrollTimeout;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Esconde a nav quando rolando para baixo
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            bubbleNav.classList.add('hidden');
        } else {
            // Mostra a nav quando rolando para cima
            bubbleNav.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
        
        // Mostra a nav quando o usuário para de rolar
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            bubbleNav.classList.remove('hidden');
        }, 1500);
    });
    
    // Mostra a nav quando o mouse se aproxima do topo
    document.addEventListener('mousemove', function(e) {
        if (e.clientY < 100) {
            bubbleNav.classList.remove('hidden');
        }
    });
});

// ============ HIGHLIGHT DO LINK ATIVO ============ //
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.nav-item');
    const sections = [...document.querySelectorAll('section[id]')];
    const obs = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                const targetId = entry.target.id;
                links.forEach(l=>{
                    l.classList.toggle('active', l.getAttribute('data-target') === targetId);
                    if (l.getAttribute('data-target') === targetId) {
                        const index = l.getAttribute('data-index');
                        moveBubbleToIndex(index);
                    }
                });
            }
        });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 });
    sections.forEach(s=>obs.observe(s));
});

// ============ CARROSSEL ============ //
document.addEventListener('DOMContentLoaded', function() {
    const car = document.getElementById('carousel');
    const left = document.getElementById('carLeft');
    const right = document.getElementById('carRight');
    
    if (!car || !left || !right) return;
    
    const step = () => Math.max(300, car.clientWidth * 0.8);

    // arraste com roda do mouse
    car.addEventListener('wheel', (e)=> {
        e.preventDefault();
        car.scrollBy({ left: e.deltaY, behavior: 'smooth' });
    }, { passive: false });

    // botões
    left.addEventListener('click', ()=> car.scrollBy({ left: -step(), behavior: 'smooth' }));
    right.addEventListener('click', ()=> car.scrollBy({ left: step(), behavior: 'smooth' }));

    // arraste com mouse/touch
    let isDown = false, startX, scrollLeft;
    car.addEventListener('pointerdown', (e)=>{
        isDown = true; 
        car.setPointerCapture(e.pointerId);
        startX = e.clientX; 
        scrollLeft = car.scrollLeft;
    });
    
    car.addEventListener('pointermove', (e)=>{
        if(!isDown) return;
        const walk = (e.clientX - startX) * 1.1;
        car.scrollLeft = scrollLeft - walk;
    });
    
    ['pointerup','pointercancel','pointerleave'].forEach(ev => {
        car.addEventListener(ev, () => { isDown = false; });
    });
});

// ============ FORM CONTATO (DEMO) ============ //
function handleSubmit(e){
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    alert(`Obrigado, ${data.nome}! Sua mensagem foi registrada (demo).`);
    e.target.reset();
}

// ============ ANO NO FOOTER ============ //
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});