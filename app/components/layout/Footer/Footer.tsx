import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";


export default function Footer() {
    return (
        <footer className="bg-black  text-white border-t border-gray-900">
            <div className="max-w-screen-2xl mx-auto px-8 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/images/shoeImage.png"
                            alt="Skill Test Logo"
                            width={70}
                            height={26}
                            className="object-contain"
                            priority
                        />
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9  flex items-center justify-center  transition-colors"
                            aria-label="Facebook"
                        >
                            <Facebook size={18} />
                        </Link>

                        <Link
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9  flex items-center justify-center  transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram size={18} />
                        </Link>

                        <Link
                            href="https://x.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9  flex items-center justify-center  transition-colors"
                            aria-label="X (Twitter)"
                        >
                            <Twitter size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}