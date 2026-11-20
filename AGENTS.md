<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Store identity (name, WhatsApp number, testimonial link, hero/profile/FAQ copy) lives only in `src/config/store.ts`; components read from it so rebranding needs no component edits.
- Catalog lives in `src/data/products.ts` (prices written in thousands via `plan()` helper); seller notes are shown verbatim.
- Cart, wishlist, recently viewed and order note persist in localStorage via `src/lib/store-state.tsx` (no backend by design); pure cart helpers live in `src/lib/cart.ts` and the context is a globalThis singleton so live updates never split provider/consumers.
- WhatsApp messages are built only in `src/lib/whatsapp.ts` (wa.me + encodeURIComponent); covered by `src/test/store-rules.test.ts`.
- Colors are tokens in `src/styles.css`: `ink` flips light in dark mode (borders/tags), `deep` stays dark (footer, promo, announcement).
