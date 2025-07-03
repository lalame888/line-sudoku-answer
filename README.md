# Line Sudoku Answer

一個數獨解答工具，使用 React + TypeScript + Vite 建構。

## 🎯 專案目的

這個程式是起初是為《[LINE數獨達人](https://play.google.com/store/apps/details?id=com.linecorp.LGSNPTW&hl=zh_TW)》遊戲設計的快速破關工具。
無廣告、無索取任何收益，程式碼開源供所有人使用
包含Readme在內，幾乎由Cursor AI 以 Vibe coding的方式生成
如果喜歡這個程式，可以在 github 專案頁面給予星星(Start)，我會很開心

### 為什麼需要這個工具？

《LINE數獨達人》是 LINE 官方推出的數獨遊戲，具有以下特色：
- 🏆 完成任務與數獨挑戰可獲得金幣，兌換 LINE POINTS
- 📅 每日數獨挑戰，完成整月關卡可獲得獎盃
- 🎁 定期舉辦特別活動，通關特定關卡可獲得額外獎勵
- 🎯 刮刮樂功能，天天有機會獲得大量金幣

### 這個工具如何幫助您？

當您在《LINE數獨達人》中遇到困難的數獨題目時：
1. **快速解答** - 輸入您遇到的數獨題目
2. **即時驗證** - 確保解答的正確性
3. **節省時間** - 避免卡關，快速獲得金幣和獎勵
4. **提升效率** - 專注於完成每日任務和活動挑戰

### 使用場景

- 🚇 通勤時快速解決數獨難題
- ⏰ 時間有限時快速破關
- 🎯 想要完成每日數獨挑戰
- 🏆 追求獲得整月獎盃和額外獎勵
- 🎁 參與特別活動時需要快速通關

## 功能特色

- 數獨遊戲解答
- 現代化的 React 介面
- TypeScript 支援
- 響應式設計
- 快速驗證解答正確性

## 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建構生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 部署

本專案已設定自動部署到 GitHub Pages。每次推送到 `main` 分支時，GitHub Actions 會自動建構並部署到 GitHub Pages。

### 訪問網址

部署完成後，您可以在以下網址訪問：
`https://[您的GitHub用戶名].github.io/line-sudoku-answer/`

## 技術棧

- React 19
- TypeScript
- Vite
- ESLint

## 授權

MIT License

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
