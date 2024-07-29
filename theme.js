import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00B9D1', // Cor principal para botões contidos e outros elementos
    accent: '#B4B2B0', // Cor secundária para detalhes
    background: '#FFFFFF', // Cor de fundo da tela
    surface: '#FFFFFF', // Cor de fundo dos componentes
    text: '#333333', // Cor do texto
    placeholder: '#888888', // Cor do texto de placeholder
    error: '#D9534F', // Cor para mensagens de erro
    disabled: '#C7C7CC', // Cor para elementos desativados
    onPrimary: '#FFFFFF', // Cor do texto sobre o fundo primário
    onSurface: '#000000', // Cor do texto sobre o fundo da superfície
    onBackground: '#000000', // Cor do texto sobre o fundo
  },
  fonts: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
    bodySmall: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
      fontSize: 12, // Tamanho de fonte para bodySmall
    },
    bodyLarge: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
      fontSize: 16, // Tamanho de fonte para bodyLarge
    },
    labelLarge: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
      fontSize: 20, // Tamanho de fonte para labelLarge
    },
  },
};

export default theme;
