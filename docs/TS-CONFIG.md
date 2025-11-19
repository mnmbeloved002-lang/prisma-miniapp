# TypeScript конфигурация (ERL-46 MUST)

"strict": true — все strict-флаги включены
Критические warnings = ошибки в CI (pnpm typecheck = tsc --noEmit)

tsconfig.json:
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
