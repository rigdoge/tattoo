export interface Section {
  image: string | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  subtitle?: string;
  description: string;
  dark?: boolean;
}

export const sections: Section[] = [
  {
    image: require('@site/src/assets/tattoo-icons.svg').default,
    title: 'ABOUT US',
    subtitle: 'AT EZ TATTOO, WE ARE MORE THAN JUST A TATTOO SUPPLY COMPANY',
    description: 'We are a driving force in the world of tattoo. Our passion for innovation, commitment to quality, and dedication to our community have made us a trusted name in the industry.',
    dark: true
  }
]; 