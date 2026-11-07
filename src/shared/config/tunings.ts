export interface GuitarTuning {
  id: string;
  name: string;
  description: string;
  /** Strings ordered from 6th (lowest pitch, thickest) to 1st (highest pitch, thinnest) */
  notes: [string, string, string, string, string, string];
  famousBands: string[];
}

export const GUITAR_TUNINGS: GuitarTuning[] = [
  {
    id: 'e-standard',
    name: 'E Standard',
    description: 'Класичний універсальний стрій (E A D G B E)',
    notes: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
    famousBands: ['Metallica', 'AC/DC', 'Led Zeppelin', 'Red Hot Chili Peppers'],
  },
  {
    id: 'drop-d',
    name: 'Drop D',
    description: '6-та струна опущена на тон (D A D G B E) — павер-акорди одним пальцем',
    notes: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
    famousBands: ['Rage Against the Machine', 'Tool', 'Avenged Sevenfold', 'Nirvana'],
  },
  {
    id: 'eb-standard',
    name: 'Eb Standard (Half-Step Down)',
    description: 'Усі струни на півтону нижче — м’якший натяг струн і густіший тембр',
    notes: ['Eb2', 'Ab2', 'Db3', 'Gb3', 'Bb3', 'Eb4'],
    famousBands: ['Jimi Hendrix', "Guns N' Roses", 'Alice in Chains', 'Slayer'],
  },
  {
    id: 'd-standard',
    name: 'D Standard (Full-Step Down)',
    description: 'Усі струни на цілий тон нижче (D G C F A D) — важкий масивний рифінг',
    notes: ['D2', 'G2', 'C3', 'F3', 'A3', 'D4'],
    famousBands: ['Death', 'Gojira', 'Pantera', 'Ghost'],
  },
];
