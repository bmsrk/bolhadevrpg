import { CharacterArchetype, Enemy, Item, Location } from './types';

export const LOCATIONS: Location[] = [
  {
    id: "hashtag_plaza",
    name: "Hashtag Plaza",
    desc: "O centro da cidade. Tudo viraliza ou morre aqui. O chão é coberto de hot takes descartadas."
  },
  {
    id: "threaded_alley",
    name: "Threaded Alley",
    desc: "Becos estreitos onde debates técnicos se transformam em ofensas pessoais. Cuidado com as threads de 1/50."
  },
  {
    id: "dm_docks",
    name: "DM Docks",
    desc: "Um porto nebuloso de onde saem negociações salariais e prints vazados."
  },
  {
    id: "ci_cd_pipeline",
    name: "CI/CD Pipeline",
    desc: "Uma estrutura industrial escorregadia, instável e passivo-agressiva. Igual ao time de DevOps."
  },
  {
    id: "release_nightclub",
    name: "Release Nightclub",
    desc: "A balada exclusiva onde features nascem, builds falham e carreiras acabam."
  }
];

export const ARCHETYPES: CharacterArchetype[] = [
  {
    id: "maintainer",
    name: "The Maintainer",
    description: "Cansado. Só quer que parem de abrir issue sem log.",
    starting_attributes: { Wit: 2, Craft: 4, Social: 1, Luck: 1 },
    special: "Merge Authority: Rerola dados de Craft."
  },
  {
    id: "indie_dev",
    name: "Indie Dev",
    description: "Faz tudo. Dorme nunca. 'Build in public' é religião.",
    starting_attributes: { Wit: 3, Craft: 3, Social: 2, Luck: 1 },
    special: "Hard Pivot: +2 em qualquer teste 1x por combate."
  },
  {
    id: "influencer",
    name: "Tech Influencer",
    description: "Não coda há 4 anos, mas vende curso de como codar.",
    starting_attributes: { Wit: 3, Craft: 1, Social: 4, Luck: 0 },
    special: "Viral Boost: Usa Followers como HP extra."
  },
  {
    id: "tinkerer",
    name: "The Tinkerer",
    description: "Usa Arch Linux. Compila o próprio kernel. Ninguém entende.",
    starting_attributes: { Wit: 2, Craft: 3, Social: 1, Luck: 2 },
    special: "Script Switch: Transforma 1 falha em sucesso crítico."
  }
];

export const ITEMS: Item[] = [
  { id: 'pr_polisher', name: "PR Polisher", effect: "+1 Craft temporário" },
  { id: 'thread_primer', name: "Thread Primer", effect: "+1 Wit no início do combate" },
  { id: 'sponsorship', name: "Sponsorship Pitch", effect: "Cura Sanidade (HP)" },
  { id: 'secret_patch', name: "Secret Patch", effect: "Dano massivo em Bug Mob" }
];

export const ENEMIES: Enemy[] = [
  {
    id: "paladino",
    name: "Paladino do Legado",
    desc: "Carrega um servidor Windows Server 2003 nas costas.",
    abilities: ["Isso Funcionava Antes", "Protocolo Imutável", "Arquivo Zigurat XML"],
    loot: ["ZIP suspeito"],
    hp: 12,
    stats: { Wit: 1, Craft: 4, Social: 2, Luck: 0 }
  },
  {
    id: "mago_funcional",
    name: "Mago do Funcional",
    desc: "Flutua acima do chão para evitar side-effects.",
    abilities: ["Função Pura (Dano Mental)", "Mônada Suprema", "Superioridade Moral"],
    loot: ["Tomo de Lambdas"],
    hp: 10,
    stats: { Wit: 5, Craft: 2, Social: 0, Luck: 0 }
  },
  {
    id: "indiehacker",
    name: "Evil IndieHacker",
    desc: "Ele quer te vender um SaaS que faz o que seu código faz, mas pior.",
    abilities: ["SaaS de 48h", "Pivot Eterno", "Métrica de Vaidade"],
    loot: ["Template de Landing Page"],
    hp: 8,
    stats: { Wit: 3, Craft: 1, Social: 4, Luck: 3 }
  },
  {
    id: "bug_mob",
    name: "Bug Mob",
    desc: "Um enxame de `undefined is not a function`.",
    abilities: ["Caos Randômico", "Reprodução Exponencial"],
    loot: ["Log de Erro"],
    hp: 15,
    stats: { Wit: 0, Craft: 3, Social: 0, Luck: 6 }
  }
];
