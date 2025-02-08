export interface Section {
  title: string;
  subtitle: string;
  description: string;
  icons: React.ComponentType<React.SVGProps<SVGSVGElement>>[];
  socialLinks: {
    aliexpress?: string;
    facebook?: string;
    instagram?: string;
  };
}

export const aboutSection: Section = {
  title: 'ABOUT US',
  subtitle: 'AT EZ TATTOO, WE ARE MORE THAN JUST A TATTOO SUPPLY COMPANY',
  description: 'We are a driving force in the world of tattoo. Our passion for innovation, commitment to quality, and dedication to our community have made us a trusted name in the industry.',
  icons: [
    require('@site/src/assets/icons/tattoo-machine.svg').default,
    require('@site/src/assets/icons/ink-bottle.svg').default,
    require('@site/src/assets/icons/power-supply.svg').default,
    require('@site/src/assets/icons/cartridge.svg').default,
    require('@site/src/assets/icons/grip.svg').default,
    require('@site/src/assets/icons/tape.svg').default,
  ],
  socialLinks: {
    aliexpress: 'https://eztattoosupply.com',
    facebook: 'https://www.facebook.com/eztattoosupply',
    instagram: 'https://www.instagram.com/eztattoosupply'
  }
}; 