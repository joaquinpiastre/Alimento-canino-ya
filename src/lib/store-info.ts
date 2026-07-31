export const STORE_ADDRESS = "Av. Pedro Vargas 1141";

export const MERCADOPAGO_ALIAS = "Santiagoulloa332";

export const STORE_HOURS = [
  { day: "Lunes", hours: "8:30 a.m.–1 p.m., 4–7:30 p.m." },
  { day: "Martes", hours: "8:30 a.m.–1 p.m., 4–7:30 p.m." },
  { day: "Miércoles", hours: "8:30 a.m.–1 p.m., 4–7:30 p.m." },
  { day: "Jueves", hours: "8:30 a.m.–1 p.m., 4–7:30 p.m." },
  { day: "Viernes", hours: "8:30 a.m.–1 p.m., 4–7:30 p.m." },
  { day: "Sábado", hours: "9 a.m.–1 p.m." },
  { day: "Domingo", hours: "Cerrado" },
];

export const DELIVERY_SLOTS = [
  { value: "semana-manana", label: "Lunes a viernes por la mañana (8:30 a 13hs)" },
  { value: "semana-tarde", label: "Lunes a viernes por la tarde (4 a 7:30pm)" },
  { value: "sabado-manana", label: "Sábado por la mañana (9 a 13hs)" },
  { value: "cualquiera", label: "Cualquier horario disponible" },
] as const;
