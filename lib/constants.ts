export interface Generation {
  id: number;
  name: string;
  limit: number;
  offset: number;
}

export const GENERATIONS: Generation[] = [
  { id: 1, name: '第1世代 (カントー)', limit: 151, offset: 0 },
  { id: 2, name: '第2世代 (ジョウト)', limit: 100, offset: 151 },
  { id: 3, name: '第3世代 (ホウエン)', limit: 135, offset: 251 },
  { id: 4, name: '第4世代 (シンオウ)', limit: 107, offset: 386 },
  { id: 5, name: '第5世代 (イッシュ)', limit: 156, offset: 493 },
  { id: 6, name: '第6世代 (カロス)', limit: 72, offset: 649 },
  { id: 7, name: '第7世代 (アローラ)', limit: 88, offset: 721 },
  { id: 8, name: '第8世代 (ガラル)', limit: 96, offset: 809 },
  { id: 9, name: '第9世代 (パルデア)', limit: 120, offset: 905 }
];
