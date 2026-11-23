/**
 * Adónde envía el formulario de contacto, a partir de PUBLIC_FORM_ENDPOINT (en Vercel).
 *
 * Con Web3Forms la variable lleva la clave en la ruta (https://api.web3forms.com/submit/<clave>), que es
 * como se configuró. Esa ruta es la que Web3Forms documenta para formularios HTML que no pueden llevar
 * campos ocultos; para enviar desde JavaScript, su método es POST /submit con la clave en el campo
 * access_key (lo que enseña también su panel). El 23 nov el envío falló en vivo con la ruta con clave
 * (el navegador lo vio como un error de CORS), así que aquí se separan las dos cosas: el formulario
 * envía a /submit y lleva la clave en un campo oculto. La clave es pública: acaba en la página igual.
 *
 * Cualquier otro endpoint (Formspree…) se usa tal cual, sin clave.
 */
const WEB3FORMS_WITH_KEY = /^https:\/\/api\.web3forms\.com\/submit\/([0-9a-f-]{36})\/?$/i;

export const WEB3FORMS_SUBMIT = 'https://api.web3forms.com/submit';

export function resolveFormEndpoint(raw: string | undefined): { endpoint: string; accessKey: string } {
  const value = (raw ?? '').trim();
  const match = value.match(WEB3FORMS_WITH_KEY);
  if (match) return { endpoint: WEB3FORMS_SUBMIT, accessKey: match[1] };
  return { endpoint: value, accessKey: '' };
}
