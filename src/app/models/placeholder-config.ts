// src/app/models/placeholder-config.ts
export interface PlaceholderConfig {
  width: number;
  height: number;
  backgroundColor: string;
  textColor: string;
  customText: string;
  format: string;
  fontFamily: string;
}


export const DEFAULT_CONFIG: PlaceholderConfig = {
  width: 400,
  height: 300,
  backgroundColor: '#cccccc',
  textColor: '#969696',
  customText: '',
  format: 'png',
  fontFamily:''
};