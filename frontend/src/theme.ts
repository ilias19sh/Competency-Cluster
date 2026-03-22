import { createTheme, type MantineColorsTuple } from '@mantine/core';

const myViolet: MantineColorsTuple = [
  '#f2edff', '#e0d6ff', '#c2afff', '#a185ff', '#8c52ff',
  '#7a3fef', '#6a2ee0', '#5a1fd1', '#4b12c2', '#3d08b3'
];

const myOrange: MantineColorsTuple = [
  '#fff3eb', '#ffe4d6', '#ffc7ad', '#ffa982', '#ff914d',
  '#f27a3a', '#e0662a', '#cc541b', '#b8420e', '#a33300'
];

export const theme = createTheme({
  primaryColor: 'violet',
  colors: { violet: myViolet, orange: myOrange },
  fontFamily: 'Montserrat, sans-serif', 
  headings: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '500', 
    sizes: {
      h1: { fontWeight: '600', lineHeight: '1.1' },
      h2: { fontWeight: '600', lineHeight: '1.2' },
    },
  },
  defaultRadius: 'xl', 
  
  components: {
    Button: {
      defaultProps: {
        radius: 'xl', 
      },
    },
  },
});