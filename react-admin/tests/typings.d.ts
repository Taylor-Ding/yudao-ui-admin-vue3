declare module 'umi' {
  export function useModel(model: string): any;
  export function useIntl(): { formatMessage: ({ id: string }: { id: string }) => string };
  export const history: { push: (path: string) => void };
  export function setLocale(lang: string, realReload: boolean): void;
  export const Outlet: React.FC;
}
