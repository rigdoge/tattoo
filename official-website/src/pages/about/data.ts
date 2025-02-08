export interface Section {
  image: string;
  title: string;
  subtitle?: string;
  description: string;
  dark?: boolean;
}

export const sections: Section[] = [
  {
    image: '/img/about/brand-intro.jpg',
    title: 'EZ TATTOO SUPPLY',
    description: '作为全球领先的纹身用品供应商，EZ TATTOO SUPPLY 致力于为纹身艺术家提供最优质的产品和服务。我们的使命是通过创新的产品和全球化的服务网络，助力纹身艺术家实现他们的艺术愿景。'
  },
  {
    image: require('@site/src/assets/tattoo-icons.svg').default,
    title: 'ABOUT US',
    subtitle: 'AT EZ TATTOO, WE ARE MORE THAN JUST A TATTOO SUPPLY COMPANY',
    description: 'We are a driving force in the world of tattoo. Our passion for innovation, commitment to quality, and dedication to our community have made us a trusted name in the industry.',
    dark: true
  }
]; 