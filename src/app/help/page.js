
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, Search, ChevronDown, ChevronUp, MessageCircle, Mail, Phone,
  ArrowRight, Book, Package, Truck, Shield, CreditCard, RefreshCw,
  Clock, CheckCircle, AlertCircle, Info, ExternalLink, Send, 
  MapPin, Calendar, Star, ThumbsUp, ThumbsDown, Copy, Download
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HelpCenterPage() {
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'general',
    subject: '',
    message: '',
    priority: 'normal'
  });

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading help center...</p>
        </div>
      </div>
    );
  }

  const categories = [
    { id: 'all', label: 'All Topics', icon: HelpCircle, count: 24 },
    { id: 'orders', label: 'Orders & Shipping', icon: Package, count: 8 },
    { id: 'payments', label: 'Payments & Refunds', icon: CreditCard, count: 6 },
    { id: 'products', label: 'Products & Quality', icon: Star, count: 5 },
    { id: 'account', label: 'Account & Privacy', icon: Shield, count: 5 }
  ];

  const faqs = [
    // Orders & Shipping
    {
      id: 1,
      category: 'orders',
      question: 'How long does shipping take?',
      answer: 'We offer multiple shipping options:\n\n• **Express Delivery**: 1-2 business days (₹100)\n• **Standard Delivery**: 3-5 business days (₹50)\n• **Free Delivery**: 5-7 business days (orders above ₹999)\n\nAll spiritual items are blessed before dispatch. Delivery times may vary during festivals.',
      helpful: 45,
      unhelpful: 3
    },
    {
      id: 2,
      category: 'orders',
      question: 'Can I track my order?',
      answer: 'Yes! Once your order is shipped, you\'ll receive:\n\n• **SMS notification** with tracking number\n• **Email updates** at each delivery milestone\n• **Real-time tracking** in your account\n\nYou can track your order anytime by visiting the "My Orders" section in your profile.',
      helpful: 52,
      unhelpful: 1
    },
    {
      id: 3,
      category: 'orders',
      question: 'What is your return policy?',
      answer: 'We offer a **7-day return policy** for most items:\n\n• Items must be unused and in original packaging\n• Sacred books and blessed items cannot be returned\n• Free return pickup for orders above ₹500\n• Refund processed within 3-5 business days\n\n**Note**: Items blessed specifically for you cannot be returned due to spiritual reasons.',
      helpful: 38,
      unhelpful: 7
    },
    {
      id: 4,
      category: 'orders',
      question: 'Do you deliver internationally?',
      answer: 'Currently, we deliver only within India to these locations:\n\n• **Major Cities**: Same-day delivery available\n• **Tier-2 Cities**: 1-3 business days\n• **Remote Areas**: 5-7 business days\n• **Kashmir, Northeast**: Special shipping rates apply\n\nWe\'re working on international shipping. Subscribe to our newsletter for updates!',
      helpful: 29,
      unhelpful: 12
    },

    // Payments & Refunds
    {
      id: 5,
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods:\n\n**Digital Payments:**\n• UPI (Google Pay, PhonePe, Paytm)\n• Credit/Debit Cards (Visa, MasterCard, RuPay)\n• Net Banking (all major banks)\n• Digital Wallets (Paytm, Amazon Pay)\n\n**Other Options:**\n• Cash on Delivery (₹50 extra)\n• EMI options available for orders above ₹5,000',
      helpful: 67,
      unhelpful: 2
    },
    {
      id: 6,
      category: 'payments',
      question: 'Is my payment information secure?',
      answer: 'Absolutely! Your payment security is our top priority:\n\n• **SSL Encryption**: All transactions are encrypted\n• **PCI DSS Compliant**: Industry-standard security\n• **No Card Storage**: We don\'t store your card details\n• **Secure Gateways**: Razorpay & PayU integration\n• **Fraud Protection**: Real-time transaction monitoring\n\nWe never see or store your complete card information.',
      helpful: 78,
      unhelpful: 1
    },
    {
      id: 7,
      category: 'payments',
      question: 'How do refunds work?',
      answer: 'Refunds are processed quickly and securely:\n\n**Timeline:**\n• **UPI/Wallets**: Instant to 24 hours\n• **Cards**: 3-5 business days\n• **Net Banking**: 2-4 business days\n• **Cash on Delivery**: Bank transfer in 5-7 days\n\n**Process:**\n1. Return request approved\n2. Refund initiated automatically\n3. SMS/Email confirmation sent\n4. Amount credited to original payment method',
      helpful: 43,
      unhelpful: 5
    },

    // Products & Quality
    {
      id: 8,
      category: 'products',
      question: 'How do you ensure product authenticity?',
      answer: 'We guarantee 100% authentic spiritual products:\n\n**Quality Assurance:**\n• Direct sourcing from certified artisans\n• Traditional manufacturing methods\n• Quality checks at multiple stages\n• Certificate of authenticity with premium items\n\n**Spiritual Authenticity:**\n• Items blessed by experienced priests\n• Sourced from sacred locations\n• Traditional rituals followed during creation\n• Proper storage in consecrated environment',
      helpful: 89,
      unhelpful: 3
    },
    {
      id: 9,
      category: 'products',
      question: 'What if I receive a damaged product?',
      answer: 'We take full responsibility for damaged products:\n\n**Immediate Steps:**\n1. **Take photos** of the damaged item\n2. **Contact us** within 24 hours\n3. **WhatsApp/Email** the images to us\n4. **Get instant approval** for replacement\n\n**Resolution:**\n• Free replacement sent immediately\n• No questions asked policy\n• Return pickup arranged\n• Expedited shipping for replacements',
      helpful: 56,
      unhelpful: 2
    },
    {
      id: 10,
      category: 'products',
      question: 'Do you provide care instructions?',
      answer: 'Yes! Every product comes with detailed care instructions:\n\n**Physical Care:**\n• Cleaning and maintenance guidelines\n• Storage recommendations\n• Handling precautions\n• Longevity tips\n\n**Spiritual Care:**\n• Daily prayer rituals\n• Proper placement guidelines\n• Auspicious timing for use\n• Purification methods\n\n**Digital Guide:**\nDetailed PDF guides available in your account after purchase.',
      helpful: 34,
      unhelpful: 4
    },

    // Account & Privacy
    {
      id: 11,
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Creating an account is simple and secure:\n\n**Quick Options:**\n• **Google Sign-in**: One-click registration\n• **Phone Number**: OTP verification\n• **Email**: Traditional signup\n\n**What You Get:**\n• Order history and tracking\n• Wishlist and recommendations\n• Exclusive member discounts\n• Birthday and festival offers\n• Priority customer support',
      helpful: 45,
      unhelpful: 1
    },
    {
      id: 12,
      category: 'account',
      question: 'How is my personal data protected?',
      answer: 'Your privacy is sacred to us:\n\n**Data Protection:**\n• End-to-end encryption for all data\n• No sharing with third parties\n• Secure cloud storage (AWS)\n• Regular security audits\n• GDPR compliant practices\n\n**Your Control:**\n• Download your data anytime\n• Delete account permanently\n• Control marketing preferences\n• Manage privacy settings\n\n**Transparency:**\nComplete privacy policy available in your account settings.',
      helpful: 67,
      unhelpful: 3
    }
  ];

  const quickActions = [
    {
      title: 'Track Your Order',
      description: 'Get real-time updates on your order status',
      icon: Truck,
      action: () => router.push('/orders'),
      color: 'blue'
    },
    {
      title: 'Return/Exchange',
      description: 'Easy returns and exchanges within 7 days',
      icon: RefreshCw,
      action: () => setShowContactForm(true),
      color: 'green'
    },
    {
      title: 'Payment Issues',
      description: 'Help with payment failures or refunds',
      icon: CreditCard,
      action: () => setShowContactForm(true),
      color: 'purple'
    },
    {
      title: 'Product Guide',
      description: 'Learn about product care and usage',
      icon: Book,
      action: () => setActiveCategory('products'),
      color: 'orange'
    }
  ];

  const contactOptions = [
    {
      title: 'Live Chat',
      description: 'Instant support for urgent queries',
      icon: MessageCircle,
      availability: 'Available 9 AM - 11 PM',
      response: 'Immediate',
      action: () => setShowContactForm(true),
      color: 'green',
      popular: true
    },
    {
      title: 'WhatsApp Support',
      description: 'Chat with our support team',
      icon: Phone,
      availability: '+91 98765 43210',
      response: '< 30 minutes',
      action: () => window.open('https://wa.me/919876543210'),
      color: 'green'
    },
    {
      title: 'Email Support',
      description: 'Detailed help for complex issues',
      icon: Mail,
      availability: 'support@poojapath.com',
      response: '< 24 hours',
      action: () => window.open('mailto:support@poojapath.com'),
      color: 'blue'
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our team',
      icon: Phone,
      availability: '1800-POOJA-PATH (Free)',
      response: 'Mon-Sat, 9 AM-7 PM',
      action: () => window.open('tel:1800766522'),
      color: 'orange'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFaqToggle = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Contact form submitted:', contactForm);
    alert('Thank you for contacting us! We\'ll get back to you within 24 hours. 🙏');
    setShowContactForm(false);
    setContactForm({
      name: '',
      email: '',
      phone: '',
      category: 'general',
      subject: '',
      message: '',
      priority: 'normal'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-orange-600 transition-colors">🏠 Home</Link>
            <ArrowRight size={16} />
            <span className="text-gray-900 font-medium">Help Center</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How can we help you? 🤝
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find answers to common questions, get support, or connect with our team for personalized assistance.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search size={24} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-lg"
            />
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>98% Resolution Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              <span>Avg Response: 2 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-500" />
              <span>4.9/5 Support Rating</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={index}
                  whileHover={{ y: -4 }}
                  onClick={action.action}
                  className={`p-6 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all text-left group`}
                >
                  <div className={`w-12 h-12 bg-${action.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} className={`text-${action.color}-600`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Browse by Category</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
                  }`}
                >
                  <Icon size={20} />
                  {category.label}
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
            <span className="text-lg font-normal text-gray-600 ml-2">
              ({filteredFaqs.length} results)
            </span>
          </h2>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or browse different categories.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => handleFaqToggle(faq.id)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-all flex items-center justify-between"
                  >
                    <h3 className="font-bold text-gray-900 text-lg pr-4">{faq.question}</h3>
                    {expandedFaq === faq.id ? (
                      <ChevronUp size={24} className="text-orange-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={24} className="text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="prose prose-gray max-w-none">
                            <div className="whitespace-pre-line text-gray-600 leading-relaxed">
                              {faq.answer}
                            </div>
                          </div>
                          
                          {/* Helpful Section */}
                          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              Was this helpful?
                            </div>
                            <div className="flex items-center gap-4">
                              <button className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-green-50 text-green-600 transition-all">
                                <ThumbsUp size={16} />
                                <span>{faq.helpful}</span>
                              </button>
                              <button className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-red-50 text-red-600 transition-all">
                                <ThumbsDown size={16} />
                                <span>{faq.unhelpful}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
            <p className="text-gray-600">Choose the best way to reach our support team</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.button
                  key={index}
                  whileHover={{ y: -4 }}
                  onClick={option.action}
                  className={`relative p-6 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all text-left group`}
                >
                  {option.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 bg-${option.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} className={`text-${option.color}-600`} />
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                  
                  <div className="space-y-1 text-xs text-gray-500">
                    <div>{option.availability}</div>
                    <div className="font-medium text-gray-700">{option.response}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Resources Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Resources</h2>
            <p className="text-gray-600">Helpful guides and documentation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book size={24} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">User Guide</h3>
              <p className="text-gray-600 text-sm mb-4">Complete guide to using PoojaPath</p>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mx-auto">
                <Download size={16} />
                Download PDF
              </button>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={24} className="text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Privacy Policy</h3>
              <p className="text-gray-600 text-sm mb-4">How we protect your data</p>
              <Link href="/privacy" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mx-auto">
                <ExternalLink size={16} />
                View Policy
              </Link>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Terms of Service</h3>
              <p className="text-gray-600 text-sm mb-4">Our terms and conditions</p>
              <Link href="/terms" className="flex items-center gap-2 text-green-600 hover:text-green-700 mx-auto">
                <ExternalLink size={16} />
                Read Terms
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Contact Form Modal */}
        <AnimatePresence>
          {showContactForm && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowContactForm(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-4 md:inset-8 lg:inset-16 xl:inset-32 bg-white rounded-3xl shadow-2xl z-50 overflow-y-auto"
              >
                <div className="p-8">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Contact Support</h2>
                    <button
                      onClick={() => setShowContactForm(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ChevronDown size={24} className="rotate-45" />
                    </button>
                  </div>

                  {/* Contact Form */}
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          required
                          value={contactForm.category}
                          onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="orders">Orders & Shipping</option>
                          <option value="payments">Payments & Refunds</option>
                          <option value="products">Products & Quality</option>
                          <option value="technical">Technical Support</option>
                          <option value="feedback">Feedback & Suggestions</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Brief description of your issue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        rows={6}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Please provide detailed information about your inquiry..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <div className="flex gap-4">
                        {[
                          { value: 'low', label: 'Low', color: 'green' },
                          { value: 'normal', label: 'Normal', color: 'blue' },
                          { value: 'high', label: 'High', color: 'orange' },
                          { value: 'urgent', label: 'Urgent', color: 'red' }
                        ].map((priority) => (
                          <label key={priority.value} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="priority"
                              value={priority.value}
                              checked={contactForm.priority === priority.value}
                              onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                              className={`text-${priority.color}-500`}
                            />
                            <span className="text-sm text-gray-700">{priority.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="flex-1 py-4 px-6 border border-gray-300 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Send size={20} />
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

