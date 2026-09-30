import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-head" style={{ minHeight: "80vh", ["--c" as string]: "#FF3FA4" }}>
      <span className="aura" aria-hidden="true" />
      <div className="wrap">
        <h1 className="page-title">Page not found</h1>
        <p className="page-intro">The link may be old or mistyped. Search for what you need, or head back to the homepage.</p>
        <div className="hero-actions" style={{ marginTop: 28 }}>
          <Link href="/" className="btn btn-solid">
            Go to the homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
