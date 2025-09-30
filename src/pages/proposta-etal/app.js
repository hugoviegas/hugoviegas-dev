// Apresentação Sistema de Gestão Integrado

// Estado da apresentação
let presentationState = {
  currentSlide: 0,
  totalSlides: 15,
  isTransitioning: false,
  touchStartX: 0,
  touchEndX: 0,
};

const navigationVisibilityState = {
  hideTimeout: null,
  autoHideDelay: 1600,
};

function getNavigationElements() {
  return {
    navigation: document.querySelector(".navigation"),
    progressBar: document.querySelector(".progress-bar"),
    progressText: document.getElementById("progress-text"),
  };
}

function setNavigationVisibility(visible) {
  const { navigation, progressBar, progressText } = getNavigationElements();
  if (!navigation) return;

  navigation.classList.toggle("nav-hidden", !visible);
  navigation.style.display = "flex";
  navigation.style.visibility = "visible";

  if (progressBar) {
    progressBar.classList.toggle("nav-hidden", !visible);
  }

  if (progressText) {
    progressText.classList.toggle("nav-hidden", !visible);
  }
}

function showNavigationBar() {
  clearTimeout(navigationVisibilityState.hideTimeout);
  setNavigationVisibility(true);
}

function scheduleNavigationHide() {
  if (!window.matchMedia || !window.matchMedia("(pointer: fine)").matches) {
    return;
  }

  clearTimeout(navigationVisibilityState.hideTimeout);

  navigationVisibilityState.hideTimeout = setTimeout(() => {
    const { navigation, progressBar, progressText } = getNavigationElements();
    if (!navigation) return;
    navigation.classList.add("nav-hidden");

    if (progressBar) {
      progressBar.classList.add("nav-hidden");
    }

    if (progressText) {
      progressText.classList.add("nav-hidden");
    }
  }, navigationVisibilityState.autoHideDelay);
}

function setupNavigationAutoHide() {
  if (!window.matchMedia || !window.matchMedia("(pointer: fine)").matches) {
    // Mantém visível em dispositivos touch
    setNavigationVisibility(true);
    return;
  }

  const { navigation, progressBar, progressText } = getNavigationElements();
  if (!navigation) return;

  const activationZone = () => window.innerHeight - 160;

  const handleMouseMove = (event) => {
    if (event.clientY >= activationZone()) {
      showNavigationBar();
    } else {
      scheduleNavigationHide();
    }
  };

  document.addEventListener("mousemove", handleMouseMove);

  [navigation, progressBar].forEach((element) => {
    element.addEventListener("mouseenter", () => {
      showNavigationBar();
    });
    element.addEventListener("mouseleave", () => {
      scheduleNavigationHide();
    });
  });

  // Ocultar após período de inatividade inicial
  scheduleNavigationHide();
}

// Inicialização da aplicação
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Inicializando apresentação...");

  initializePresentation();
  setupEventListeners();
  setupChart();

  // Aguardar um frame para garantir que o DOM está pronto
  requestAnimationFrame(() => {
    updateNavigation();
    updateProgress();
    updateIndicators();

    console.log("✅ Apresentação inicializada com sucesso!");
  });
});

// Inicializar apresentação
function initializePresentation() {
  // Criar indicadores de slides
  const indicatorsContainer = document.getElementById("slide-indicators");
  indicatorsContainer.innerHTML = ""; // Limpar conteúdo

  for (let i = 0; i < presentationState.totalSlides; i++) {
    const indicator = document.createElement("div");
    indicator.className = "indicator";
    indicator.setAttribute("data-slide", i);
    indicator.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      goToSlide(i);
    });
    indicatorsContainer.appendChild(indicator);
  }

  // Verificar se todos os slides existem
  const allSlides = [];
  for (let i = 1; i <= presentationState.totalSlides; i++) {
    const slide = document.getElementById(`slide-${i}`);
    if (slide) {
      allSlides.push(slide);
      // Remover todas as classes de estado
      slide.classList.remove("active", "prev");
    } else {
      console.warn(`❌ Slide ${i} não encontrado!`);
    }
  }

  // Marcar primeiro slide como ativo
  const firstSlide = document.getElementById("slide-1");
  if (firstSlide) {
    firstSlide.classList.add("active");
    console.log("✅ Primeiro slide ativado");
  } else {
    console.error("❌ Primeiro slide não encontrado!");
  }

  const firstIndicator = document.querySelector(".indicator");
  if (firstIndicator) {
    firstIndicator.classList.add("active");
  }

  // Adicionar animações de entrada para elementos
  addEntranceAnimations();

  // Garantir navegação visível
  showNavigationBar();

  console.log(
    "✅ Apresentação inicializada com",
    presentationState.totalSlides,
    "slides,",
    allSlides.length,
    "encontrados"
  );
}

// Setup de event listeners
function setupEventListeners() {
  // Navegação por botões
  const prevBtn = document.getElementById("prev-slide");
  const nextBtn = document.getElementById("next-slide");

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      previousSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      nextSlide();
    });
  }

  // Botão de tela cheia
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFullscreen();
    });
  }

  // Navegação por teclado
  document.addEventListener("keydown", handleKeyNavigation);

  // Navegação por touch/swipe
  document.addEventListener("touchstart", handleTouchStart, { passive: true });
  document.addEventListener("touchend", handleTouchEnd, { passive: true });

  // Navegação por mouse wheel (opcional, mas menos sensível)
  document.addEventListener("wheel", handleWheelNavigation, { passive: false });

  // Resize handler
  window.addEventListener("resize", handleResize);

  // CTA buttons
  setupCTAButtons();

  // Auto-hide da navegação
  setupNavigationAutoHide();

  console.log("Event listeners configurados");
}

// Navegação por teclado
function handleKeyNavigation(e) {
  if (presentationState.isTransitioning) return;

  switch (e.key) {
    case "ArrowLeft":
    case "ArrowUp":
      e.preventDefault();
      previousSlide();
      break;
    case "ArrowRight":
    case "ArrowDown":
    case " ":
      e.preventDefault();
      nextSlide();
      break;
    case "Home":
      e.preventDefault();
      goToSlide(0);
      break;
    case "End":
      e.preventDefault();
      goToSlide(presentationState.totalSlides - 1);
      break;
  }
}

// Navegação por touch
function handleTouchStart(e) {
  presentationState.touchStartX = e.touches[0].clientX;
}

function handleTouchEnd(e) {
  if (presentationState.isTransitioning) return;

  presentationState.touchEndX = e.changedTouches[0].clientX;
  const difference =
    presentationState.touchStartX - presentationState.touchEndX;
  const threshold = 50;

  if (Math.abs(difference) > threshold) {
    if (difference > 0) {
      // Swipe left - next slide
      nextSlide();
    } else {
      // Swipe right - previous slide
      previousSlide();
    }
  }
}

// Navegação por mouse wheel (menos sensível)
function handleWheelNavigation(e) {
  if (presentationState.isTransitioning) return;

  const threshold = 50; // Aumentado para ser menos sensível
  if (Math.abs(e.deltaY) > threshold) {
    e.preventDefault();

    // Debounce wheel events
    if (presentationState.wheelTimeout) {
      clearTimeout(presentationState.wheelTimeout);
    }

    presentationState.wheelTimeout = setTimeout(() => {
      if (e.deltaY > 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    }, 100);
  }
}

// Funções de navegação
function nextSlide() {
  if (presentationState.isTransitioning) return;

  const nextIndex = Math.min(
    presentationState.currentSlide + 1,
    presentationState.totalSlides - 1
  );
  if (nextIndex !== presentationState.currentSlide) {
    goToSlide(nextIndex);
  }
}

function previousSlide() {
  if (presentationState.isTransitioning) return;

  const prevIndex = Math.max(presentationState.currentSlide - 1, 0);
  if (prevIndex !== presentationState.currentSlide) {
    goToSlide(prevIndex);
  }
}

function goToSlide(slideIndex) {
  if (
    slideIndex === presentationState.currentSlide ||
    presentationState.isTransitioning
  ) {
    console.log("Transição bloqueada:", {
      slideIndex,
      currentSlide: presentationState.currentSlide,
      isTransitioning: presentationState.isTransitioning,
    });
    return;
  }

  if (slideIndex < 0 || slideIndex >= presentationState.totalSlides) {
    console.log("Índice de slide inválido:", slideIndex);
    return;
  }

  console.log(
    `Navegando do slide ${presentationState.currentSlide + 1} para ${
      slideIndex + 1
    }`
  );

  presentationState.isTransitioning = true;

  const currentSlideElement = document.getElementById(
    `slide-${presentationState.currentSlide + 1}`
  );
  const nextSlideElement = document.getElementById(`slide-${slideIndex + 1}`);

  if (!currentSlideElement || !nextSlideElement) {
    console.error("Elementos de slide não encontrados");
    presentationState.isTransitioning = false;
    return;
  }

  // Remover classe active do slide atual
  currentSlideElement.classList.remove("active");

  // Determinar direção da transição
  const isForward = slideIndex > presentationState.currentSlide;

  // Aplicar classe de transição
  if (isForward) {
    currentSlideElement.classList.add("prev");
  } else {
    nextSlideElement.classList.add("prev");
    setTimeout(() => {
      nextSlideElement.classList.remove("prev");
    }, 50);
  }

  // Ativar novo slide
  setTimeout(() => {
    nextSlideElement.classList.add("active");

    // Cleanup após transição
    setTimeout(() => {
      currentSlideElement.classList.remove("prev");
      presentationState.currentSlide = slideIndex;
      presentationState.isTransitioning = false;

      // Atualizar elementos visuais com o novo estado
      updateProgress();
      updateIndicators();

      // Atualizar navegação após mudança de estado
      updateNavigation();

      // Trigger animações específicas do slide
      triggerSlideAnimations(slideIndex);

      // Registrar visualização do slide
      logSlideView(slideIndex);

      console.log(`Transição concluída para slide ${slideIndex + 1}`);
    }, 300);
  }, 50);
}

// Atualizar navegação
function updateNavigation() {
  console.log(
    "🔄 Atualizando navegação para slide:",
    presentationState.currentSlide + 1
  );

  showNavigationBar();
  scheduleNavigationHide();

  const prevBtn = document.getElementById("prev-slide");
  const nextBtn = document.getElementById("next-slide");
  const currentSlideNumber = document.getElementById("current-slide-number");
  const totalSlidesNumber = document.getElementById("total-slides-number");
  const slideTitle = document.getElementById("current-slide-title");
  const navigation = document.querySelector(".navigation");

  // Garantir que a navegação esteja visível
  if (navigation) {
    navigation.style.display = "flex";
    navigation.style.visibility = "visible";
    navigation.style.opacity = "1";
  }

  // Atualizar botões
  if (prevBtn) {
    prevBtn.disabled = presentationState.currentSlide === 0;
    prevBtn.style.opacity = prevBtn.disabled ? "0.3" : "1";
  }

  if (nextBtn) {
    nextBtn.disabled =
      presentationState.currentSlide === presentationState.totalSlides - 1;
    nextBtn.style.opacity = nextBtn.disabled ? "0.3" : "1";
  }

  // Atualizar contador
  if (currentSlideNumber) {
    currentSlideNumber.textContent = presentationState.currentSlide + 1;
  }
  if (totalSlidesNumber) {
    totalSlidesNumber.textContent = presentationState.totalSlides;
  }

  // Atualizar título do slide atual
  if (slideTitle) {
    const currentSlideTitle = getSlideTitleByIndex(
      presentationState.currentSlide
    );
    slideTitle.textContent = currentSlideTitle;
  }

  // Centralizar indicador ativo
  centerActiveIndicator();

  console.log("✅ Navegação atualizada com sucesso");
}

// Atualizar barra de progresso
function updateProgress() {
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");

  if (progressFill) {
    const progress =
      ((presentationState.currentSlide + 1) / presentationState.totalSlides) *
      100;
    progressFill.style.width = `${progress}%`;
  }

  if (progressText) {
    progressText.textContent = `${presentationState.currentSlide + 1}/${
      presentationState.totalSlides
    }`;
  }
}

// Obter título do slide por índice
function getSlideTitleByIndex(index) {
  const slideTitles = [
    "Sistema de Gestão Integrado",
    "Desafios do Controle Atual",
    "Sistema Integrado em 5 Módulos",
    "Demonstração Interativa",
    "QR Code + Plano de Trabalho",
    "KPIs e Dashboards",
    "Gestão de Manutenção",
    "HC - Funcionários",
    "Sistema de Chamados",
    "Cronograma de Desenvolvimento",
    "Tranquilidade Garantida",
    "Alternativas do Mercado",
    "Investimento e Retorno",
    "Por que Hugo Viegas?",
    "Pronto para Transformar?",
  ];

  return slideTitles[index] || `Slide ${index + 1}`;
}

// Centralizar indicador ativo na visualização
function centerActiveIndicator() {
  const indicatorsContainer = document.getElementById("slide-indicators");
  const activeIndicator = document.querySelector(".indicator.active");

  if (indicatorsContainer && activeIndicator) {
    const containerWidth = indicatorsContainer.offsetWidth;
    const indicatorLeft = activeIndicator.offsetLeft;
    const indicatorWidth = activeIndicator.offsetWidth;

    const scrollLeft = indicatorLeft - containerWidth / 2 + indicatorWidth / 2;
    indicatorsContainer.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  }
}

// Atualizar indicadores
function updateIndicators() {
  const indicators = document.querySelectorAll(".indicator");
  indicators.forEach((indicator, index) => {
    const isActive = index === presentationState.currentSlide;
    indicator.classList.toggle("active", isActive);

    // Adicionar feedback visual
    if (isActive) {
      indicator.style.transform = "scale(1.2)";
      indicator.style.backgroundColor = "var(--color-primary)";
    } else {
      indicator.style.transform = "scale(1)";
      indicator.style.backgroundColor = "var(--color-border)";
    }
  });
}

// Setup do gráfico
function setupChart() {
  // Verificar se Chart.js está disponível
  if (typeof Chart !== "undefined") {
    setupChartJS();
  } else {
    // Fallback: criar um gráfico simples com Canvas
    setTimeout(createSimpleChart, 100);
  }
}

function setupChartJS() {
  const ctx = document.getElementById("mini-chart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      datasets: [
        {
          label: "Performance",
          data: [65, 78, 90, 81, 92, 95],
          borderColor: "#218085",
          backgroundColor: "rgba(33, 128, 141, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
      },
    },
  });
}

// Gráfico simples como fallback
function createSimpleChart() {
  const canvas = document.getElementById("mini-chart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = (canvas.width = 200);
  const height = (canvas.height = 120);

  // Limpar canvas
  ctx.clearRect(0, 0, width, height);

  // Dados simulados
  const data = [65, 78, 90, 81, 92, 95];
  const max = Math.max(...data);
  const min = Math.min(...data);

  // Configuração
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Desenhar linha
  ctx.strokeStyle = "#218085";
  ctx.lineWidth = 2;
  ctx.beginPath();

  data.forEach((value, index) => {
    const x = padding + (index * chartWidth) / (data.length - 1);
    const y =
      padding + chartHeight - ((value - min) / (max - min)) * chartHeight;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Preencher área
  ctx.fillStyle = "rgba(33, 128, 141, 0.1)";
  ctx.lineTo(padding + chartWidth, padding + chartHeight);
  ctx.lineTo(padding, padding + chartHeight);
  ctx.closePath();
  ctx.fill();
}

// Animações específicas por slide
function triggerSlideAnimations(slideIndex) {
  console.log("🎬 Iniciando animações para slide:", slideIndex + 1);

  const slideElement = document.getElementById(`slide-${slideIndex + 1}`);
  if (!slideElement) {
    console.warn(
      "❌ Elemento do slide não encontrado:",
      `slide-${slideIndex + 1}`
    );
    return;
  }

  // Remover animações anteriores
  const animatedElements = slideElement.querySelectorAll(".animated");
  animatedElements.forEach((el) => {
    el.classList.remove("animated");
    el.style.animation = "";
  });

  // Garantir que a navegação permaneça visível
  showNavigationBar();
  scheduleNavigationHide();

  // Aplicar novas animações com delay
  setTimeout(() => {
    const cards = slideElement.querySelectorAll(
      ".problem-card, .module-card, .support-card, .portfolio-card"
    );
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("animated");
        card.style.animation = `slideInFromBottom 0.6s ease-out forwards`;
      }, index * 100);
    });

    const benefits = slideElement.querySelectorAll(".benefit-item");
    benefits.forEach((benefit, index) => {
      setTimeout(() => {
        benefit.classList.add("animated");
        benefit.style.animation = `slideInFromRight 0.4s ease-out forwards`;
      }, index * 80);
    });

    // Animação específica para o comparativo de investimento (slide 12)
    if (slideIndex === 11) {
      // slide-12 tem índice 11
      console.log("💰 Iniciando animação de investimento");
      setTimeout(() => {
        animateInvestmentValue();
      }, 500);
    }
  }, 200);
}

// Adicionar animações de entrada
function addEntranceAnimations() {
  // Verificar se o style já existe
  if (document.getElementById("entrance-animations")) return;

  const style = document.createElement("style");
  style.id = "entrance-animations";
  style.textContent = `
    @keyframes slideInFromBottom {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideInFromRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .slide:not(.active) .problem-card,
    .slide:not(.active) .module-card,
    .slide:not(.active) .support-card,
    .slide:not(.active) .portfolio-card,
    .slide:not(.active) .benefit-item {
      opacity: 0;
    }
    
    /* Melhorar visibilidade dos botões de navegação */
    .nav-btn {
      background: var(--color-surface) !important;
      border: 1px solid var(--color-border) !important;
      box-shadow: var(--shadow-sm) !important;
      transition: all 0.2s ease !important;
    }
    
    .nav-btn:hover:not(:disabled) {
      background: var(--color-primary) !important;
      color: var(--color-btn-primary-text) !important;
      transform: scale(1.05) !important;
    }
    
    .indicator {
      cursor: pointer !important;
      transition: all 0.2s ease !important;
    }
    
    .indicator:hover {
      background: var(--color-primary) !important;
      transform: scale(1.3) !important;
    }
  `;
  document.head.appendChild(style);
}

// Setup dos botões CTA
function setupCTAButtons() {
  const primaryCTA = document.querySelector(".cta-button.primary");
  const secondaryCTA = document.querySelector(".cta-button.secondary");

  if (primaryCTA) {
    primaryCTA.addEventListener("click", function (e) {
      e.preventDefault();
      showNotification(
        "Obrigado pelo interesse! Entraremos em contato em breve.",
        "success"
      );
    });
  }

  if (secondaryCTA) {
    secondaryCTA.addEventListener("click", function (e) {
      e.preventDefault();
      showNotification("Redirecionando para agendamento...", "info");
    });
  }
}

// Sistema de notificações
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${
        type === "success" ? "fa-check-circle" : "fa-info-circle"
      }"></i>
      <span>${message}</span>
    </div>
  `;

  // Estilos da notificação
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-surface);
    border: 1px solid var(--color-card-border);
    border-radius: var(--radius-base);
    padding: var(--space-16);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease-out;
    max-width: 300px;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Handle resize
function handleResize() {
  if (presentationState.currentSlide === 5) {
    // Slide do KPI
    setTimeout(createSimpleChart, 100);
  }
}

// Logging e analytics
function logSlideView(slideIndex) {
  const slideTitle =
    document.querySelector(`#slide-${slideIndex + 1} h2`)?.textContent ||
    "Sem título";
  console.log(
    `📊 Visualizando slide ${slideIndex + 1}/${
      presentationState.totalSlides
    }: ${slideTitle}`
  );
}

// Funcionalidade de tela cheia
function toggleFullscreen() {
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const icon = fullscreenBtn.querySelector("i");

  if (!document.fullscreenElement) {
    // Entrar em tela cheia
    document.documentElement
      .requestFullscreen()
      .then(() => {
        icon.className = "fas fa-compress";
        fullscreenBtn.title = "Sair da Tela Cheia";
      })
      .catch((err) => {
        console.log("Erro ao entrar em tela cheia:", err);
      });
  } else {
    // Sair da tela cheia
    document
      .exitFullscreen()
      .then(() => {
        icon.className = "fas fa-expand";
        fullscreenBtn.title = "Tela Cheia";
      })
      .catch((err) => {
        console.log("Erro ao sair da tela cheia:", err);
      });
  }
}

// Detectar mudanças de tela cheia via ESC
document.addEventListener("fullscreenchange", () => {
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const icon = fullscreenBtn?.querySelector("i");

  if (icon) {
    if (document.fullscreenElement) {
      icon.className = "fas fa-compress";
      fullscreenBtn.title = "Sair da Tela Cheia";
    } else {
      icon.className = "fas fa-expand";
      fullscreenBtn.title = "Tela Cheia";
    }
  }
});

// Exportar API pública
window.presentationAPI = {
  nextSlide,
  previousSlide,
  goToSlide,
  getCurrentSlide: () => presentationState.currentSlide,
  getTotalSlides: () => presentationState.totalSlides,
};

// Animação do valor do investimento
function animateInvestmentValue() {
  const amountElement = document.getElementById("investment-amount");
  if (!amountElement) return;

  const targetValue = parseInt(amountElement.dataset.target || "40000", 10);
  const duration = 2000; // 2 segundos
  const startTime = performance.now();

  amountElement.textContent = "0";

  function updateValue(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Função de easing (ease-out)
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const currentValue = Math.floor(targetValue * easedProgress);
    amountElement.textContent = currentValue.toLocaleString("pt-BR");

    if (progress < 1) {
      requestAnimationFrame(updateValue);
    } else {
      amountElement.textContent = targetValue.toLocaleString("pt-BR");
    }
  }

  requestAnimationFrame(updateValue);
}

// Observer simplificado para o slide de investimento (removido pois agora usa triggerSlideAnimations)
// Função mantida por compatibilidade, mas não é mais necessária

// Debugging helpers
window.debugPresentation = () => {
  console.log("Estado atual:", presentationState);
  console.log(
    "Slides encontrados:",
    document.querySelectorAll(".slide").length
  );
  console.log("Indicadores:", document.querySelectorAll(".indicator").length);
  console.log("Botões de navegação:", {
    prev: !!document.getElementById("prev-slide"),
    next: !!document.getElementById("next-slide"),
  });
};

console.log(
  "🚀 Apresentação Sistema de Gestão Integrado carregada com sucesso!"
);
console.log(
  "💡 Use debugPresentation() no console para debug ou presentationAPI para controle programático"
);
