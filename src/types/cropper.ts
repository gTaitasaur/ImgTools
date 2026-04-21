export interface AspectRatioOption {
  label: string;
  value: number | undefined; // undefined significa 'Libre'
  icon?: string;
}

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { label: 'Libre', value: undefined },
  { label: '1:1 (Instagram Post)', value: 1 / 1 },
  { label: '4:5 (Instagram Portrait)', value: 4 / 5 },
  { label: '2:3 (Pinterest)', value: 2 / 3 },
  { label: '16:9 (YouTube / TV)', value: 16 / 9 },
  { label: '9:16 (Stories / Reels)', value: 9 / 16 },
];
