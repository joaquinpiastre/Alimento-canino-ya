const PHONE = "5492604530801";
const MESSAGE = "Hola! Tengo una consulta sobre Alimento Canino Ya.";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 32 32" fill="currentColor" className="size-7">
        <path d="M16.004 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.6 4.44 1.72 6.37L3.2 28.8l6.6-1.7a12.75 12.75 0 0 0 6.2 1.6h.01c7.07 0 12.8-5.73 12.8-12.8s-5.73-12.7-12.8-12.7zm0 23.36h-.01a10.55 10.55 0 0 1-5.38-1.48l-.39-.23-4 1.03 1.07-3.9-.25-.4a10.5 10.5 0 0 1-1.6-5.58c0-5.83 4.74-10.56 10.57-10.56 2.82 0 5.47 1.1 7.47 3.1a10.48 10.48 0 0 1 3.09 7.46c0 5.83-4.74 10.56-10.57 10.56zm5.79-7.91c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.19.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.87-1.76-2.19-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.54-.71-.55h-.6c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.75.75.32 1.34.52 1.8.66.76.24 1.44.21 1.99.13.61-.09 1.88-.77 2.14-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37z" />
      </svg>
    </a>
  );
}
