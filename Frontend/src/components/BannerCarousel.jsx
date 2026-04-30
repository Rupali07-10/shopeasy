import { useCallback, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const banners = [
  {
    title: "Fashion Finds",
    desc: "Explore women and men styles picked for everyday comfort and festive looks.",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80",
    target: "women",
  },
  {
    title: "Latest Electronics",
    desc: "Smart gadgets, audio gear, and desk upgrades.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80",
    target: "electronics",
  },
  {
    title: "Home Essentials",
    desc: "Useful appliances and comfort picks for your space.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    target: "home-appliances",
  },
  {
    title: "Deals Worth Grabbing",
    desc: "Limited-time offers on phones, audio, accessories, and more.",
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1600&q=80",
    target: "deals",
  },
  {
    title: "Kids Corner",
    desc: "Toys, school picks, and playful essentials for little shoppers.",
    image:
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1600&q=80",
    target: "kids",
  },
  {
    title: "Jewellery Edit",
    desc: "Elegant pieces for daily styling, gifting, and special occasions.",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
    target: "jewellery",
  },
  {
    title: "Wellness Picks",
    desc: "Healthcare and fitness essentials for your daily routine.",
    image:
      "https://images.unsplash.com/photo-1514995669114-6081e934b693?auto=format&fit=crop&w=1600&q=80",
    target: "healthcare",
  },
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % banners.length);
  }, []);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 4500);

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative w-full overflow-hidden bg-gray-100 dark:bg-[#0f0f0f]">
      <div className="relative h-[58vh] min-h-[430px] max-h-[620px] w-full overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {banners.map((banner) => (
            <div key={banner.title} className="min-w-full h-full relative">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />

              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto w-full px-6">
                  <div className="max-w-xl text-white">
                    <p className="text-sm font-semibold text-[#d4b06a] mb-3">
                      ShopEasy Picks
                    </p>

                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                      {banner.title}
                    </h1>

                    <p className="text-base md:text-lg text-gray-200 mb-7">
                      {banner.desc}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => scrollToSection(banner.target)}
                        className="bg-[#d4b06a] text-black px-6 py-3 rounded hover:bg-[#e3bf77] transition"
                      >
                        Shop Now
                      </button>

                      <button
                        onClick={() => scrollToSection("deals")}
                        className="border border-white/60 text-white px-6 py-3 rounded hover:bg-white hover:text-black transition"
                      >
                        View Deals
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          aria-label="Previous banner"
          className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 bg-black/45 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition"
        >
          <FaChevronLeft />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next banner"
          className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 bg-black/45 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition"
        >
          <FaChevronRight />
        </button>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((banner, i) => (
            <button
              key={banner.title}
              onClick={() => setIndex(i)}
              aria-label={`Show ${banner.title}`}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-8 bg-[#d4b06a]" : "w-2.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
