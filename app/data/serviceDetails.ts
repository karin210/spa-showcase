import type { Amenity, CategoryDetail } from "~/types/serviceDetails";

// Long-form marketing copy for the /services page. Names, prices and durations
// stay in data/services.ts; this file only adds descriptions keyed to them.

export const SERVICES_BANNER = {
  photoId: "1600334129128-685c5582fd35",
  imageAlt: "Espacio de descanso del spa junto a una alberca rodeada de plantas",
} as const;

export const SERVICES_INTRO =
  "Cada visita empieza con una breve consulta para conocer cómo llegas y qué necesitas. A partir de ahí ajustamos la presión, los aromas y los tiempos de cada tratamiento. Todos incluyen acceso a nuestras áreas de descanso antes y después de tu sesión.";

// Keyed by ServiceCategory.id.
export const CATEGORY_DETAILS: Record<string, CategoryDetail> = {
  massages: {
    description:
      "Nuestros masajes combinan técnicas suecas, de tejido profundo y terapias orientales con aceites prensados en frío. Trabajamos en cabinas cálidas y silenciosas, con camillas térmicas y música elegida para cada ritmo.",
    idealFor: ["Tensión en cuello y espalda", "Estrés y problemas de sueño", "Recuperación después del ejercicio"],
  },
  facials: {
    description:
      "Diagnosticamos tu piel antes de cada facial para elegir los activos adecuados. Usamos cosmética natural mexicana, libre de parabenos y sin pruebas en animales, y terminamos con un masaje facial y de cuero cabelludo.",
    idealFor: ["Piel deshidratada o apagada", "Primeros signos de la edad", "Preparación para un evento"],
  },
  "body-rituals": {
    description:
      "Rituales inspirados en la tradición mexicana: sal de Colima, cacao de Tabasco y barro de la región. Exfoliamos, nutrimos y envolvemos la piel, y cerramos con una ducha tibia y una infusión de temporada.",
    idealFor: ["Piel áspera o sin brillo", "Sensación de pesadez", "Regalar una experiencia especial"],
  },
  hydrotherapy: {
    description:
      "Calor, vapor y agua en contraste para activar la circulación y soltar el cuerpo. Nuestro temazcal está guiado por una temazcalera certificada y el circuito puede combinarse con cualquier otro tratamiento.",
    idealFor: ["Desintoxicar y activar la circulación", "Dolor muscular", "Un día completo de descanso"],
  },
};

// Keyed by SpaService.name.
export const SERVICE_DESCRIPTIONS: Record<string, string> = {
  "Masaje relajante": "Movimientos suaves y envolventes que bajan el ritmo del sistema nervioso.",
  "Masaje de tejido profundo": "Presión firme y lenta sobre contracturas y puntos de tensión crónica.",
  "Masaje con piedras calientes": "Piedras volcánicas templadas que relajan el músculo antes de trabajarlo.",
  "Masaje de aromaterapia": "Mezcla de aceites esenciales elegida contigo según cómo quieras sentirte.",
  "Reflexología podal": "Presión en puntos reflejos de los pies para equilibrar todo el cuerpo.",
  "Facial hidratante": "Limpieza, mascarilla de ácido hialurónico y sérum para una piel jugosa.",
  "Limpieza facial profunda": "Vapor, extracción cuidadosa y mascarilla calmante para poros limpios.",
  "Facial antiedad": "Activos reafirmantes, radiofrecuencia suave y masaje kobido.",
  "Peeling enzimático": "Exfoliación con enzimas de papaya y piña, sin irritar la piel.",
  "Exfoliación de sal marina": "Sal de Colima con aceite de coco para renovar la piel de todo el cuerpo.",
  "Envoltura de chocolate": "Cacao antioxidante que nutre la piel y despierta los sentidos.",
  "Envoltura de algas marinas": "Algas ricas en minerales que tonifican y desinflaman.",
  "Ritual detox de barro": "Barro volcánico, vapor de hierbas y un masaje ligero para cerrar.",
  "Circuito de spa": "Sauna, vapor de eucalipto, regadera de contraste y alberca templada.",
  Temazcal: "Baño de vapor ancestral con hierbas medicinales, guiado paso a paso.",
  "Baño de flotación": "Tina con sales de Epsom en penumbra para flotar sin esfuerzo.",
};

export const AMENITIES: Amenity[] = [
  {
    title: "Alberca templada",
    description: "Agua a 32 °C rodeada de jardín, abierta a todos los huéspedes del día.",
    photoId: "1571896349842-33c89424de2d",
    imageAlt: "Alberca iluminada al atardecer junto a una terraza con sombrillas",
  },
  {
    title: "Sauna y vapor",
    description: "Sauna de madera de cedro y cabina de vapor con eucalipto y menta.",
    photoId: "1583416750470-965b2707b355",
    imageAlt: "Sauna de madera iluminada con luz cálida",
  },
  {
    title: "Sala de descanso",
    description: "Camas amplias, mantas y silencio para quedarte todo el tiempo que quieras.",
    photoId: "1582719478250-c89cae4dc85b",
    imageAlt: "Habitación de descanso con cama amplia, madera y luz de tarde",
  },
  {
    title: "Barra de infusiones",
    description: "Tés de hierbas locales, agua de frutas y snacks saludables sin costo.",
    photoId: "1597318181409-cf64d0b5d8a2",
    imageAlt: "Taza de té de hierbas junto a flores secas y una hoja de palma",
  },
  {
    title: "Vestidores completos",
    description: "Lockers, batas, sandalias, regaderas y productos de baño naturales.",
    photoId: "1540555700478-4be289fbecef",
    imageAlt: "Toalla enrollada, dispensador de jabón, vela y tulipanes",
  },
  {
    title: "Estacionamiento",
    description: "Estacionamiento gratuito para clientes, con acceso sin escalones.",
    photoId: "1506521781263-d8422e82f27a",
    imageAlt: "Vista aérea de un estacionamiento con autos",
  },
];
