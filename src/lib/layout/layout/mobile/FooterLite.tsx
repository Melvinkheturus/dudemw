import Link from "next/link"

export default function FooterLite() {
  return (
    <footer className="border-t-2 border-black bg-white pb-20 lg:hidden">
      <div className="px-4 py-8">
        {/* Quick Links */}
        <div className="mb-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-center font-body text-sm">
          <Link href="/about" className="hover:text-red-600">
            About Us
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/contact" className="hover:text-red-600">
            Contact
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/faq" className="hover:text-red-600">
            FAQ
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/shipping" className="hover:text-red-600">
            Shipping
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/returns" className="hover:text-red-600">
            Returns
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/privacy" className="hover:text-red-600">
            Privacy
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="font-body text-xs text-gray-600">
            © 2025 Dude Mens Wear. All rights reserved.
          </p>
          <p className="mt-1 flex items-center justify-center gap-1 font-body text-xs text-gray-500">
            Crafted by{" "}
            <a
              href="https://mergex.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-medium text-red-600"
            >
              MergeX <span>⚡</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
