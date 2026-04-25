export default function CategoryBar() {
  const categories = [
    { name: "Women", id: "women" },
    { name: "Men", id: "men" },
    { name: "Electronics", id: "electronics" },
    { name: "Deals", id: "deals" },
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#0f0f0f] border-b border-white/10">

      <div className="max-w-[1100px] mx-auto flex items-center justify-center gap-10 py-3 text-sm text-stone-400">

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => scrollToSection(cat.id)}
            className="relative hover:text-white transition"
          >
            {cat.name}

            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#d4b06a] transition-all hover:w-full"></span>
          </button>
        ))}

      </div>
    </div>
  );
}