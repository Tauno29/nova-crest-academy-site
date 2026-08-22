# Nova Crest Academy Clone — Ground-Truth Design Spec

This project reproduces the visual language and content structure of `novacrestacademy.netlify.app`. The reference is the source of truth; fidelity takes priority over introducing a separate design direction.

## Reference Direction

**Design Movement:** Contemporary playful education branding with soft editorial spacing, rounded display typography, and colorful classroom energy.

**Core Principles:**
1. Warm, welcoming school identity with generous whitespace and approachable rounded forms.
2. High-contrast navy typography balanced by coral, lilac, peach, and soft cream accents.
3. Modular sections that move from promise to proof: hero, metrics, service cards, learner gallery, principal identity, and footer contact.
4. Small educational motifs and emoji-like iconography used as moments of delight rather than decoration overload.

**Color Philosophy:** A creamy off-white canvas keeps the long page calm and legible. Coral and peach communicate warmth and action; lilac marks imagination and creativity; deep navy anchors headlines and ensures readability; green is reserved for subtle utility details.

**Layout Paradigm:** A wide, airy landing page with an offset two-column hero, floating metric cards, generous vertical bands, and alternating image/text compositions. Desktop layouts should feel spacious rather than boxed-in; mobile layouts should stack naturally while keeping the same rhythm.

**Signature Elements:**
- A compact dark-green contact strip above a white navigation bar.
- A horizontal coral-to-lilac announcement ribbon.
- Soft cream sections with oversized navy/lilac/coral headlines and rounded white cards.

**Interaction Philosophy:** Navigation and CTAs should feel direct and friendly. Links use clear hover color shifts and slight lifts; the mobile menu opens as a simple, readable panel; gallery images enlarge subtly on hover; newsletter submission gives an inline confirmation rather than pretending to send data.

**Animation:** Use restrained opacity/translate reveals and short hover transitions. Keep transitions under 300ms, use a snappy ease-out, and respect reduced-motion preferences. Avoid flashy motion that would undermine the calm educational tone.

**Typography System:** Use a rounded, bold display face for large headlines and a clean humanist sans for body copy. Headline hierarchy: small uppercase kicker, 56–76px hero display on desktop, 34–48px section headings, 18–20px card headings. Body copy stays around 15–16px with relaxed line-height.

**Brand Essence:** Nova Crest Academy is a nurturing private school in Namibia helping young learners embrace, elevate, and excel through creativity, critical thinking, and technology. Personality: **warm, curious, optimistic**.

**Brand Voice:** Headlines are concise and energetic; CTAs are active and specific; microcopy is caring and practical. Examples: “Where wonder awakens curiosity everyday.” and “Give your learner a bright place to begin.”

**Wordmark & Logo:** Use the reference school crest artwork as the visual mark, paired with a bold rounded “Nova Crest” wordmark. Keep the crest circular and prominent in the hero and footer.

**Signature Brand Color:** Coral peach `#f58a67`, used for the primary action surfaces and the main warmth cue.

## Content and Routes

The homepage contains the reference sections: utility/contact strip, primary navigation, July 2026 application announcement, hero, four metrics, “What We Offer” fee cards for Kindergarten through Grade 3, learner gallery, principal spotlight, school identity (vision/mission/motto), and footer with contact details, links, and newsletter field.

The navigation routes to `/`, `/admissions`, `/hostel`, `/gallery`, and `/fees`. These pages should share the same shell and maintain the same visual system, with content-rich internal pages that remain easy to navigate back to the homepage.

## Asset Notes

Reference assets include `School Logo.jpeg`, `Principal.jpeg`, and five gallery images (`gallery.JPG`, `gallery (2).JPG`, `gallery (3).JPG`, `gallery (4).JPG`, `gallery (5).JPG`). They should be copied outside the project, uploaded through the webdev asset workflow, and referenced by their returned storage URLs.
