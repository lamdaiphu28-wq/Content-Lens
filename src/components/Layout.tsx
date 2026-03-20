import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search } from 'lucide-react';
import { auth, loginWithGoogle, logout } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { cn } from '../lib/utils';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const isAdmin = user?.email === 'lamdaiphu28@gmail.com';

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#2D2D2D] font-sans selection:bg-[#F5E6E0]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F5E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-serif font-bold tracking-tighter text-[#1A1A1A]">
                LENS<span className="text-[#D4A373]">BEAUTY</span>
              </Link>
              <div className="hidden md:flex items-center gap-6 text-sm font-medium uppercase tracking-widest">
                <Link to="/category/tu-nhien" className="hover:text-[#D4A373] transition-colors">Lens Tự Nhiên</Link>
                <Link to="/category/tay" className="hover:text-[#D4A373] transition-colors">Lens Tây</Link>
                <Link to="/blog" className="hover:text-[#D4A373] transition-colors">Blog SEO</Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-[#F5E6E0] rounded-full transition-colors">
                <Search size={20} />
              </button>
              <Link to="/cart" className="p-2 hover:bg-[#F5E6E0] rounded-full transition-colors relative">
                <ShoppingBag size={20} />
                <span className="absolute top-0 right-0 bg-[#D4A373] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
              </Link>
              
              {user ? (
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <Link to="/admin" className="text-xs font-bold text-[#D4A373] hover:underline">ADMIN</Link>
                  )}
                  <button onClick={logout} className="text-xs font-medium hover:underline">Đăng xuất</button>
                  <img src={user.photoURL || ''} className="w-8 h-8 rounded-full border border-[#F5E6E0]" alt="User" />
                </div>
              ) : (
                <button onClick={loginWithGoogle} className="p-2 hover:bg-[#F5E6E0] rounded-full transition-colors">
                  <User size={20} />
                </button>
              )}
              
              <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-20 px-6">
          <div className="flex flex-col gap-6 text-lg font-medium">
            <Link to="/category/tu-nhien" onClick={() => setIsMenuOpen(false)}>Lens Tự Nhiên</Link>
            <Link to="/category/tay" onClick={() => setIsMenuOpen(false)}>Lens Tây</Link>
            <Link to="/blog" onClick={() => setIsMenuOpen(false)}>Blog SEO</Link>
            <hr className="border-[#F5E6E0]" />
            {user ? (
              <button onClick={logout} className="text-left">Đăng xuất</button>
            ) : (
              <button onClick={loginWithGoogle} className="text-left">Đăng nhập</button>
            )}
          </div>
        </div>
      )}

      <main className="pb-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold">LENSBEAUTY</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Chuyên cung cấp các dòng kính áp tròng cao cấp, an toàn và thời thượng. Mang lại vẻ đẹp tự nhiên và sự tự tin cho đôi mắt của bạn.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Sản phẩm</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link to="/category/tu-nhien">Lens Tự Nhiên</Link></li>
              <li><Link to="/category/tay">Lens Tây</Link></li>
              <li><Link to="/category/le-hoi">Lens Lễ Hội</Link></li>
              <li><Link to="/category/phu-kien">Phụ Kiện</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Hỗ trợ</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link to="/blog">Hướng dẫn đeo lens</Link></li>
              <li><Link to="/blog">Chính sách đổi trả</Link></li>
              <li><Link to="/blog">Liên hệ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Nhận ngay ưu đãi 10% cho đơn hàng đầu tiên.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email của bạn" className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm flex-1 outline-none focus:border-[#D4A373]" />
              <button className="bg-[#D4A373] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#B88A5E] transition-colors">Gửi</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-xs">
          © 2025 LENSBEAUTY. All rights reserved. Designed for SEO & Conversion.
        </div>
      </footer>
    </div>
  );
}
