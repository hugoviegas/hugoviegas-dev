import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  ExternalLink,
} from "lucide-react";

const PropostaPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalSlides = 15;

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

  const goToSlide = useCallback(
    (slideIndex: number) => {
      if (slideIndex === currentSlide || isTransitioning) return;
      if (slideIndex < 0 || slideIndex >= totalSlides) return;

      setIsTransitioning(true);
      setCurrentSlide(slideIndex);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    },
    [currentSlide, isTransitioning, totalSlides]
  );

  const nextSlide = useCallback(() => {
    const next = Math.min(currentSlide + 1, totalSlides - 1);
    if (next !== currentSlide) goToSlide(next);
  }, [currentSlide, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = Math.max(currentSlide - 1, 0);
    if (prev !== currentSlide) goToSlide(prev);
  }, [currentSlide, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          prevSlide();
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
          goToSlide(totalSlides - 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTransitioning, prevSlide, nextSlide, goToSlide, totalSlides]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return <Slide1 />;
      case 1:
        return <Slide2 />;
      case 2:
        return <Slide3 />;
      case 3:
        return <Slide4 />;
      case 4:
        return <Slide5 />;
      case 5:
        return <Slide6 />;
      case 6:
        return <Slide7 />;
      case 7:
        return <Slide8 />;
      case 8:
        return <Slide9 />;
      case 9:
        return <Slide10 />;
      case 10:
        return <Slide11 />;
      case 11:
        return <Slide12 />;
      case 12:
        return <Slide13 />;
      case 13:
        return <Slide14 />;
      case 14:
        return <Slide15 />;
      default:
        return <Slide1 />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-border z-50">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Slide Content */}
      <div className="w-full h-screen flex items-center justify-center p-6">
        <div
          className={`w-full max-w-6xl mx-auto transition-all duration-300 ${
            isTransitioning
              ? "opacity-0 transform translate-x-4"
              : "opacity-100 transform translate-x-0"
          }`}
        >
          {renderSlide()}
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 bg-card/80 backdrop-blur-md rounded-full px-6 py-3 border border-border/30 shadow-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{currentSlide + 1}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">{totalSlides}</span>
          </div>

          <div className="flex gap-1">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-primary scale-125"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="rounded-full ml-2"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Slide Title */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-card/80 backdrop-blur-md rounded-full px-4 py-2 border border-border/30">
          <h1 className="text-sm font-medium text-center">
            {slideTitles[currentSlide]}
          </h1>
        </div>
      </div>
    </div>
  );
};

// Individual slide components
const Slide1 = () => (
  <div className="text-center space-y-8">
    <div className="text-6xl text-primary mb-8">
      <i className="fas fa-cogs"></i>
    </div>
    <h1 className="text-5xl font-bold mb-4">Sistema de Gestão Integrado</h1>
    <p className="text-xl text-muted-foreground mb-8">
      Solução completa com 5 módulos integrados
    </p>
    <div className="space-y-4 max-w-md mx-auto">
      <div className="flex justify-between items-center py-3 border-b border-border">
        <span className="text-muted-foreground">Cliente:</span>
        <span className="font-semibold">Etal Prestação de Serviços LTDA</span>
      </div>
      <div className="flex justify-between items-center py-3 border-b border-border">
        <span className="text-muted-foreground">Desenvolvedor:</span>
        <span className="font-semibold">Hugo Viegas</span>
      </div>
    </div>
  </div>
);

const Slide2 = () => (
  <div className="space-y-8">
    <h2 className="text-4xl font-bold text-center mb-12">
      Desafios do Controle Atual
    </h2>
    <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
      {[
        {
          icon: "fas fa-exclamation-triangle",
          title: "Registro Impreciso",
          desc: "Não existe controle de registro preciso para obrigação contratual",
        },
        {
          icon: "fas fa-table",
          title: "Planilhas Desorganizadas",
          desc: "Equipamentos controlados com planilhas desorganizadas",
        },
        {
          icon: "fas fa-envelope",
          title: "Chamados sem Controle",
          desc: "Chamados abertos por email sem controle interno",
        },
        {
          icon: "fas fa-chart-line",
          title: "Sem Monitoramento",
          desc: "Falta monitoramento programado x realizado",
        },
      ].map((problem, index) => (
        <div
          key={index}
          className="bg-card rounded-xl p-6 text-center hover:scale-105 transition-transform"
        >
          <div className="text-3xl text-destructive mb-4">
            <i className={problem.icon}></i>
          </div>
          <h3 className="text-lg font-semibold mb-3">{problem.title}</h3>
          <p className="text-muted-foreground">{problem.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const Slide3 = () => (
  <div className="space-y-8">
    <h2 className="text-4xl font-bold text-center mb-12">
      Sistema Integrado em 5 Módulos
    </h2>
    <div className="grid grid-cols-3 grid-rows-2 gap-6 max-w-5xl mx-auto">
      {[
        {
          icon: "fas fa-qrcode",
          title: "QR + Plano de Trabalho",
          desc: "Check-list online, rotinas/frequências",
          color: "bg-blue-500/10",
        },
        {
          icon: "fas fa-chart-bar",
          title: "KPIs e Dashboards",
          desc: "SLA, indicadores, relatórios",
          color: "bg-yellow-500/10",
        },
        {
          icon: "fas fa-wrench",
          title: "Gestão de Manutenção",
          desc: "Preventiva/corretiva, utilização",
          color: "bg-green-500/10",
        },
        {
          icon: "fas fa-users",
          title: "HC - Funcionários",
          desc: "Controle variação mensal",
          color: "bg-red-500/10",
        },
        {
          icon: "fas fa-headset",
          title: "Sistema de Chamados",
          desc: "OS com controle interno",
          color: "bg-purple-500/10",
        },
      ].map((module, index) => (
        <div
          key={index}
          className={`${module.color} rounded-xl p-6 text-center hover:scale-105 transition-transform`}
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <i className={`${module.icon} text-2xl text-primary`}></i>
          </div>
          <h3 className="font-semibold mb-2">{module.title}</h3>
          <p className="text-sm text-muted-foreground">{module.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const Slide4 = () => (
  <div className="text-center space-y-8">
    <div className="text-6xl text-primary mb-8">
      <i className="fas fa-play-circle"></i>
    </div>
    <h2 className="text-4xl font-bold mb-4">Demonstração Interativa</h2>
    <p className="text-xl text-muted-foreground mb-8">
      Vamos ver como cada módulo funciona na prática
    </p>
    <div className="space-y-6">
      <Button
        className="px-8 py-4 text-lg"
        onClick={() =>
          window.open(
            "https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/6375412fe6adff7c864872e61569f6e1/47b5e2f0-e80e-42d5-aa71-b887978a5267/index.html",
            "_blank"
          )
        }
      >
        <ExternalLink className="w-5 h-5 mr-2" />
        Testar Demo Agora
      </Button>
      <div className="flex justify-center gap-8 mt-8">
        {[
          { icon: "fas fa-mobile-alt", text: "Interface responsiva" },
          { icon: "fas fa-cloud", text: "Sincronização automática" },
          { icon: "fas fa-lock", text: "Dados seguros" },
        ].map((feature, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <i className={`${feature.icon} text-xl text-primary`}></i>
            <span className="text-sm text-muted-foreground">
              {feature.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Slide5 = () => (
  <div className="space-y-8">
    <h2 className="text-4xl font-bold text-center mb-12">
      QR Code + Plano de Trabalho
    </h2>
    <div className="grid grid-cols-2 gap-12 items-center">
      <div className="bg-card rounded-xl p-8">
        <div className="flex items-center gap-6">
          <div className="text-5xl text-primary">
            <i className="fas fa-qrcode"></i>
          </div>
          <div className="space-y-3">
            {[
              { checked: true, text: "Limpeza área comum" },
              { checked: false, text: "Verificar equipamentos" },
              { checked: false, text: "Registro de ocorrências" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <i
                  className={`fas ${
                    item.checked
                      ? "fa-check text-green-500"
                      : "far fa-square text-muted-foreground"
                  }`}
                ></i>
                <span
                  className={
                    item.checked ? "text-green-500" : "text-foreground"
                  }
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Recursos Principais</h3>
        {[
          { icon: "fas fa-wifi", text: "Scanner offline para check-list" },
          {
            icon: "fas fa-calendar-alt",
            text: "Rotinas e frequências configuráveis",
          },
          {
            icon: "fas fa-chart-line",
            text: "Monitoramento programado x realizado",
          },
          {
            icon: "fas fa-map-marker-alt",
            text: "Registro por local e serviço",
          },
        ].map((benefit, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-blue-500/5 rounded-lg"
          >
            <i className={`${benefit.icon} text-primary`}></i>
            <span>{benefit.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Slide6 = () => (
  <div className="space-y-8">
    <h2 className="text-4xl font-bold text-center mb-12">KPIs e Dashboards</h2>
    <div className="grid grid-cols-2 gap-12 items-center">
      <div className="bg-card rounded-xl p-8">
        <div className="bg-yellow-500/10 rounded-lg h-32 mb-4 flex items-center justify-center">
          <span className="text-muted-foreground">Gráfico de Performance</span>
        </div>
        <div className="flex gap-4">
          <div className="bg-green-500/10 rounded-lg p-4 text-center flex-1">
            <div className="text-2xl font-bold text-green-600">94%</div>
            <div className="text-sm text-muted-foreground">SLA</div>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-4 text-center flex-1">
            <div className="text-2xl font-bold text-blue-600">127</div>
            <div className="text-sm text-muted-foreground">Tarefas</div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Recursos Principais</h3>
        {[
          { icon: "fas fa-table", text: "Google Sheets integrado" },
          { icon: "fas fa-chart-pie", text: "Dashboards interativos" },
          { icon: "fas fa-stopwatch", text: "Monitoramento SLA" },
          { icon: "fas fa-bell", text: "Alertas automáticos" },
        ].map((benefit, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-yellow-500/5 rounded-lg"
          >
            <i className={`${benefit.icon} text-primary`}></i>
            <span>{benefit.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Slide7 = () => (
  <div className="space-y-8">
    <h2 className="text-4xl font-bold text-center mb-12">
      Gestão de Manutenção
    </h2>
    <div className="grid grid-cols-2 gap-12 items-center">
      <div className="bg-card rounded-xl p-8 space-y-4">
        <div className="flex items-center gap-3 bg-green-500/10 rounded-lg p-3">
          <i className="fas fa-calendar-check text-green-600"></i>
          <span>15 Ago - Preventiva</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-2">
            <i className="fas fa-circle text-green-500"></i>
            <span>Operacional</span>
          </div>
          <div className="flex items-center gap-3 p-2">
            <i className="fas fa-tools text-yellow-500"></i>
            <span>Manutenção</span>
          </div>
          <div className="bg-red-500/10 rounded-lg p-3 text-center">
            <span className="font-semibold">85% Utilização</span>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Recursos Principais</h3>
        {[
          { icon: "fas fa-calendar-alt", text: "Calendário de manutenções" },
          { icon: "fas fa-tools", text: "Controle preventiva/corretiva" },
          { icon: "fas fa-percentage", text: "Fator de utilização" },
          { icon: "fas fa-history", text: "Histórico completo" },
        ].map((benefit, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-green-500/5 rounded-lg"
          >
            <i className={`${benefit.icon} text-primary`}></i>
            <span>{benefit.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Slide8 = () => (
  <div className="space-y-8">
    <h2 className="text-4xl font-bold text-center mb-12">
      HC - Gestão de Pessoal Inteligente
    </h2>
    <div className="grid grid-cols-2 gap-12 items-center">
      <div className="bg-card rounded-xl p-8">
        <div className="bg-red-500/10 rounded-lg p-6">
          <div className="flex justify-around items-end h-32">
            {["Jan", "Fev", "Mar"].map((month, index) => (
              <div key={month} className="text-center">
                <div className="flex gap-1 mb-2">
                  <div
                    className={`w-4 bg-primary/70 rounded-sm`}
                    style={{ height: `${60 + index * 10}px` }}
                  ></div>
                  <div
                    className={`w-4 bg-green-500 rounded-sm`}
                    style={{ height: `${55 + index * 15}px` }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground">{month}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary/70 rounded"></div>
              <span className="text-xs">Planejado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-xs">Realizado</span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Recursos Principais</h3>
        {[
          { icon: "fas fa-chart-line", text: "Controle variação mensal" },
          {
            icon: "fas fa-balance-scale",
            text: "Comparativo contrato x realizado",
          },
          { icon: "fas fa-database", text: "Integração com BD atual" },
          { icon: "fas fa-file-alt", text: "Relatórios automáticos" },
        ].map((benefit, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-red-500/5 rounded-lg"
          >
            <i className={`${benefit.icon} text-primary`}></i>
            <span>{benefit.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Slide9 = () => (
  <div className="space-y-8">
    <h2 className="text-4xl font-bold text-center mb-12">
      Chamados e OS - Controle Total
    </h2>
    <div className="grid grid-cols-2 gap-12 items-center">
      <div className="bg-card rounded-xl p-8 space-y-4">
        <div className="flex items-center gap-3 bg-purple-500/10 rounded-lg p-3 cursor-pointer">
          <i className="fas fa-file-plus text-purple-600"></i>
          <span>Novo Chamado</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg">
            <span className="font-semibold">#001</span>
            <span className="text-red-600 text-sm">Urgente</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-yellow-500/10 rounded-lg">
            <span className="font-semibold">#002</span>
            <span className="text-yellow-600 text-sm">Em Andamento</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg">
            <span className="font-semibold">#003</span>
            <span className="text-green-600 text-sm">Concluído</span>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Recursos Principais</h3>
        {[
          {
            icon: "fas fa-clipboard-list",
            text: "Formulário online para abertura",
          },
          { icon: "fas fa-tasks", text: "Controle interno de status" },
          { icon: "fas fa-table", text: "Integração com Google Sheets" },
          { icon: "fas fa-bell", text: "Notificações automáticas" },
        ].map((benefit, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-purple-500/5 rounded-lg"
          >
            <i className={`${benefit.icon} text-primary`}></i>
            <span>{benefit.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Slide10 = () => (
  <div className="space-y-8">
    <h2 className="text-4xl font-bold text-center mb-12">
      Desenvolvimento Modular e Flexível
    </h2>
    <div className="max-w-4xl mx-auto">
      <p className="text-center text-lg text-muted-foreground mb-8">
        Cada módulo desenvolvido entre 1-2 meses com entregas incrementais
      </p>
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
        <div className="space-y-8">
          {[
            {
              title: "QR + Plano de Trabalho",
              desc: "1-2 meses • Prioridade máxima",
            },
            {
              title: "KPIs e Dashboards",
              desc: "1-2 meses • Relatórios essenciais",
            },
            {
              title: "Gestão de Manutenção",
              desc: "1-2 meses • Controle operacional",
            },
            {
              title: "HC - Funcionários",
              desc: "1-2 meses • Gestão de pessoal",
            },
            {
              title: "Sistema de Chamados",
              desc: "1-2 meses • Atendimento completo",
            },
          ].map((item, index) => (
            <div key={index} className="relative flex items-center">
              <div className="absolute left-6 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
              <div className="ml-16 bg-card rounded-lg p-4">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-8 mt-12">
        <div className="flex items-center gap-2 text-muted-foreground">
          <i className="fas fa-rocket text-primary"></i>
          <span>Desenvolvimento pode ser paralelo</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <i className="fas fa-sync text-primary"></i>
          <span>Flexibilidade na priorização</span>
        </div>
      </div>
    </div>
  </div>
);

const Slide11 = () => (
  <div className="space-y-8">
    <h2 className="text-4xl font-bold text-center mb-12">
      Tranquilidade Garantida
    </h2>
    <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
      {[
        {
          icon: "fas fa-calendar-alt",
          title: "1 ano de suporte incluído",
          desc: "Suporte técnico completo durante todo o primeiro ano",
        },
        {
          icon: "fas fa-graduation-cap",
          title: "Treinamento da equipe",
          desc: "Capacitação completa + Manuais de uso",
        },
        {
          icon: "fas fa-crown",
          title: "Sistema 100% seu",
          desc: "Após entrega, o sistema é completamente seu",
        },
        {
          icon: "fas fa-ban",
          title: "Sem assinaturas",
          desc: "Nenhuma mensalidade ou taxa recorrente",
        },
      ].map((support, index) => (
        <div
          key={index}
          className="bg-card rounded-xl p-6 text-center hover:scale-105 transition-transform"
        >
          <div className="text-3xl text-green-500 mb-4">
            <i className={support.icon}></i>
          </div>
          <h3 className="text-lg font-semibold mb-3">{support.title}</h3>
          <p className="text-muted-foreground">{support.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const Slide12 = () => (
  <div className="space-y-8">
    <h2 className="text-4xl font-bold text-center mb-8">
      Alternativas do Mercado
    </h2>
    <p className="text-center text-muted-foreground mb-8">
      Compare as opções disponíveis e suas limitações
    </p>

    <div className="bg-primary/10 rounded-xl p-6 mb-8 border-2 border-primary/20">
      <div className="flex items-center gap-4">
        <i className="fas fa-award text-3xl text-primary"></i>
        <p className="text-lg">
          Entrega completa com 5 módulos integrados, sem mensalidades de licença
          e com 1 ano de suporte incluso, desenhada sob medida para sua
          operação.
        </p>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-6">
      {/* SaaS Column */}
      <div className="bg-card rounded-xl p-6 border border-yellow-500/30">
        <div className="text-center mb-4">
          <i className="fas fa-cloud text-2xl text-yellow-600 mb-2"></i>
          <h3 className="font-semibold">Mercado (SaaS)</h3>
          <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">
            Custo Anual
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>QR Codes + Analytics</span>
            <span className="text-yellow-600">R$ 540 - R$ 6.600/ano</span>
          </div>
          <div className="flex justify-between">
            <span>Helpdesk/Chamados</span>
            <span className="text-yellow-600">R$ 3.600 - R$ 18.000/ano</span>
          </div>
          <div className="flex justify-between">
            <span>CMMS/Manutenção</span>
            <span className="text-yellow-600">R$ 4.800 - R$ 15.000/ano</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-500/10 rounded text-center">
          <strong>Total: R$ 15.000 - R$ 60.000/ano</strong>
          <p className="text-xs text-muted-foreground mt-1">
            Sem personalização profunda
            <br />
            Integrações fragmentadas
          </p>
        </div>
      </div>

      {/* Custom Column */}
      <div className="bg-card rounded-xl p-6 border border-blue-500/30">
        <div className="text-center mb-4">
          <i className="fas fa-code text-2xl text-blue-600 mb-2"></i>
          <h3 className="font-semibold">Sob Medida (Mercado)</h3>
          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
            Investimento Único
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Sistemas Web Personalizados</span>
            <span className="text-blue-600">R$ 40.000 - R$ 120.000</span>
          </div>
          <div className="flex justify-between">
            <span>Precificação por Hora</span>
            <span className="text-blue-600">R$ 80 - R$ 250/hora</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-500/10 rounded text-center">
          <strong>Faixa Típica: R$ 60.000 - R$ 150.000</strong>
          <p className="text-xs text-muted-foreground mt-1">
            Varia conforme escopo
            <br />
            Suporte não incluso
          </p>
        </div>
      </div>

      {/* Our Proposal */}
      <div className="bg-card rounded-xl p-6 border-2 border-primary">
        <div className="text-center mb-4">
          <i className="fas fa-star text-2xl text-primary mb-2"></i>
          <h3 className="font-semibold">Nossa Proposta</h3>
          <div className="flex items-center justify-center gap-1 text-xs bg-green-500 text-white px-2 py-1 rounded mt-1">
            <i className="fas fa-ban"></i>
            <span>Sem Assinaturas</span>
          </div>
        </div>
        <div className="space-y-2">
          {[
            "5 módulos unificados",
            "PWA com funcionamento offline",
            "KPIs/SLA em tempo real",
            "Sistema 100% seu",
            "1 ano de suporte incluso",
            "Evolutivo e modular",
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <i className="fas fa-check text-green-500"></i>
              <span>{feature}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-center text-muted-foreground mt-4">
          Investimento único, sem mensalidades ou taxas recorrentes
        </p>
      </div>
    </div>
  </div>
);

const Slide13 = () => (
  <div className="space-y-8">
    <h2 className="text-4xl font-bold text-center mb-8">
      Investimento e Retorno
    </h2>
    <p className="text-center text-muted-foreground mb-8">
      Veja como o retorno acontece na prática
    </p>

    <div className="grid grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
      {/* ROI Cards */}
      <div className="space-y-6">
        <div className="bg-card rounded-xl p-6 border-l-4 border-blue-500">
          <div className="text-center">
            <i className="fas fa-clock text-3xl text-blue-500 mb-4"></i>
            <h4 className="font-semibold mb-2">Payback estimado</h4>
            <p className="text-2xl font-bold text-primary mb-2">
              12 a 18 meses
            </p>
            <p className="text-sm text-muted-foreground">
              Retorno ao substituir assinaturas fragmentadas e processos manuais
            </p>
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 border-l-4 border-green-500">
          <div className="text-center">
            <i className="fas fa-piggy-bank text-3xl text-green-500 mb-4"></i>
            <h4 className="font-semibold mb-2">Economia anual</h4>
            <p className="text-2xl font-bold text-green-600 mb-2">
              R$ 24.000/ano
            </p>
            <p className="text-sm text-muted-foreground">
              Redução com eliminação de assinaturas e retrabalho
            </p>
          </div>
        </div>
      </div>

      {/* Investment Amount */}
      <div className="text-center">
        <div className="bg-primary/10 rounded-xl p-8 border-2 border-primary">
          <h3 className="text-xl font-semibold mb-4">Investimento único</h3>
          <div className="flex items-baseline justify-center gap-2 mb-4">
            <span className="text-xl text-muted-foreground">R$</span>
            <span className="text-5xl font-bold text-primary">40.000</span>
          </div>
          <p className="text-muted-foreground mb-2">
            Implantação completa + 1 ano de suporte
          </p>
          <p className="text-sm text-muted-foreground italic">
            *Menos que dois salários de um desenvolvedor
          </p>
        </div>
      </div>
    </div>

    {/* Investment Breakdown */}
    <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
      {[
        {
          icon: "fas fa-code",
          label: "Desenvolvimento",
          desc: "5 módulos integrados",
        },
        {
          icon: "fas fa-key",
          label: "Licenças",
          desc: "Zero (Google Workspace que já possuem)",
        },
        {
          icon: "fas fa-server",
          label: "Hospedagem",
          desc: "Cliente mantém atual",
        },
        { icon: "fas fa-headset", label: "Suporte", desc: "1 ano incluído" },
      ].map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 bg-card rounded-lg"
        >
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <i className={`${item.icon} text-primary`}></i>
          </div>
          <div>
            <div className="font-semibold">{item.label}</div>
            <div className="text-sm text-muted-foreground">{item.desc}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Slide14 = () => (
  <div className="space-y-8">
    <h2 className="text-4xl font-bold text-center mb-12">
      Por que escolher Hugo Viegas?
    </h2>
    <p className="text-center text-lg text-muted-foreground mb-8">
      Experiência comprovada em automação e sistemas inteligentes
    </p>

    <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto mb-8">
      {[
        {
          icon: "fas fa-graduation-cap",
          title: "Sistema de Gestão Educacional",
          desc: "Automação completa com Google Apps Script",
          tech: "Apps Script + Sheets",
        },
        {
          icon: "fas fa-chart-pie",
          title: "Dashboard de Vendas",
          desc: "KPIs automáticos e relatórios dinâmicos",
          tech: "Google Sheets + Apps Script",
        },
        {
          icon: "fas fa-boxes",
          title: "Controle de Estoque",
          desc: "Sistema web com QR Code e alertas",
          tech: "PWA + Apps Script",
        },
      ].map((project, index) => (
        <div
          key={index}
          className="bg-card rounded-xl p-6 text-center hover:scale-105 transition-transform"
        >
          <div className="text-3xl text-primary mb-4">
            <i className={project.icon}></i>
          </div>
          <h3 className="font-semibold mb-3">{project.title}</h3>
          <p className="text-muted-foreground mb-3">{project.desc}</p>
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
            {project.tech}
          </span>
        </div>
      ))}
    </div>

    <div className="flex justify-center gap-12">
      {[
        { icon: "fas fa-code", text: "Expertise Técnica" },
        { icon: "fas fa-handshake", text: "Suporte Dedicado" },
        { icon: "fas fa-lightbulb", text: "Soluções Inovadoras" },
      ].map((point, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <i className={`${point.icon} text-2xl text-primary`}></i>
          <span className="font-medium">{point.text}</span>
        </div>
      ))}
    </div>
  </div>
);

const Slide15 = () => (
  <div className="text-center space-y-8">
    <div className="text-6xl text-primary mb-8">
      <i className="fas fa-rocket"></i>
    </div>
    <h2 className="text-4xl font-bold mb-4">
      Pronto para Transformar sua Gestão?
    </h2>
    <p className="text-xl text-muted-foreground mb-8">
      Vamos começar o desenvolvimento do seu sistema personalizado
    </p>

    <div className="flex gap-6 justify-center mb-8">
      <Button size="lg" className="px-8 py-4 text-lg">
        <i className="fas fa-handshake mr-2"></i>
        Aceitar Proposta
      </Button>
      <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
        <i className="fas fa-calendar-alt mr-2"></i>
        Agendar Reunião
      </Button>
    </div>

    <div className="flex items-center justify-center gap-2 text-muted-foreground">
      <i className="fas fa-envelope text-primary"></i>
      <span>hugoviegas3.0@gmail.com</span>
    </div>
  </div>
);

export default PropostaPresentation;
