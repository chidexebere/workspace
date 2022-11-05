const Footer = () => {
  const d = new Date();
  const year = d.getFullYear();
  return (
    <footer className="mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6 border-t flex items-center justify-center">
        <p className="text-center text-sm text-gray-400">
          © {year} WorkSpace, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
