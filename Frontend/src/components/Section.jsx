export default function Section({ title, children }) {
  return (
    <div className="max-w-7xl mx-auto p-4 mb-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {children}
      </div>
    </div>
  );
}