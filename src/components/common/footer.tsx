export function Footer() {
  return (
    <footer className="border-t py-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Maison</p>
          <div className="flex items-center gap-6">
            <a href="https://fakestoreapi.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Powered by FakeStoreAPI
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
