import React from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export default function Blog() {
  const [posts, setPosts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'), limit(6));
      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchPosts();
  }, []);

  const demoPosts = [
    {
      id: '1',
      title: 'Lens nào hợp với mắt nhỏ? Bí quyết chọn lens tự nhiên nhất',
      excerpt: 'Bạn sở hữu đôi mắt nhỏ và đang băn khoăn không biết chọn size lens nào để trông tự nhiên mà vẫn long lanh? Hãy cùng khám phá ngay...',
      coverImage: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop',
      createdAt: new Date().toISOString(),
      author: 'LENSBEAUTY Editor'
    },
    {
      id: '2',
      title: 'Top 5 mẫu lens tự nhiên 2025 được phái đẹp săn đón',
      excerpt: 'Xu hướng làm đẹp 2025 gọi tên những đôi mắt trong veo, tự nhiên. Dưới đây là danh sách 5 mẫu lens bán chạy nhất tại LENSBEAUTY...',
      coverImage: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=800&auto=format&fit=crop',
      createdAt: new Date().toISOString(),
      author: 'LENSBEAUTY Editor'
    },
    {
      id: '3',
      title: 'Hướng dẫn đeo lens cho người mới bắt đầu cực đơn giản',
      excerpt: 'Lần đầu đeo lens và cảm thấy lúng túng? Đừng lo, bài viết này sẽ hướng dẫn bạn từng bước một cách chi tiết và an toàn nhất...',
      coverImage: 'https://images.unsplash.com/photo-1521119989659-a83eee488232?q=80&w=800&auto=format&fit=crop',
      createdAt: new Date().toISOString(),
      author: 'LENSBEAUTY Editor'
    }
  ];

  const displayPosts = posts.length > 0 ? posts : demoPosts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#1A1A1A]">Blog SEO & Cẩm Nang Đẹp</h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto italic leading-relaxed">
          Chia sẻ kiến thức, xu hướng và bí quyết chăm sóc đôi mắt luôn rạng rỡ mỗi ngày.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {displayPosts.map((post, idx) => (
          <motion.article 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="group space-y-6"
          >
            <Link to={`/blog/${post.slug || post.id}`} className="block aspect-[16/10] rounded-3xl overflow-hidden border border-[#F5E6E0]">
              <img src={post.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={post.title} />
            </Link>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#D4A373]">
                <span className="flex items-center gap-1"><Calendar size={12} /> 20/03/2025</span>
                <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
              </div>
              <Link to={`/blog/${post.slug || post.id}`} className="block">
                <h3 className="text-xl font-serif font-bold text-[#1A1A1A] group-hover:text-[#D4A373] transition-colors leading-tight">
                  {post.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
              <Link to={`/blog/${post.slug || post.id}`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-[#D4A373] transition-colors">
                Đọc tiếp <ArrowRight size={14} />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Blog SEO Content */}
      <section className="max-w-4xl mx-auto py-24 border-t border-[#F5E6E0]">
        <div className="bg-[#F5E6E0]/30 p-12 rounded-[40px] space-y-8 text-center">
          <BookOpen className="mx-auto text-[#D4A373]" size={40} />
          <h2 className="text-3xl font-serif font-bold text-[#1A1A1A]">Kiến thức là sức mạnh của vẻ đẹp</h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Tại LENSBEAUTY, chúng tôi không chỉ bán sản phẩm, chúng tôi mang đến giải pháp làm đẹp an toàn. Chuyên mục Blog SEO được xây dựng để cung cấp cho bạn những thông tin hữu ích nhất về <strong>cách đeo lens</strong>, <strong>vệ sinh kính áp tròng</strong> và cập nhật những <strong>xu hướng lens mắt 2025</strong> mới nhất.
          </p>
          <button className="bg-[#1A1A1A] text-white px-10 py-4 rounded-full font-bold hover:bg-[#D4A373] transition-all shadow-xl shadow-[#1A1A1A]/10">
            KHÁM PHÁ TẤT CẢ BÀI VIẾT
          </button>
        </div>
      </section>
    </div>
  );
}
