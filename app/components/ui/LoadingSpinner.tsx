export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-[#050816] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  );
}
