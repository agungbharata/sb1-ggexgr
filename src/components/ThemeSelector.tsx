import React from 'react';

export interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  style: {
    fontFamily: {
      title: string;
      body: string;
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    patterns: {
      header?: string;
      background?: string;
      footer?: string;
    };
  };
}

const themes: Theme[] = [
  {
    id: 'javanese',
    name: 'Javanese Elegance',
    description: 'Tema elegan dengan motif batik Jawa yang mewah',
    preview: '/themes/javanese-preview.jpg',
    style: {
      fontFamily: {
        title: 'Playfair Display',
        body: 'Poppins'
      },
      colors: {
        primary: '#8B4513',
        secondary: '#DAA520',
        accent: '#CD853F',
        background: '#FFF8DC',
        text: '#4A4A4A'
      },
      patterns: {
        header: '/patterns/batik-header.png',
        background: '/patterns/batik-bg.png',
        footer: '/patterns/batik-footer.png'
      }
    }
  },
  {
    id: 'sundanese',
    name: 'Sunda Modern',
    description: 'Perpaduan motif Sunda dengan sentuhan modern',
    preview: '/themes/sundanese-preview.jpg',
    style: {
      fontFamily: {
        title: 'Cormorant Garamond',
        body: 'Inter'
      },
      colors: {
        primary: '#006064',
        secondary: '#00BCD4',
        accent: '#4DD0E1',
        background: '#E0F7FA',
        text: '#263238'
      },
      patterns: {
        header: '/patterns/mega-mendung-header.png',
        background: '/patterns/mega-mendung-bg.png'
      }
    }
  },
  {
    id: 'minang',
    name: 'Minang Heritage',
    description: 'Tema dengan sentuhan ornamen Minangkabau',
    preview: '/themes/minang-preview.jpg',
    style: {
      fontFamily: {
        title: 'Crimson Text',
        body: 'Source Sans Pro'
      },
      colors: {
        primary: '#8D6E63',
        secondary: '#A1887F',
        accent: '#D7CCC8',
        background: '#EFEBE9',
        text: '#3E2723'
      },
      patterns: {
        header: '/patterns/songket-header.png',
        background: '/patterns/songket-bg.png'
      }
    }
  },
  {
    id: 'bali',
    name: 'Bali Paradise',
    description: 'Nuansa tropis dengan ornamen khas Bali',
    preview: '/themes/bali-preview.jpg',
    style: {
      fontFamily: {
        title: 'Cinzel',
        body: 'Montserrat'
      },
      colors: {
        primary: '#2E7D32',
        secondary: '#4CAF50',
        accent: '#81C784',
        background: '#F1F8E9',
        text: '#1B5E20'
      },
      patterns: {
        header: '/patterns/bali-header.png',
        background: '/patterns/bali-bg.png'
      }
    }
  }
];

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (theme: Theme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedTheme, onThemeChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">Pilih Template</h3>
      <div className="grid grid-cols-2 gap-4">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 transform hover:scale-105 ${
              selectedTheme === theme.id ? 'ring-2 ring-emerald-500' : ''
            }`}
            onClick={() => onThemeChange(theme)}
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={theme.preview}
                alt={theme.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <h4 className="text-white font-medium">{theme.name}</h4>
              <p className="text-white/80 text-sm">{theme.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
export { themes };
