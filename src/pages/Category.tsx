import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Filter, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { motion } from 'motion/react';
import ProductCard, { Product } from '../components/ProductCard';
import { cn } from '../lib/utils';

export default function Category() {
  const { slug } = useParams();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeColor, setActiveColor] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let q = query(collection(db, 'products'));
      if (slug !== 'all') {
        q = query(collection(db, 'products'), where('category', '==', slug));
      }
      const snapshot = await getDocs(q);
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      
      if (activeColor) {
        data = data.filter(p => p.color === activeColor);
      }
      
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [slug, activeColor]);

  const categoryName = slug === 'tu-nhien' ? 'Lens Tự Nhiên' : slug === 'tay' ? 'Lens Tây' : 'Tất cả sản phẩm';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#1A1A1A]">{categoryName}</h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto italic leading-relaxed">
          Khám phá bộ sưu tập {categoryName.toLowerCase()} được tuyển chọn kỹ lưỡng, mang lại vẻ đẹp hoàn hảo cho đôi mắt của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Filters */}
        <aside className="space-y-10">
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Filter size={14} />
              Bộ lọc màu sắc
            </h3>
            <div className="flex flex-wrap gap-3">
              {['Nâu', 'Đen', 'Xám', 'Xanh'].map(color => (
                <button 
                  key={color}
                  onClick={() => setActiveColor(activeColor === color ? null : color)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold border transition-all",
                    activeColor === color 
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
                      : "bg-white text-[#1A1A1A] border-[#F5E6E0] hover:border-[#D4A373]"
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Khoảng giá</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm cursor-pointer hover:text-[#D4A373]">
                <input type="checkbox" className="w-4 h-4 rounded border-[#F5E6E0] text-[#D4A373] focus:ring-[#D4A373]" />
                Dưới 200.000đ
              </label>
              <label className="flex items-center gap-3 text-sm cursor-pointer hover:text-[#D4A373]">
                <input type="checkbox" className="w-4 h-4 rounded border-[#F5E6E0] text-[#D4A373] focus:ring-[#D4A373]" />
                200.000đ - 500.000đ
              </label>
              <label className="flex items-center gap-3 text-sm cursor-pointer hover:text-[#D4A373]">
                <input type="checkbox" className="w-4 h-4 rounded border-[#F5E6E0] text-[#D4A373] focus:ring-[#D4A373]" />
                Trên 500.000đ
              </label>
            </div>
          </div>

          <div className="bg-[#F5E6E0]/30 p-8 rounded-3xl space-y-4">
            <h4 className="font-serif font-bold text-[#1A1A1A]">Bạn chưa biết chọn lens nào?</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Liên hệ ngay với chuyên gia tư vấn của chúng tôi để tìm được đôi lens phù hợp nhất.</p>
            <button className="w-full bg-white border border-[#F5E6E0] py-3 rounded-xl text-xs font-bold hover:bg-[#D4A373] hover:text-white transition-all">NHẬN TƯ VẤN</button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3 space-y-12">
          <div className="flex items-center justify-between border-b border-[#F5E6E0] pb-6">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{products.length} sản phẩm</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-bold cursor-pointer hover:text-[#D4A373]">
                Sắp xếp <ChevronDown size={14} />
              </div>
              <div className="flex items-center gap-2 border-l border-[#F5E6E0] pl-4">
                <LayoutGrid size={18} className="text-[#D4A373] cursor-pointer" />
                <List size={18} className="text-gray-300 cursor-pointer" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-[4/5] bg-gray-200 rounded-2xl" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-24 space-y-4">
              <p className="text-gray-400 italic">Không tìm thấy sản phẩm nào phù hợp.</p>
              <button onClick={() => setActiveColor(null)} className="text-[#D4A373] font-bold underline">Xóa bộ lọc</button>
            </div>
          )}
        </div>
      </div>

      {/* SEO Content Bottom */}
      <section className="max-w-4xl mx-auto py-24 border-t border-[#F5E6E0]">
        <article className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed">
          <h2 className="text-3xl font-serif font-bold text-[#1A1A1A] mb-8 text-center">Bí quyết chọn {categoryName} hoàn hảo cho đôi mắt</h2>
          <p>
            Khi nhắc đến <strong>{categoryName.toLowerCase()}</strong>, người dùng thường quan tâm đến sự tự nhiên và thoải mái. Một đôi lens tốt không chỉ giúp thay đổi diện mạo mà còn phải đảm bảo sức khỏe cho đôi mắt. Tại LENSBEAUTY, chúng tôi cung cấp các dòng lens với công nghệ khóa ẩm vượt trội, giúp mắt luôn long lanh và không bị khô dù đeo suốt cả ngày dài.
          </p>
          <p>
            Đối với những bạn có đôi mắt nhỏ, việc chọn <strong>lens mắt tự nhiên</strong> có đường kính (DIA) từ 14.0mm đến 14.2mm là lựa chọn tối ưu nhất. Nó giúp đôi mắt trông to tròn hơn một cách tinh tế mà không gây cảm giác "giả". Ngược lại, nếu bạn muốn một vẻ ngoài sắc sảo và quyến rũ, các dòng <strong>lens màu xám</strong> hoặc xanh với vân lens tinh xảo sẽ là trợ thủ đắc lực.
          </p>
          <p>
            Đừng quên vệ sinh lens đúng cách bằng nước ngâm chuyên dụng và thay lens định kỳ theo hướng dẫn của nhà sản xuất để bảo vệ thị lực của bạn nhé!
          </p>
        </article>
      </section>
    </div>
  );
}
