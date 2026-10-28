export const QUOTE_SERVICE_EVENT = "eu-quote-service";

export function selectQuoteService(service: string) {
  window.dispatchEvent(new CustomEvent<string>(QUOTE_SERVICE_EVENT, { detail: service }));
}
