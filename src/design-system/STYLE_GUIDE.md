# Guia de Estilo (Style Guide)

Este documento descreve a fundação visual do Ecossistema OrientoHub.

## 🎨 Paleta de Cores

### Cores Primárias (Dourado)
Usado para ações principais, destaques e branding.

| Token | Valor | Uso |
|-------|-------|-----|
| `primary-50` | `#FFFDF0` | Fundos, destaques sutis |
| `primary-100` | `#FFFBE0` | Estados de hover para fundos claros |
| `primary-200` | `#FFF7C2` | |
| `primary-300` | `#FFF3A3` | |
| `primary-400` | `#FFEF85` | |
| `primary-500` | `#FFD700` | **Cor Principal da Marca**, Botões Primários |
| `primary-600` | `#CCAC00` | Estados de hover para botões primários |
| `primary-700` | `#998100` | Texto em fundos claros |
| `primary-800` | `#665600` | |
| `primary-900` | `#332B00` | |
| `primary-950` | `#1A1500` | Contraste profundo |

### Cores Neutras
| Token | Valor | Uso |
|-------|-------|-----|
| `black` | `#000000` | Texto, Fundos (Modo Escuro) |
| `white` | `#FFFFFF` | Texto (Modo Escuro), Fundos |
| `gray-*` | Padrão Tailwind | Bordas, Texto Secundário, Placeholders |

## 🔤 Tipografia

### Famílias de Fontes
- **Display**: `Lexend`, sans-serif (Títulos)
- **Corpo**: `Inter`, sans-serif (Parágrafos, texto de UI)

### Títulos
- **H1, H2, H3, H4, H5, H6**: Aplicar `font-display font-semibold`.

## 📐 Espaçamento e Layout
Usamos a escala de espaçamento padrão do Tailwind CSS (base de 4px).

- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (`.container-custom`)

## 🖌️ Efeitos

### Sombras
- Sombras padrão do Tailwind (`shadow-sm`, `shadow-md`, `shadow-lg`).

### Animações
- **Border Flow**: `animate-border-flow` (3s linear infinito) - Usado para `animated-card`.

### Gradientes
- **Borda do Cartão**: `linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent)`
