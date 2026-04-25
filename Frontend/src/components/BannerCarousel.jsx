export default function BannerCarousel() {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">

      <div className="relative rounded-[28px] overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da"
          className="w-full h-[280px] object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex items-center px-10">
          <h1 className="text-white text-3xl font-serif">
            Premium Picks ✨
          </h1>
        </div>

      </div>
    </div>
  );
}