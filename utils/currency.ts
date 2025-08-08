export const formatCFA = (value: number): string => {
  try {
    return `${value.toLocaleString('fr-FR')} FCFA`;
  } catch {
    return `${value} FCFA`;
  }
};