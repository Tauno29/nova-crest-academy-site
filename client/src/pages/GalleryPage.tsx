/* Public Gallery: renders images uploaded through the protected Admin Panel. */
import { useMemo, useState } from "react";
import { Images } from "lucide-react";
import { Link } from "wouter";
import { PublicMobileMenu } from "@/components/PublicMobileMenu";
import { trpc } from "@/lib/trpc";

function GalleryHeader() {
  return (
    <>
      <div className="bg-[#005f53] text-[12px] text-white">
        <div className="mx-auto flex min-h-8 max-w-[1160px] items-center justify-between px-5">
          <div>
            📍 Onanda Junction, Ogongo Circuit <span className="mx-2">|</span> 📞 081 800 8007
          </div>
          <div className="hidden gap-4 sm:flex">
            <span>novacrestprivateschool@gmail.com</span>
            <span>Reg: CC/20240/1741</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-[#eee9e4] bg-[#fffdfa]/95 shadow-[0_4px_18px_rgba(39,27,18,.06)] backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1160px] items-center justify-between px-5">
          <Link href="/" className="display text-[27px] font-semibold tracking-tight text-[#9a4823]">
            Nova Crest Academy
          </Link>
          <nav className="hidden items-center gap-8 text-[16px] md:flex">
            <Link href="/" className="text-[#3e3833] hover:text-[#9a4823]">Home</Link>
            <Link href="/admissions" className="text-[#3e3833] hover:text-[#9a4823]">Admissions</Link>
            <Link href="/hostel" className="text-[#3e3833] hover:text-[#9a4823]">Hostel</Link>
            <Link href="/gallery" className="border-b-2 border-[#9a4823] pb-2 font-semibold text-[#9a4823]">Gallery</Link>
            <Link href="/fees" className="text-[#3e3833] hover:text-[#9a4823]">Fees</Link>
            <Link href="/learner-portal" className="text-[#3e3833] hover:text-[#9a4823]">Learner Portal</Link>
            <Link href="/admin" className="text-[#3e3833] hover:text-[#9a4823]">Admin Panel</Link>
            <Link href="/admissions" className="pill bg-[#a74714] px-8 py-3 text-sm font-bold text-white shadow-[0_6px_13px_rgba(167,71,20,.2)] hover:bg-[#8d3d12]">Apply Now</Link>
          </nav>
          <PublicMobileMenu />
        </div>
      </header>
    </>
  );
}

function GalleryFooter() {
  return (
    <footer className="bg-[#101c2c] py-14 text-white">
      <div className="mx-auto grid max-w-[1160px] gap-10 px-5 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="display text-2xl">Nova Crest Academy</div>
          <div className="mt-1 text-sm text-white/55">Private School</div>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/60">
            Empowering the next generation with creativity, critical thinking and technology skills in a safe, nurturing environment. Founded in 2024.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide">Quick Links</h3>
          <div className="mt-5 grid gap-3 text-sm text-white/60">
            <Link href="/">Home</Link>
            <Link href="/admissions">Admissions</Link>
            <Link href="/hostel">Hostel Services</Link>
            <Link href="/fees">Fees & Payments</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide">Stay Updated</h3>
          <p className="mt-5 text-sm leading-6 text-white/60">Subscribe to receive school news, events & announcements.</p>
          <div className="mt-5 flex overflow-hidden rounded-xl border border-white/15 bg-white/5">
            <input placeholder="Email Address" className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/35" />
            <button className="bg-[#f08a62] px-5 font-bold">→</button>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-[1160px] border-t border-white/10 px-5 pt-6 text-xs text-white/40">© 2024 Nova Crest Academy Private School. All rights reserved.</div>
    </footer>
  );
}

function GalleryEmptyState({ title = "Gallery images coming soon", description = "Our Gallery is being refreshed. Please check back soon for new photographs from life at Nova Crest Academy." }: { title?: string; description?: string }) {
  return (
    <div className="rounded-[2rem] border border-[#eee4dd] bg-white px-6 py-16 text-center shadow-[0_5px_15px_rgba(42,33,24,.05)] sm:px-12 sm:py-24">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1e9] text-[#a74714]"><Images size={28} strokeWidth={1.8} /></div>
      <h2 className="display mt-6 text-3xl text-[#171411] sm:text-4xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#5d5651]">{description}</p>
    </div>
  );
}

export default function GalleryPage() {
  const gallery = trpc.publicSite.gallery.useQuery();
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set((gallery.data ?? []).map(item => item.category).filter(Boolean)))], [gallery.data]);
  const visibleItems = useMemo(() => {
    const rows = gallery.data ?? [];
    return activeCategory === "All" ? rows : rows.filter(item => item.category === activeCategory);
  }, [activeCategory, gallery.data]);

  return (
    <div className="min-h-screen bg-[#fffaf7] text-[#3d3732]">
      <GalleryHeader />
      <main>
        <section className="mx-auto max-w-[900px] px-5 pb-12 pt-20 text-center sm:pt-24">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="pill inline-flex items-center gap-2 bg-[#f1de13] px-4 py-2 text-sm font-semibold text-[#221d0f]"><Images size={17} /> VISUAL JOURNEY</span>
            <h1 className="display text-4xl leading-none text-[#171411] sm:text-5xl">Life at Nova Crest</h1>
          </div>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[#5d5651] sm:text-lg">Explore the vibrant atmosphere where academic excellence meets the joy of discovery through our curated gallery of moments.</p>
        </section>

        <section className="mx-auto max-w-[1160px] px-5 pb-24" aria-live="polite">
          {gallery.isLoading && <GalleryEmptyState title="Loading gallery images" description="The latest photographs from Nova Crest Academy are loading." />}
          {gallery.isError && <GalleryEmptyState title="Gallery temporarily unavailable" description="We could not load the latest gallery images. Please try again shortly." />}
          {!gallery.isLoading && !gallery.isError && !gallery.data?.length && <GalleryEmptyState />}
          {!gallery.isLoading && !gallery.isError && Boolean(gallery.data?.length) && (
            <>
              <div className="mb-8 flex flex-wrap justify-center gap-3" aria-label="Gallery categories">
                {categories.map(category => (
                  <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`pill border px-5 py-2.5 text-sm font-semibold transition ${activeCategory === category ? "border-[#a74714] bg-[#a74714] text-white" : "border-[#e9dcd2] bg-white text-[#6a5c52] hover:border-[#a74714] hover:text-[#a74714]"}`}>
                    {category}
                  </button>
                ))}
              </div>
              {visibleItems.length ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleItems.map(item => (
                    <article key={`uploaded-gallery-${item.id}`} className="overflow-hidden rounded-[1.5rem] border border-[#eee4dd] bg-white shadow-[0_5px_15px_rgba(42,33,24,.05)]">
                      <div className="aspect-[4/3] overflow-hidden bg-[#f4eee9]"><img src={item.imageUrl} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]" /></div>
                      <div className="p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#a74714]">{item.category}</p><h2 className="display mt-2 text-2xl text-[#171411]">{item.title}</h2></div>
                    </article>
                  ))}
                </div>
              ) : <GalleryEmptyState title="No images in this category" description="Choose another category to view the photographs currently published by the school." />}
            </>
          )}
        </section>

        <section className="mx-auto mb-24 max-w-[1160px] px-5">
          <div className="relative overflow-hidden rounded-[3rem] bg-[#0d6db7] px-8 py-14 text-white sm:px-20 sm:py-20">
            <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-white/10" />
            <div className="absolute bottom-0 right-[32%] h-28 w-28 rounded-full bg-[#f58a67]/30" />
            <div className="relative">
              <h2 className="display text-4xl leading-tight sm:text-5xl">See It All For Yourself</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg">Photographs only tell part of the story. Schedule a personalized tour to experience the energy and warmth of our community in person.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="mailto:novacrestprivateschool@gmail.com?subject=Campus%20Tour%20Request" className="pill bg-[#f58a67] px-7 py-4 text-sm font-bold text-[#5a2d20] hover:bg-[#ff9b79]">Book a Campus Tour</a>
                <Link href="/admissions" className="pill border border-white/30 bg-white/10 px-7 py-4 text-sm font-bold hover:bg-white/15">Contact Admissions</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <GalleryFooter />
    </div>
  );
}
