export default function Footer() {
    return (
        <footer className="bg-[#161616] text-gray-400">
            <div className="container mx-auto px-4 py-6 text-center text-sm">
                © {new Date().getFullYear()} Skill Test. All rights reserved.
            </div>
        </footer>
    );
}
