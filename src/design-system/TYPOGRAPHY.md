# Sistema de Tipografia

## Fontes

### Fonte Primária (Corpo)
**Inter**
- **Uso**: Elementos de UI, parágrafos, botões, inputs.
- **Pesos**:
    - Regular (400): Texto do corpo.
    - Medium (500): Botões, Rótulos, Subtítulos.
    - SemiBold (600): Ênfase.

### Fonte de Display (Títulos)
**Lexend**
- **Uso**: Títulos de página, Cabeçalhos de seção, Texto de marketing.
- **Pesos**:
    - SemiBold (600): Títulos padrão.
    - Bold (700): Títulos Hero.

## Escala Tipográfica

| Nível | Tamanho (Desktop) | Tamanho (Mobile) | Altura da Linha | Peso | Uso |
|-------|-------------------|------------------|-----------------|------|-----|
| **H1** | `text-4xl` (36px) | `text-3xl` (30px) | 1.2 | Lexend 700 | Títulos de Página, Hero |
| **H2** | `text-3xl` (30px) | `text-2xl` (24px) | 1.3 | Lexend 600 | Cabeçalhos de Seção |
| **H3** | `text-2xl` (24px) | `text-xl` (20px) | 1.3 | Lexend 600 | Títulos de Cartão, Subseções |
| **H4** | `text-xl` (20px) | `text-lg` (18px) | 1.4 | Lexend 600 | Títulos Menores |
| **Body L**| `text-lg` (18px) | `text-base` (16px)| 1.6 | Inter 400 | Texto de introdução, Parágrafos principais |
| **Body M**| `text-base` (16px)| `text-sm` (14px) | 1.5 | Inter 400 | Texto padrão |
| **Small** | `text-sm` (14px) | `text-xs` (12px) | 1.5 | Inter 400 | Metadados, Dicas, Rodapés |

## Melhores Práticas

1.  **Hierarquia**: Use tamanho e peso para estabelecer uma hierarquia clara. Não pule níveis de título (H1 -> H2 -> H3).
2.  **Comprimento da Linha**: Mantenha as linhas de texto entre 50-75 caracteres para uma legibilidade ideal.
3.  **Contraste**: Garanta que o texto tenha contraste suficiente contra o fundo (verifique os padrões WCAG AA).
    - Modo Claro: `text-gray-900` no Branco.
    - Modo Escuro: `text-gray-100` no Cinza Escuro.
