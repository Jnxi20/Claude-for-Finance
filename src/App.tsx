/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, 
  Database, 
  Brain, 
  Settings, 
  Link as LinkIcon, 
  Calendar, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ChevronRight,
  FileText,
  Lock,
  Loader2
} from "lucide-react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Section = ({ id, title, children, number }: { id: string; title: string; children: React.ReactNode; number: string }) => (
  <motion.section 
    id={id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="py-16 md:py-24 border-b border-slate-100 last:border-0"
  >
    <div className="flex items-baseline gap-4 mb-8">
      <span className="text-xs font-bold text-primary/40 font-mono tracking-widest">{number}</span>
      <h2 className="text-3xl md:text-4xl font-extrabold text-primary">{title}</h2>
    </div>
    {children}
  </motion.section>
);

export default function App() {
  const [hasAccess, setHasAccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    occupation: "",
    automationGoal: "",
    costlyProblem: "",
    investmentBudget: ""
  });

  // Check if user already submitted (local storage for UX)
  useEffect(() => {
    const access = localStorage.getItem("claude_guide_access");
    if (access === "true") {
      setHasAccess(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "leads"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      
      localStorage.setItem("claude_guide_access", "true");
      setHasAccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error saving lead:", error);
      alert("Hubo un error al guardar tus datos. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-100"
        >
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Lock size={32} />
            </div>
          </div>
          
          <h1 className="text-3xl font-black text-primary text-center mb-4">Acceso a la Guía</h1>
          <p className="text-slate-500 text-center mb-10 leading-relaxed">
            Para acceder a la guía completa de Claude para Finanzas por Juan Cruz Robles Collazo, por favor responde estas breves preguntas.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nombre y Apellido</label>
              <input 
                required
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">¿A qué se dedican?</label>
              <input 
                required
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                placeholder="Tu cargo o sector"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Si pudieras resolver/automatizar un problema de tu empresa con IA cual seria?</label>
              <textarea 
                required
                name="automationGoal"
                value={formData.automationGoal}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm resize-none"
                placeholder="Cuéntanos en detalle qué proceso te gustaría mejorar..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cual es el problema que mas dinero te esta costando en tu empresa que te gustaria resolver con IA?</label>
              <textarea 
                required
                name="costlyProblem"
                value={formData.costlyProblem}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm resize-none"
                placeholder="Describe el cuello de botella financiero..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cuanto dinero estas dispuesto a invertir para resolver este problema?</label>
              <input 
                required
                name="investmentBudget"
                value={formData.investmentBudget}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                placeholder="Ej: $5,000 - $15,000 USD"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Enviando...
                </>
              ) : (
                <>
                  Desbloquear Guía
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">J</div>
          <span className="font-bold text-primary tracking-tight hidden sm:inline">Juan Cruz Robles Collazo</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded uppercase tracking-widest">Acceso Completo</span>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[10px] font-bold tracking-[0.3em] text-primary/50 uppercase mb-4 block">Guía de Élite</span>
          <h1 className="text-5xl md:text-7xl font-black text-primary mb-8 leading-[1.1]">
            Claude para Profesionales de Finanzas
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Domina la herramienta de IA más potente para el sector financiero. Una guía estratégica por Juan Cruz Robles Collazo.
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 pb-32">
        
        {/* 1. Introducción */}
        <Section id="intro" number="01" title="Introducción">
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Esta guía cubre todas las funciones principales de Claude que son fundamentales para los profesionales de las finanzas. Está diseñada como una referencia rápida a la que puedes volver en cualquier momento.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl">
              <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                <FileText size={18} />
                Contenido Clave
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-primary" /> Límites de uso y gestión</li>
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-primary" /> Selección de modelos</li>
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-primary" /> Preferencias de Usuario</li>
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-primary" /> Documentos y Artefactos</li>
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-primary" /> Proyectos, Memoria y Skills</li>
              </ul>
            </div>
            <div className="p-6 border border-slate-100 rounded-2xl flex flex-col justify-center">
              <h3 className="font-bold text-primary mb-2">Público Objetivo</h3>
              <p className="text-sm text-slate-500">Banqueros de inversión, analistas, CFOs y gestores de fondos que buscan eficiencia real sin programar.</p>
            </div>
          </div>
        </Section>

        {/* 2. Importancia */}
        <Section id="importancia" number="02" title="Por qué esto importa">
          <div className="space-y-6">
            <div className="p-6 bg-red-50/50 rounded-2xl border border-red-100/50 flex gap-4">
              <AlertCircle className="text-red-500 shrink-0" size={24} />
              <p className="text-sm text-red-900/80 leading-relaxed">
                La mayoría de los profesionales financieros usan Claude de forma ineficiente, desperdiciando tokens y agotando límites rápidamente con resultados mediocres.
              </p>
            </div>
            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex gap-4">
              <Zap className="text-primary shrink-0" size={24} />
              <p className="text-sm text-primary/80 leading-relaxed">
                Claude es una herramienta de precisión. Con la configuración adecuada y el uso de <strong>Skills</strong>, genera archivos de nivel profesional inigualables.
              </p>
            </div>
          </div>
        </Section>

        {/* 3. Límites */}
        <Section id="limites" number="03" title="Límites de Uso">
          <p className="text-slate-600 mb-8">A diferencia de otros modelos, Claude te bloquea por completo si excedes los límites. Es vital gestionarlos.</p>
          <div className="space-y-4">
            {[
              { t: "Ventana de Contexto", d: "200k tokens (~500 pág). Claude resume lo antiguo en chats largos, perdiendo precisión." },
              { t: "Ventana de 5 Horas", d: "Presupuesto móvil que se reinicia 5h después del primer mensaje." },
              { t: "Techo Semanal", d: "Tope mayor de horas. Opus consume esto 3-5x más rápido que Sonnet." }
            ].map((l, i) => (
              <div key={i} className="p-5 border border-slate-100 rounded-2xl hover:border-primary/20 transition-colors">
                <h4 className="text-primary font-bold mb-1">{l.t}</h4>
                <p className="text-sm text-slate-500">{l.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-slate-50 rounded-2xl">
            <h4 className="font-bold text-primary mb-4 text-sm uppercase tracking-wider">Tips de Gestión</h4>
            <ul className="grid sm:grid-cols-2 gap-4 text-xs text-slate-600">
              <li className="flex gap-2"><span>•</span> Usa Sonnet por defecto.</li>
              <li className="flex gap-2"><span>•</span> Inicia nuevos chats seguido.</li>
              <li className="flex gap-2"><span>•</span> Agrupa tareas pesadas.</li>
              <li className="flex gap-2"><span>•</span> Revisa tu uso en Configuración.</li>
            </ul>
          </div>
        </Section>

        {/* 4. Modelos */}
        <Section id="modelos" number="04" title="Elegir el Modelo">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { n: "Opus", d: "Razonamiento complejo y modelos financieros.", c: "3-5x Costo" },
              { n: "Sonnet", d: "Análisis rápido y estándar diario.", c: "Base", f: true },
              { n: "Haiku", d: "Tareas ligeras y ediciones rápidas.", c: "Mínimo" }
            ].map((m, i) => (
              <div key={i} className={`p-6 rounded-2xl border ${m.f ? 'border-primary bg-primary/5' : 'border-slate-100'}`}>
                <h4 className="text-primary font-bold mb-2">{m.n}</h4>
                <p className="text-xs text-slate-500 mb-4">{m.d}</p>
                <span className="text-[10px] font-bold text-primary/40 uppercase">{m.c}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* 5. Personalización */}
        <Section id="personalizacion" number="05" title="Personalización">
          <p className="text-slate-600 mb-6">Configura tus preferencias para que Claude entienda tu rol desde el inicio.</p>
          <div className="bg-slate-900 p-8 rounded-3xl shadow-xl">
            <p className="text-slate-400 font-mono text-[10px] mb-4 uppercase tracking-widest"># Ejemplo de Perfil</p>
            <p className="text-slate-200 text-sm italic leading-relaxed">
              "Soy analista financiero. Trabajo con modelos de 3 estados, DCF y LBO. Formatea números con separadores de miles, un decimal para %, y millones por defecto. Usa azul para entradas y negro para fórmulas. Sé directo."
            </p>
          </div>
        </Section>

        {/* 6 & 7. Docs & Artefactos */}
        <Section id="docs" number="06" title="Documentos y Artefactos">
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary">
                <Database size={20} />
              </div>
              <h4 className="font-bold">Lectura Visual</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Claude toma capturas de cada página, preservando la integridad de tablas y gráficos que otros modelos destruyen.</p>
            </div>
            <div id="sec-7" className="space-y-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary">
                <Zap size={20} />
              </div>
              <h4 className="font-bold">Artefactos</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Espacios de trabajo para archivos profesionales: Excel (.xlsx) con fórmulas, Word (.docx) y PowerPoint (.pptx).</p>
            </div>
          </div>
        </Section>

        {/* 8. Proyectos */}
        <Section id="proyectos" number="08" title="Proyectos">
          <p className="text-slate-600 mb-8">Espacios de trabajo dedicados para mantener un contexto consistente en múltiples conversaciones.</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="p-6 bg-slate-50 rounded-2xl">
              <h4 className="font-bold text-sm mb-2">Contexto Completo</h4>
              <p className="text-xs text-slate-500">Máxima calidad. Ideal para modelos financieros interconectados.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl">
              <h4 className="font-bold text-sm mb-2">Modo RAG</h4>
              <p className="text-xs text-slate-500">Para grandes volúmenes. Recupera solo fragmentos relevantes.</p>
            </div>
          </div>
          <div className="p-6 border border-slate-100 rounded-2xl">
            <h4 className="font-bold text-xs uppercase tracking-widest text-primary/40 mb-4">Organización Sugerida</h4>
            <div className="flex flex-wrap gap-2">
              {["Valoración Empresa X", "Investigación Industria", "Plantillas Modelos"].map((t, i) => (
                <span key={i} className="px-3 py-1 bg-slate-50 rounded-full text-xs font-medium text-slate-600">{t}</span>
              ))}
            </div>
          </div>
        </Section>

        {/* 9 & 10. Memoria & Skills */}
        <Section id="skills" number="09" title="Memoria y Skills">
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary">
                <Brain size={20} />
              </div>
              <h4 className="font-bold">Memoria</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Claude aprende tus preferencias con el tiempo. Pídele recordar convenciones específicas para ahorrar tiempo.</p>
            </div>
            <div id="sec-10" className="space-y-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary">
                <Settings size={20} />
              </div>
              <h4 className="font-bold">Skills</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Instrucciones quirúrgicas para construir archivos perfectos. Las <strong>Skills</strong> permiten generar Excels con fórmulas reales.</p>
            </div>
          </div>
        </Section>

        {/* 11. MCP */}
        <Section id="mcp" number="11" title="Conectores y MCP">
          <div className="p-8 bg-primary rounded-3xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <LinkIcon size={24} />
                Acciones Directas
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                Model Context Protocol permite a Claude interactuar con Gmail, Drive, Calendar y Slack para agendar reuniones o redactar correos sin salir del chat.
              </p>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">G</div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">D</div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">C</div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">S</div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          </div>
        </Section>

        {/* 12. Checklist */}
        <Section id="checklist" number="12" title="Checklist de Élite">
          <div className="space-y-4">
            {[
              "Activa ejecución de código y creación de archivos.",
              "Vincula Gmail y Google Calendar.",
              "Crea Proyectos por flujo de trabajo.",
              "Sube tu archivo finance-conventions.md.",
              "Usa Sonnet por defecto para ahorrar tokens."
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-center p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">{i+1}</div>
                <p className="text-sm font-medium text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 13. Fallas */}
        <Section id="fallas" number="13" title="Dónde falla">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { t: "Límites", d: "Claude se detiene sin aviso previo." },
              { t: "Multiplataforma", d: "Excel/PPT no comparten memoria con la web." },
              { t: "Modo RAG", d: "Puede perder conexiones en documentos masivos." },
              { t: "Errores", d: "Las fórmulas pueden fallar. Audita siempre." }
            ].map((f, i) => (
              <div key={i} className="p-5 bg-slate-50 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">{f.t}</h4>
                <p className="text-sm text-slate-600">{f.d}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <footer className="pt-20 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-4">Juan Cruz Robles Collazo</p>
          <div className="flex justify-center gap-4 text-slate-300">
            <Info size={16} />
          </div>
          <p className="mt-8 text-[10px] text-slate-300 max-w-md mx-auto leading-relaxed italic">
            Esta información se basa en experiencia profesional a febrero de 2026. No es asesoramiento financiero. Verifica siempre los resultados generados por IA.
          </p>
        </footer>

      </main>
    </div>
  );
}
