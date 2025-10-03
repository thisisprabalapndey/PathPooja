
"use client";
import { motion } from 'framer-motion';
import { ArrowRight, Headphones, Backpack, Zap, Watch, Smartphone, Camera } from 'lucide-react';
import Image from 'next/image';

const CATEGORIES = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Cutting-edge technology for modern life',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=600&fit=crop&q=80',
    icon: Zap,
    productCount: '120+ Products',
    color: 'from-blue-600 to-purple-600',
    featured: true
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Essential companions for your lifestyle',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop&q=80',
    icon: Backpack,
    productCount: '85+ Products',
    color: 'from-gray-700 to-gray-900'
  },
  {
    id: 'audio',
    name: 'Audio',
    description: 'Premium sound experiences',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop&q=80',
    icon: Headphones,
    productCount: '45+ Products',
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'wearables',
    name: 'Wearables',
    description: 'Technology that moves with you',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&q=80',
    icon: Watch,
    productCount: '32+ Products',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'mobile',
    name: 'Mobile',
    description: 'Stay connected everywhere',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop&q=80',
    icon: Smartphone,
    productCount: '28+ Products',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'photography',
    name: 'Photography',
    description: 'Capture life in stunning detail',
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop&q=80',
    icon: Camera,
    productCount: '67+ Products',
    color: 'from-purple-600 to-indigo-600'
  }
];

export default function CategoriesSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our carefully curated collections designed for every aspect of your modern lifestyle.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                  category.featured ? 'lg:col-span-2 lg:row-span-1' : ''
                }`}
              >
                {/* Background Image */}
                <div className="relative h-80 lg:h-96 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80 group-hover:opacity-70 transition-opacity duration-500`} />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
                    
                    {/* Top Section */}
                    <div className="flex justify-between items-start">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl"
                      >
                        <Icon size={28} />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-right"
                      >
                        <div className="text-sm font-medium opacity-90">
                          {category.productCount}
                        </div>
                      </motion.div>
                    </div>

                    {/* Bottom Section */}
                    <div>
                      <motion.h3 
                        className={`font-bold mb-2 ${category.featured ? 'text-3xl lg:text-4xl' : 'text-2xl'}`}
                      >
                        {category.name}
                      </motion.h3>
                      
                      <motion.p 
                        className={`opacity-90 mb-4 ${category.featured ? 'text-lg' : 'text-base'}`}
                      >
                        {category.description}
                      </motion.p>
                      
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="inline-flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <span>Explore Collection</span>
                        <ArrowRight size={16} />
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Hover Effect Border */}
                  <motion.div
                    className="absolute inset-0 border-4 border-white/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ borderColor: 'rgba(255,255,255,0.6)' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2 hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            View All Categories
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

