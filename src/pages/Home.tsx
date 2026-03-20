import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import ProductCard, { Product } from '../components/ProductCard';
import { db } from '../lib/firebase';
import { collection, query, limit, getDocs } from 'firebase/firestore';

export default function Home() {
  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, 'products'), limit(4));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-[#FDFCFB]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1920&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-20"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFCFB] via-[#FDFCFB]/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5E6E0] text-[#D4A373] rounded-full text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} />
              Tự tin tỏa sáng cùng đôi mắt đẹp
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-[#1A1A1A] leading-[1.1] tracking-tighter">
              Đánh thức <br />
              <span className="text-[#D4A373] italic">Vẻ Đẹp</span> <br />
              Của Đôi Mắt
            </h1>
            <p className="text-lg text-gray-500 max-w-md leading-relaxed">
              Khám phá bộ sưu tập kính áp tròng cao cấp, mang lại vẻ đẹp tự nhiên, êm ái suốt cả ngày dài. Lựa chọn hoàn hảo cho mọi phong cách.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/category/tu-nhien" className="px-8 py-4 bg-[#1A1A1A] text-white rounded-full font-bold hover:bg-[#D4A373] transition-all duration-300 flex items-center gap-2 group shadow-xl shadow-[#1A1A1A]/10">
                Mua ngay <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/blog" className="px-8 py-4 bg-white border border-[#F5E6E0] text-[#1A1A1A] rounded-full font-bold hover:bg-[#F5E6E0] transition-all duration-300">
                Tìm hiểu thêm
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative aspect-square rounded-full overflow-hidden border-[12px] border-white shadow-2xl shadow-[#D4A373]/20">
              <img 
                src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover"
                alt="Product Showcase"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-[#F5E6E0] max-w-[200px] space-y-2">
              <div className="flex items-center gap-2 text-[#D4A373]">
                <ShieldCheck size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">An toàn 100%</span>
              </div>
              <p className="text-[10px] text-gray-400">Đạt chuẩn y tế quốc tế, bảo vệ đôi mắt tối ưu.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1A1A1A]">Danh mục nổi bật</h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto italic">Lựa chọn phong cách phù hợp nhất với cá tính của bạn</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Lens Tự Nhiên', slug: 'tu-nhien', img: 'https://images.unsplash.com/photo-1519415510236-85591199b606?q=80&w=800&auto=format&fit=crop', desc: 'Dành cho đi học, đi làm hàng ngày' },
            { name: 'Lens Tây', slug: 'tay', img: 'https://images.unsplash.com/photo-1521119989659-a83eee488232?q=80&w=800&auto=format&fit=crop', desc: 'Tạo điểm nhấn quyến rũ, cá tính' },
            { name: 'Lens Cho Người Mới', slug: 'nguoi-moi', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop', desc: 'Dễ đeo, êm ái, độ ẩm cao' },
          ].map((cat, idx) => (
            <motion.div 
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer"
            >
              <img src={cat.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cat.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 p-8 space-y-2">
                <h3 className="text-2xl font-serif font-bold text-white">{cat.name}</h3>
                <p className="text-white/70 text-sm">{cat.desc}</p>
                <Link to={`/category/${cat.slug}`} className="inline-flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest pt-4 group-hover:text-[#D4A373] transition-colors">
                  Khám phá ngay <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-[#F5E6E0]/30 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1A1A1A]">Sản phẩm bán chạy</h2>
              <p className="text-gray-400 text-sm italic">Những mẫu lens được săn đón nhất trong tháng này</p>
            </div>
            <Link to="/category/all" className="text-sm font-bold uppercase tracking-widest text-[#D4A373] hover:underline flex items-center gap-2">
              Xem tất cả <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map(p => <ProductCard key={p.id} product={p} />)
            ) : (
              // Mock data if Firestore is empty
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-[4/5] bg-gray-200 rounded-2xl" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-[#F5E6E0]">
        <article className="prose prose-stone max-w-none">
          <h2 className="text-3xl font-serif font-bold text-[#1A1A1A] mb-8 text-center">Tại sao nên chọn Lens Mắt tại LENSBEAUTY?</h2>
          <div className="text-gray-600 leading-relaxed space-y-6">
            <p>
              Việc tìm kiếm một đôi <strong>lens mắt tự nhiên</strong> không chỉ là về thẩm mỹ mà còn là sự an toàn cho đôi mắt của bạn. Tại LENSBEAUTY, chúng tôi hiểu rằng mỗi đôi mắt đều xứng đáng được chăm sóc bởi những sản phẩm tốt nhất. Đó là lý do tại sao chúng tôi chỉ cung cấp các dòng kính áp tròng đạt chuẩn quốc tế, từ các thương hiệu uy tín nhất.
            </p>
            <p>
              Dù bạn đang tìm kiếm <strong>lens màu nâu</strong> ấm áp cho phong cách công sở, hay <strong>lens xám</strong> quyến rũ cho những buổi tiệc tối, bộ sưu tập của chúng tôi đều có thể đáp ứng. Đặc biệt, các dòng <strong>kính áp tròng cho người mới</strong> của chúng tôi được thiết kế với độ ẩm cao, giúp bạn làm quen dễ dàng mà không gây cộm hay khô mắt.
            </p>
            <p>
              Với công nghệ khóa màu tiên tiến, màu sắc của lens được nằm giữa các lớp màng bảo vệ, đảm bảo không tiếp xúc trực tiếp với giác mạc. Hãy để LENSBEAUTY giúp bạn tỏa sáng với đôi mắt long lanh, cuốn hút mọi ánh nhìn ngay hôm nay!
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
