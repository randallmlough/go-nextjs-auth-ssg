export default function Alert({ children }) {
  return (
    <div
      className="py-3 px-5 mb-4 bg-blue-100 text-blue-900 text-sm rounded-md border border-blue-200"
      role="alert"
    >
      {children}
    </div>
  );
}
