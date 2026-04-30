import { useLocation, useNavigate } from "react-router-dom";

export default function CategoryBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const categories = [
    { name: "Women", id: "women" },
    { name: "Men", id: "men" },
    { name: "Electronics", id: "electronics" },
    { name: "Deals", id: "deals" },
    { name: "Kids", id: "kids" },
    { name: "Jewellery", id: "jewellery" },
    { name: "Healthcare", id: "healthcare" },
  ];

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed top-16 left-0 w-full z-40 bg-black/40 backdrop-blur-md shadow-lg shadow-black/10">

      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-2 text-sm text-white/70">

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => scrollToSection(cat.id)}
            className="relative py-1 hover:text-[#d4b06a] transition"
          >
            {cat.name}

            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#d4b06a] transition-all hover:w-full"></span>
          </button>
        ))}

      </div>
    </div>
  );
}
