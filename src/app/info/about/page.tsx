"use client";

import Link from "next/link";

export default function About() {

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 bg-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-burgundy/5 blur-[120px] rounded-full translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-burgundy text-sm font-black uppercase tracking-[0.1em] mb-6 block animate-fade-in">
            Established 2026
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none uppercase">
            {"The Soul of Augeo".split(' ').map((word, i, arr) => (
              i === arr.length - 1 ? <span key={i} className="text-burgundy italic block md:inline">{word}</span> : word + ' '
            ))}
          </h1>
          <p className="text-gray-400 text-2xl max-w-2xl mx-auto leading-relaxed italic font-heading">
            "Redefining the horizon of global acquisition through certified integrity and institutional-grade excellence."
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative group">
              <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-2xl shadow-black/5 relative">
                 <img 
                   src="/images/about/origins.png" 
                   alt="Our Origins" 
                   className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-60" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-56 h-56 bg-burgundy rounded-2xl flex flex-col items-center justify-center p-8 shadow-2xl shadow-burgundy/30 border-4 border-white transform hover:-translate-y-2 transition-transform duration-500">
                <span className="text-5xl font-black text-dark mb-1 tracking-tighter">$420M+</span>
                <span className="text-xs font-black text-dark/70 uppercase tracking-[0.1em] text-center">
                  Protocol Asset Value Settled
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-5xl font-black text-dark tracking-tighter uppercase leading-none">
                {"Our Origins".split(' ').map((word, i, arr) => (
                  i === arr.length - 1 ? <span key={i} className="text-burgundy italic">{word}</span> : word + ' '
                ))}
              </h2>
              <p className="text-gray-500 text-xl leading-relaxed">
                Augeo was born from a singular vision: to bridge the gap between world-class auction houses and the next generation of global connoisseurs. We recognized that the traditional auction model, while prestigious, often lacked the transparency and technological agility required in the digital age.
              </p>
              <p className="text-gray-500 text-xl leading-relaxed">
                By integrating military-grade encryption, institutional-grade financial processing, and a rigorous multi-stage authentication protocol, we've created a 'Gated Marketplace' where integrity is the only currency that matters.
              </p>
              <div className="pt-4 grid grid-cols-2 gap-8">
                <div>
                   <span className="text-3xl font-black text-dark">100%</span>
                   <p className="text-sm font-black text-gray-400 uppercase tracking-[0.1em] mt-1">
                     Authenticated Listings
                   </p>
                </div>
                <div>
                   <span className="text-3xl font-black text-dark">120+</span>
                   <p className="text-sm font-black text-gray-400 uppercase tracking-[0.1em] mt-1">
                     Global Jurisdictions
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black tracking-tighter mb-4 uppercase">
              {"The Guild Principles".split(' ').map((word, i, arr) => (
                i === arr.length - 1 ? <span key={i} className="text-burgundy italic">{word}</span> : word + ' '
              ))}
            </h2>
            <div className="h-1 w-20 bg-burgundy mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                image: "/images/about/integrity.png", 
                title: "Radical Integrity", 
                desc: "Every asset passes through a triple-blind verification process before entering the vault." 
              },
              { 
                image: "/images/about/access.png", 
                title: "Borderless Access", 
                desc: "Connecting the world's most exclusive liquid assets with collectors regardless of geography." 
              },
              { 
                image: "/images/about/fluidity.png", 
                title: "Asset Fluidity", 
                desc: "Creating a highly-liquid secondary market for ultra-rare items through secure settlement." 
              }
            ].map((item, i) => {
              return (
                <div key={i} className="group p-10 bg-white/5 rounded-2xl border border-white/5 hover:border-burgundy/30 hover:bg-white/10 transition-all duration-500 relative overflow-hidden">
                  <div className="h-24 w-full mb-8 rounded-xl overflow-hidden relative border border-white/10">
                     <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" />
                     <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tight group-hover:text-burgundy transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white relative">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-5xl md:text-6xl font-black text-dark tracking-tighter mb-8 uppercase">
               {"Join the Executive Council".split(' ').map((word, i, arr) => (
                  i >= arr.length - 2 ? <span key={i} className="text-burgundy italic">{word} </span> : word + ' '
               ))}
            </h2>
            <p className="text-gray-500 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
               Augeo is more than a platform—it's a community of discerning buyers and sellers committed to excellence. Start your journey with us today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link href="/auth/register" className="btn-primary !px-12 !py-4 uppercase tracking-[0.1em] font-black text-sm">
                  Create Membership
               </Link>
               <Link href="/info/contact" className="px-12 py-4 border border-gray-200 hover:border-burgundy rounded-2xl font-black text-sm uppercase tracking-[0.1em] transition-all">
                  Contact Concierge
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
