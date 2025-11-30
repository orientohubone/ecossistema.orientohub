# Design Tokens (Tokenização)

Design Tokens são as "partículas subatômicas" do nosso Design System. Eles são nomes semânticos para valores visuais brutos (como cores hexadecimais, valores de pixel, etc.), permitindo que construamos uma linguagem visual consistente e escalável.

## 🎨 Tokens de Cor

### Cores da Marca (Brand)
Usadas para comunicar a identidade do OrientoHub.

| Token | Valor | Variável CSS (Tailwind) | Uso |
|-------|-------|-------------------------|-----|
| `primary-50` | `#FFFDF0` | `bg-primary-50` | Fundos muito claros, tints |
| `primary-100` | `#FFFBE0` | `bg-primary-100` | Hover em fundos claros |
| `primary-500` | `#FFD700` | `bg-primary-500` | **Cor Principal**, Botões, Ícones |
| `primary-600` | `#CCAC00` | `bg-primary-600` | Hover em botões, Foco |
| `primary-700` | `#998100` | `bg-primary-700` | Texto em fundos claros |
| `primary-950` | `#1A1500` | `bg-primary-950` | Contraste máximo |

### Cores Neutras (Neutral)
Usadas para estrutura, texto e hierarquia.

| Token | Valor | Variável CSS | Uso |
|-------|-------|--------------|-----|
| `white` | `#FFFFFF` | `bg-white` | Fundo de cartões, Texto em modo escuro |
| `black` | `#000000` | `bg-black` | Texto principal, Fundo em modo escuro |
| `gray-50` | (Tailwind) | `bg-gray-50` | Fundo de página (claro) |
| `gray-900` | (Tailwind) | `text-gray-900` | Texto principal (claro) |

## 🔤 Tokens de Tipografia

### Famílias de Fonte
| Token | Valor | Uso |
|-------|-------|-----|
| `font-sans` | `Inter` | Texto corrido, UI |
| `font-display` | `Lexend` | Títulos, Cabeçalhos |

### Pesos (Weights)
| Token | Valor | Uso |
|-------|-------|-----|
| `font-regular` | `400` | Texto padrão |
| `font-medium` | `500` | Botões, Labels |
| `font-semibold` | `600` | Títulos, Ênfase |
| `font-bold` | `700` | Títulos Hero |

## 📐 Tokens de Espaçamento
Utilizamos a escala padrão do Tailwind (fator de 4px).

| Token | Valor (rem) | Valor (px) | Exemplo de Uso |
|-------|-------------|------------|----------------|
| `1` | `0.25rem` | `4px` | Margem mínima, gap pequeno |
| `2` | `0.5rem` | `8px` | Padding de botões pequenos |
| `4` | `1rem` | `16px` | Padding padrão, gap de cards |
| `6` | `1.5rem` | `24px` | Margem de seções internas |
| `8` | `2rem` | `32px` | Margem de seções maiores |

## ⭕ Tokens de Borda (Radius)

| Token | Valor | Uso |
|-------|-------|-----|
| `rounded-sm` | `0.125rem` | Tags pequenas, Checkboxes |
| `rounded-md` | `0.375rem` | Botões, Inputs |
| `rounded-lg` | `0.5rem` | Cards, Modais |
| `rounded-full` | `9999px` | Avatares, Badges pílula |

## ✨ Tokens de Efeito

### Sombras (Elevation)
| Token | Uso |
|-------|-----|
| `shadow-sm` | Elementos interativos sutis |
| `shadow-md` | Cards padrão, Dropdowns |
| `shadow-lg` | Modais, Elementos flutuantes |

### Animação
| Token | Valor | Uso |
|-------|-------|-----|
| `animate-border-flow` | `3s linear infinite` | Efeito de borda "viva" em cards premium |

## 🛠 Como usar no código

Sempre prefira usar os **nomes das classes utilitárias** (ex: `text-primary-500`) em vez de valores hardcoded (ex: `color: #FFD700`). Isso garante que, se decidirmos alterar o tom de dourado da marca, a mudança se propagará automaticamente por todo o sistema.

```tsx
// ❌ Ruim (Hardcoded)
<div style={{ backgroundColor: '#FFD700', padding: '16px' }}>

// ✅ Bom (Tokenizado)
<div className="bg-primary-500 p-4">
```
