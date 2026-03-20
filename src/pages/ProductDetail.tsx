import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import { ShoppingCart, Star, ShieldCheck, Truck, RefreshCw, ChevronRight, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { formatPrice, cn } from '../lib/utils';
import ProductCard, { Product } from '../components/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = React.useState<any>(null);
  const [related, setRelated] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as any;
        setProduct(data);
        
        // Fetch related products
        const rq = query(collection(db, 'products'), where('category', '==', data.category), limit(4));
        const rSnapshot = await getDocs(rq);
        setRelated(rSnapshot.docs.filter(d => d.id !== data.id).map(d => ({ id: d.id, ...d.data() } as Product)));
      }
      setLoading(false);
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A373]"></div></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Sản phẩm không tồn tại.</div>;

  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.metaDescription || product.shortDescription,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "VND",
      "price": product.price,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-widest">
        <Link to="/" className="hover:text-[#D4A373]">Trang chủ</Link>
        <ChevronRight size={12} />
        <Link to={`/category/${product.category}`} className="hover:text-[#D4A373]">{product.category}</Link>
        <ChevronRight size={12} />
        <span className="text-[#1A1A1A] truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-[#F5E6E0] bg-white">
            <img src={product.images[0]} className="w-full h-full object-cover" alt={product.name} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img: string, i: number) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-[#F5E6E0] cursor-pointer hover:border-[#D4A373] transition-colors">
                <img src={img} className="w-full h-full object-cover" alt={`${product.name} ${i}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#D4A373]">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <span className="text-xs font-bold text-gray-400 ml-2">(48 đánh giá)</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-[#1A1A1A] leading-tight">{product.name}</h1>
            <p className="text-3xl font-serif font-bold text-[#D4A373]">{formatPrice(product.price)}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 py-8 border-y border-[#F5E6E0]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Thương hiệu</span>
              <p className="text-sm font-bold">{product.brand}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Màu sắc</span>
              <p className="text-sm font-bold">{product.color}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">DIA / BC</span>
              <p className="text-sm font-bold">{product.dia}mm / {product.bc}mm</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Hạn sử dụng</span>
              <p className="text-sm font-bold">{product.duration}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center justify-between border border-[#F5E6E0] rounded-xl px-6 py-4">
                <button className="text-xl font-bold">-</button>
                <span className="font-bold">1</span>
                <button className="text-xl font-bold">+</button>
              </div>
              <button className="flex-[2] bg-[#1A1A1A] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#D4A373] transition-all shadow-xl shadow-[#1A1A1A]/10">
                <ShoppingCart size={20} />
                THÊM VÀO GIỎ HÀNG
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <div className="w-10 h-10 bg-[#F5E6E0] text-[#D4A373] rounded-full flex items-center justify-center mx-auto">
                  <Truck size={18} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest block">Giao nhanh</span>
              </div>
              <div className="text-center space-y-2">
                <div className="w-10 h-10 bg-[#F5E6E0] text-[#D4A373] rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest block">Chính hãng</span>
              </div>
              <div className="text-center space-y-2">
                <div className="w-10 h-10 bg-[#F5E6E0] text-[#D4A373] rounded-full flex items-center justify-center mx-auto">
                  <RefreshCw size={18} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest block">Đổi trả 7 ngày</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content & Description */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <div className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-bold prose-h2:text-3xl prose-h3:text-xl prose-p:text-gray-600 prose-p:leading-relaxed">
            {product.content ? (
              <ReactMarkdown>{product.content}</ReactMarkdown>
            ) : (
              <div className="space-y-6">
                <h2 className="text-3xl font-serif font-bold text-[#1A1A1A]">Mô tả sản phẩm</h2>
                <p>{product.shortDescription}</p>
                <div className="bg-[#F5E6E0]/30 p-8 rounded-3xl border border-[#F5E6E0]">
                  <h3 className="text-xl font-serif font-bold mb-4">Lợi ích nổi bật</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Chất liệu cao cấp, êm ái suốt 12h</li>
                    <li>Công nghệ khóa màu an toàn tuyệt đối</li>
                    <li>Độ ẩm vượt trội, không gây khô mắt</li>
                    <li>Màu sắc tự nhiên, tôn vinh vẻ đẹp đôi mắt</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* FAQ Section */}
          {product.faqs && product.faqs.length > 0 && (
            <div className="space-y-8 pt-12 border-t border-[#F5E6E0]">
              <h2 className="text-3xl font-serif font-bold text-[#1A1A1A] flex items-center gap-3">
                <HelpCircle className="text-[#D4A373]" />
                Câu hỏi thường gặp
              </h2>
              <div className="space-y-4">
                {product.faqs.map((faq: any, i: number) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-[#F5E6E0] space-y-2">
                    <h4 className="font-bold text-[#1A1A1A]">{faq.question}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar / Related */}
        <div className="space-y-12">
          <div className="bg-[#1A1A1A] text-white p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-serif font-bold">Ưu đãi đặc biệt</h3>
            <p className="text-sm text-gray-400">Mua combo 2 cặp lens giảm ngay 10% + Tặng kèm nước ngâm lens cao cấp.</p>
            <button className="w-full bg-[#D4A373] py-3 rounded-xl font-bold text-sm hover:bg-[#B88A5E] transition-colors">NHẬN ƯU ĐÃI NGAY</button>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">Sản phẩm tương tự</h3>
            <div className="space-y-6">
              {related.map(p => (
                <Link key={p.id} to={`/product/${p.slug}`} className="flex gap-4 group">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#F5E6E0] flex-shrink-0">
                    <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={p.name} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold line-clamp-2 group-hover:text-[#D4A373] transition-colors">{p.name}</h4>
                    <p className="text-sm font-serif font-bold text-[#D4A373]">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
