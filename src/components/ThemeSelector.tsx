import React from 'react';
import Select from 'react-select';

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
    description: 'Tema yang terinspirasi dari keindahan pulau Bali',
    preview: '/themes/bali-preview.jpg',
    style: {
      fontFamily: {
        title: 'Lora',
        body: 'Nunito'
      },
      colors: {
        primary: '#00796B',
        secondary: '#26A69A',
        accent: '#80CBC4',
        background: '#E0F2F1',
        text: '#004D40'
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
  const options = themes.map(theme => ({
    value: theme.id,
    label: theme.name,
    description: theme.description,
    theme: theme
  }));

  const selectedOption = options.find(option => option.value === selectedTheme);

  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      display: 'flex',
      flexDirection: 'column',
      padding: '10px',
      backgroundColor: state.isSelected ? '#F3F4F6' : state.isFocused ? '#F9FAFB' : 'white',
      color: '#111827',
      '&:hover': {
        backgroundColor: '#F9FAFB'
      }
    }),
    control: (provided: any) => ({
      ...provided,
      borderColor: '#E5E7EB',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#D1D5DB'
      }
    })
  };

  const formatOptionLabel = ({ label, description }: any) => (
    <div>
      <div className="font-medium">{label}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">Pilih Template</h3>
      <Select
        options={options}
        value={selectedOption}
        onChange={(option: any) => onThemeChange(option.theme)}
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
        placeholder="Cari template..."
        isSearchable
        className="w-full"
      />
    </div>
  );
};

export default ThemeSelector;
export { themes };
