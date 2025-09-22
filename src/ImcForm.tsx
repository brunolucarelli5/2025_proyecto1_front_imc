import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiService } from "./services/service";
import { CalculoImc } from "./services/types";

/*
  ESTÉTICA
*/

//Colores y estilos a usar según el resultado del IMC.
interface CategoryTheme {   
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
  gradient: string;
  icon: string;
  animation: string;
}

//Esta función devuelve un objeto CategoryTheme, que marca los colores a usar según la categoría IMC.
const getCategoryTheme = (categoria: string): CategoryTheme => {
  switch (categoria.toLowerCase()) {
    case 'bajo peso':
      return {
        primary: 'blue',
        secondary: 'indigo',
        accent: 'cyan',
        background: 'from-blue-50 to-indigo-100',
        text: 'text-blue-800',
        border: 'border-blue-300',
        gradient: 'from-blue-400 to-indigo-500',
        icon: '📉',
        animation: 'animate-pulse'
      };
    case 'normal':
      return {
        primary: 'green',
        secondary: 'emerald',
        accent: 'teal',
        background: 'from-green-50 to-emerald-100',
        text: 'text-green-800',
        border: 'border-green-300',
        gradient: 'from-green-400 to-emerald-500',
        icon: '✅',
        animation: 'animate-bounce'
      };
    case 'sobrepeso':
      return {
        primary: 'yellow',
        secondary: 'amber',
        accent: 'orange',
        background: 'from-yellow-50 to-amber-100',
        text: 'text-yellow-800',
        border: 'border-yellow-300',
        gradient: 'from-yellow-400 to-amber-500',
        icon: '⚠️',
        animation: 'animate-pulse'
      };
    case 'obeso':
      return {
        primary: 'red',
        secondary: 'rose',
        accent: 'pink',
        background: 'from-red-50 to-rose-100',
        text: 'text-red-800',
        border: 'border-red-300',
        gradient: 'from-red-400 to-rose-500',
        icon: '🚨',
        animation: 'animate-pulse'
      };
    default:
      return {
        primary: 'gray',
        secondary: 'slate',
        accent: 'zinc',
        background: 'from-gray-50 to-slate-100',
        text: 'text-gray-800',
        border: 'border-gray-300',
        gradient: 'from-gray-400 to-slate-500',
        icon: '📊',
        animation: 'animate-pulse'
      };
  }
};

// Variantes de animación mejoradas
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1
  }
};

const formVariants = {
  center: {
    x: 0,
    scale: 1
  },
  left: {
    x: 0,
    scale: 0.95
  }
};

const resultVariants = {
  hidden: {
    opacity: 0,
    x: 100,
    scale: 0.8,
    rotateY: -15
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    rotateY: 0
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.8,
    rotateY: 15
  }
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
    y: -2
  },
  tap: {
    scale: 0.98,
    y: 0
  }
};

const inputVariants = {
  focus: {
    scale: 1.02,
    boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.1)",
    borderColor: "rgb(59, 130, 246)"
  }
};

// Componente de partículas flotantes
const FloatingParticles = ({ theme }: { theme?: CategoryTheme | null }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${theme
            ? theme.primary === 'green' ? 'bg-green-300' :
              theme.primary === 'blue' ? 'bg-blue-300' :
                theme.primary === 'yellow' ? 'bg-yellow-300' :
                  theme.primary === 'red' ? 'bg-red-300' :
                    'bg-gray-300'
            : 'bg-blue-300'
            } opacity-30`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            y: [null, Math.random() * window.innerHeight],
            x: [null, Math.random() * window.innerWidth],
            rotate: 360,
            scale: [null, Math.random() * 0.8 + 0.4]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};


/*
  FUNCIONALIDAD
*/

function ImcForm() {
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [resultado, setResultado] = useState<CalculoImc | null>(null); //resultado de la API (IMC, categoría)
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<CategoryTheme | null>(null); //Guardamos los cambios estéticos.


  const alturaNum = parseFloat(altura);
  const pesoNum = parseFloat(peso);
  const isFormValid =
    !isNaN(alturaNum) &&
    !isNaN(pesoNum) &&
    pesoNum > 0 &&
    pesoNum < 500 &&
    alturaNum > 0 &&
    alturaNum < 3;

  // validaciones
  const validateAltura = (value: string) => {
    if (!/^\d*\.?\d*$/.test(value)) {
      setError("Solo se permiten números y punto decimal en altura.");
      return;
    }
    const num = parseFloat(value);
    if (value === "") return;
    if (isNaN(num)) {
      setError("Por favor, ingresa una altura válida.");
      return;
    }
    if (num <= 0 || num >= 3) {
      setError("La altura debe ser mayor a 0 y menor a 3 metros.");
      return;
    }
    setError("");
  };

  const validatePeso = (value: string) => {
    if (!/^\d*\.?\d*$/.test(value)) {
      setError("Solo se permiten números y punto decimal en peso.");
      return;
    }
    const num = parseFloat(value);
    if (value === "") return;
    if (isNaN(num)) {
      setError("Por favor, ingresa un peso válido.");
      return;
    }
    if (num <= 0 || num >= 500) {
      setError("El peso debe ser mayor a 0 y menor a 500 kg.");
      return;
    }
    setError("");
  };

  useEffect(() => {     //Actualizamos el tema visual cada vez que cambia resultado (API)
    if (resultado) {
      setCurrentTheme(getCategoryTheme(resultado.categoria));
    } else {
      setCurrentTheme(null);
    }
  }, [resultado]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isNaN(alturaNum) || isNaN(pesoNum)) {
      setError("Por favor, ingresa valores numéricos válidos.");
      setResultado(null);
      return;
    }

    if (pesoNum <= 0 || pesoNum >= 500) {
      setError("El peso debe ser mayor a 0 y menor a 500 kg.");
      setResultado(null);
      return;
    }

    if (alturaNum <= 0 || alturaNum >= 3) {
      setError("La altura debe ser mayor a 0 y menor a 3 metros.");
      setResultado(null);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await apiService.calcular(alturaNum, pesoNum);
      setResultado(data); // data es CalculoImc (tiene imc y categoria)
    } catch (err) {
      console.error("Error en apiService.calcular:", err);
      setError("Error al calcular el IMC. Verifica si el backend está corriendo.");
      setResultado(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setResultado(null);
    setError("");
    setAltura("");
    setPeso("");
  };

  return (
    <>
      {/* Fondo dinámico con partículas */}
      <motion.div
        className={`fixed inset-0 transition-all duration-1000 ${currentTheme
          ? `bg-gradient-to-br ${currentTheme.background} via-${currentTheme.primary}-50 to-${currentTheme.secondary}-50`
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
          }`}
        animate={{
          background: currentTheme
            ? `linear-gradient(135deg, var(--tw-gradient-stops))`
            : 'linear-gradient(135deg, #f1f5f9 0%, #dbeafe 50%, #e0e7ff 100%)'
        }}
      >
        <FloatingParticles theme={currentTheme} />

        {/* Efectos de luz */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          animate={{
            background: currentTheme
              ? `radial-gradient(600px circle at 50% 50%, ${currentTheme.primary === 'green' ? 'rgba(34, 197, 94, 0.1)' :
                currentTheme.primary === 'blue' ? 'rgba(59, 130, 246, 0.1)' :
                  currentTheme.primary === 'yellow' ? 'rgba(245, 158, 11, 0.1)' :
                    currentTheme.primary === 'red' ? 'rgba(239, 68, 68, 0.1)' :
                      'rgba(107, 114, 128, 0.1)'
              } 0%, transparent 50%)`
              : 'radial-gradient(600px circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
          }}
          transition={{ duration: 1 }}
        />
      </motion.div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          className="w-full max-w-7xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header con animación mejorada */}
          <motion.div
            className="text-center mb-8 lg:mb-12"
            variants={itemVariants}
          >
            <motion.div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg ${currentTheme
                ? `bg-gradient-to-r ${currentTheme.gradient}`
                : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                }`}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
                boxShadow: [
                  "0 10px 25px rgba(0,0,0,0.1)",
                  "0 15px 35px rgba(0,0,0,0.2)",
                  "0 10px 25px rgba(0,0,0,0.1)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <span className="text-3xl">⚖️</span>
            </motion.div>

            <motion.h1
              className={`text-4xl lg:text-5xl font-bold mb-4 ${currentTheme
                ? currentTheme.primary === 'green' ? 'text-green-600' :
                  currentTheme.primary === 'blue' ? 'text-blue-600' :
                    currentTheme.primary === 'yellow' ? 'text-yellow-600' :
                      currentTheme.primary === 'red' ? 'text-red-600' :
                        'text-gray-600'
                : 'text-blue-600'
                }`}
              variants={itemVariants}
            >
              Calculadora de IMC
            </motion.h1>

            <motion.p
              className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Descubre tu Índice de Masa Corporal con nuestra herramienta avanzada
            </motion.p>
          </motion.div>

          {/* Contenedor principal con layout adaptativo */}
          <div className="relative">
            <motion.div
              className={`grid transition-all duration-1000 ease-in-out ${resultado
                ? 'grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12'
                : 'grid-cols-1 place-items-center'
                }`}
              layout
            >
              {/* Formulario */}
              <motion.div
                className={`w-full ${!resultado ? 'max-w-lg' : ''}`}
                variants={formVariants}
                animate={resultado ? "left" : "center"}
                layout
              >
                <motion.div
                  className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/50"
                  whileHover={{
                    boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                    y: -5
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Input Altura */}
                    <motion.div
                      className="space-y-3"
                      variants={itemVariants}
                    >
                      <label htmlFor="altura" className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                        Altura (metros)
                      </label>
                      <div className="relative group">
                        <motion.input
                          id="altura"
                          type="text"
                          value={altura}
                          onChange={(e) => {
                            let val = e.target.value;
                            // Permite solo números y máximo dos decimales
                            if (/^\d*\.?\d{0,2}$/.test(val)) {
                              setAltura(val);
                            }
                          }}
                          onBlur={(e) => validateAltura(e.target.value)}
                          step="0.01"
                          min="0.1"
                          max="3.0"
                          placeholder="1.75"
                          className={`w-full px-6 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:border-transparent transition-all duration-300 text-lg font-medium placeholder-gray-400 ${currentTheme
                            ? `focus:ring-${currentTheme.primary}-500/20 focus:border-${currentTheme.primary}-500`
                            : 'focus:ring-blue-500/20 focus:border-blue-500'
                            }`}
                          required
                          variants={inputVariants}
                          whileFocus="focus"
                        />
                        <motion.div
                          className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none"
                          animate={{ opacity: altura ? 1 : 0.5 }}
                        >
                          <span className="text-gray-500 text-sm font-semibold">m</span>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Input Peso */}
                    <motion.div
                      className="space-y-3"
                      variants={itemVariants}
                    >
                      <label htmlFor="peso" className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                        Peso (kilogramos)
                      </label>
                      <div className="relative group">
                        <motion.input
                        id="peso"
                        type="text"
                        value={peso}
                        onChange={(e) => {
                            let val = e.target.value;
                            // Permite solo números y máximo dos decimales
                            if (/^\d*\.?\d{0,2}$/.test(val)) {
                              setPeso(val);
                            }
                          }}
                          onBlur={(e) => validatePeso(e.target.value)}
                          min="1"
                          max="500"
                          placeholder="70"
                          className={`w-full px-6 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:border-transparent transition-all duration-300 text-lg font-medium placeholder-gray-400 ${currentTheme
                            ? `focus:ring-${currentTheme.primary}-500/20 focus:border-${currentTheme.primary}-500`
                            : 'focus:ring-blue-500/20 focus:border-blue-500'
                            }`}
                          required
                          variants={inputVariants}
                          whileFocus="focus"
                        />
                        <motion.div
                          className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none"
                          animate={{ opacity: peso ? 1 : 0.5 }}
                        >
                          <span className="text-gray-500 text-sm font-semibold">kg</span>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Botón Submit */}
                    <motion.button
                      type="submit"
                      disabled={isLoading || !isFormValid}
                      className={`w-full text-white font-bold py-4 px-8 rounded-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg relative overflow-hidden ${currentTheme
                        ? `bg-gradient-to-r ${currentTheme.gradient} focus:ring-${currentTheme.primary}-500/50`
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 focus:ring-blue-500/50'
                        }`}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {/* Efecto de brillo */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: isLoading ? ['-100%', '100%'] : '-100%'
                        }}
                        transition={{
                          duration: isLoading ? 1.5 : 0,
                          repeat: isLoading ? Infinity : 0,
                          ease: "linear"
                        }}
                      />

                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <motion.div
                            className="rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span>Calculando...</span>
                        </div>
                      ) : (
                        <span className="flex items-center justify-center">
                          <motion.span
                            className="mr-3 text-xl"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            ⚖️
                          </motion.span>
                          Calcular IMC
                        </span>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              </motion.div>

              {/* Resultados */}
              <AnimatePresence mode="wait">
                {resultado && currentTheme && (
                  <motion.div
                    className="w-full"
                    variants={resultVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <motion.div
                      className={`bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/50 ${currentTheme.primary === 'green' ? 'border-green-200/50' :
                        currentTheme.primary === 'blue' ? 'border-blue-200/50' :
                          currentTheme.primary === 'yellow' ? 'border-yellow-200/50' :
                            currentTheme.primary === 'red' ? 'border-red-200/50' :
                              'border-gray-200/50'
                        }`}
                      whileHover={{
                        boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                        y: -5
                      }}
                    >
                      <div className="text-center space-y-6">
                        {/* Icono animado */}
                        <motion.div
                          className={`inline-flex items-center justify-center w-20 h-20 rounded-full shadow-lg ${currentTheme.primary === 'green' ? 'bg-gradient-to-r from-green-100 to-emerald-100' :
                            currentTheme.primary === 'blue' ? 'bg-gradient-to-r from-blue-100 to-indigo-100' :
                              currentTheme.primary === 'yellow' ? 'bg-gradient-to-r from-yellow-100 to-amber-100' :
                                currentTheme.primary === 'red' ? 'bg-gradient-to-r from-red-100 to-rose-100' :
                                  'bg-gradient-to-r from-gray-100 to-slate-100'
                            }`}
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                            boxShadow: [
                              "0 10px 25px rgba(0,0,0,0.1)",
                              "0 15px 35px rgba(0,0,0,0.2)",
                              "0 10px 25px rgba(0,0,0,0.1)"
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        >
                          <span className="text-3xl">{currentTheme.icon}</span>
                        </motion.div>

                        {/* Título */}
                        <motion.h3
                          className="text-2xl lg:text-3xl font-bold text-gray-800"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          Tu IMC es:
                        </motion.h3>

                        {/* Valor IMC */}
                        <motion.div
                          className={`text-6xl lg:text-7xl font-black ${currentTheme.primary === 'green' ? 'text-green-600' :
                            currentTheme.primary === 'blue' ? 'text-blue-600' :
                              currentTheme.primary === 'yellow' ? 'text-yellow-600' :
                                currentTheme.primary === 'red' ? 'text-red-600' :
                                  'text-gray-600'
                            }`}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: 0.5
                          }}
                        >
                          {resultado.imc.toFixed(1)}
                        </motion.div>

                        {/* Categoría */}
                        <motion.div
                          className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold border-2 shadow-lg ${currentTheme.primary === 'green' ? 'text-green-700 bg-green-100 border-green-300' :
                            currentTheme.primary === 'blue' ? 'text-blue-700 bg-blue-100 border-blue-300' :
                              currentTheme.primary === 'yellow' ? 'text-yellow-700 bg-yellow-100 border-yellow-300' :
                                currentTheme.primary === 'red' ? 'text-red-700 bg-red-100 border-red-300' :
                                  'text-gray-700 bg-gray-100 border-gray-300'
                            }`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7 }}
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                          }}
                        >
                          <span className="mr-3 text-xl">{currentTheme.icon}</span>
                          {resultado.categoria}
                        </motion.div>

                        {/* Información adicional */}
                        <motion.div
                          className={`p-6 rounded-2xl text-base ${currentTheme.primary === 'green' ? 'bg-green-50 text-green-800' :
                            currentTheme.primary === 'blue' ? 'bg-blue-50 text-blue-800' :
                              currentTheme.primary === 'yellow' ? 'bg-yellow-50 text-yellow-800' :
                                currentTheme.primary === 'red' ? 'bg-red-50 text-red-800' :
                                  'bg-gray-50 text-gray-800'
                            }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 }}
                        >
                          {resultado.categoria.toLowerCase() === 'normal' &&(
                            '🎉 ¡Excelente! Mantén un estilo de vida saludable con ejercicio regular y alimentación balanceada.')}
                          {resultado.categoria.toLowerCase() === 'bajo peso' &&(
                            '💡 Considera consultar con un nutricionista para desarrollar un plan personalizado de ganancia de peso saludable.')}
                          {resultado.categoria.toLowerCase() === 'sobrepeso' &&
                            '🏃‍♂️ Te recomendamos incorporar actividad física regular y mantener una dieta balanceada y nutritiva.'}
                          {resultado.categoria.toLowerCase() === 'obeso' &&
                            '👩‍⚕️ Es importante consultar con un profesional de la salud para desarrollar un plan integral y personalizado.'}
                        </motion.div>

                        {/* Botón reset */}
                        <motion.button
                          onClick={resetForm}
                          className={`w-full py-4 px-6 rounded-2xl text-lg font-semibold transition-all duration-300 ${currentTheme.primary === 'green' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                            currentTheme.primary === 'blue' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                              currentTheme.primary === 'yellow' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                                currentTheme.primary === 'red' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                                  'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1 }}
                          whileHover={{
                            scale: 1.02,
                            boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="mr-2">🔄</span>
                          Calcular Nuevo IMC
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mt-8 max-w-lg mx-auto"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-red-50/90 backdrop-blur-sm border-2 border-red-200 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center">
                    <motion.div
                      className="flex-shrink-0"
                    >
                      <motion.span
                        className="text-red-500 text-2xl"
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, -10, 10, 0]
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        ⚠️
                      </motion.span>
                    </motion.div>
                    <div className="ml-4">
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer mejorado */}
          <motion.div
            className="mt-12 text-center space-y-4"
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-white/30">
              <p className="text-gray-600 font-medium mb-2">
                💡 El IMC es una medida aproximada que puede no ser precisa para todos los casos.
              </p>
              <p className="text-gray-500 text-sm">
                Consulta con un profesional de la salud para una evaluación completa y personalizada.
              </p>
            </div>

            {/* Indicador de versión */}
            <motion.div
              className="inline-flex items-center space-x-2 text-xs text-gray-400 bg-white/30 rounded-full px-4 py-2"
              whileHover={{ scale: 1.05 }}
            >
              <span>✨</span>
              <span>Ultra Enhanced Version</span>
              <span>✨</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default ImcForm;