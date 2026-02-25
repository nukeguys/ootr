export function FooterBar() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border pt-8 pb-4">
      <p className="font-serif italic text-accent text-sm md:text-base">
        &ldquo;There is no bad weather, only bad clothing.&rdquo;
      </p>
      <p className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase text-footer-brand">
        Outfit Of The Run
      </p>
    </div>
  );
}
