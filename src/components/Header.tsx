import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, Image, Shirt, BookOpen, Users, MessageSquare, Palette, PenTool, Info } from 'lucide-react';
import { useProfile } from '../App';

interface Features {
  home: boolean;
  profile: boolean;
  gallery: boolean;
  fursuit: boolean;
  diary: boolean;
  friends: boolean;
  guestbook: boolean;
  commission: boolean;
  extras: boolean;
  qna: boolean;
}

interface SiteConfig {
  title: string;
  subtitle: string;
  useProfileName: boolean;
}

interface HeaderProps {
  features: Features;
  siteConfig?: SiteConfig;
}

export default function Header({ features, siteConfig }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { getActiveProfile, getDisplayProfile } = useProfile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeProfile = getActiveProfile();
  const displayProfile = getDisplayProfile();

  const navItems = [
    { path: '/', label: '首页', icon: Home, feature: 'home' as const },
    { path: '/profile', label: '兽设档案', icon: User, feature: 'profile' as const },
    { path: '/gallery', label: '作品图库', icon: Image, feature: 'gallery' as const },
    { path: '/fursuit', label: '兽装专栏', icon: Shirt, feature: 'fursuit' as const },
    { path: '/diary', label: '日常随笔', icon: BookOpen, feature: 'diary' as const },
    { path: '/friends', label: '亲友墙', icon: Users, feature: 'friends' as const },
    { path: '/guestbook', label: '留言板', icon: MessageSquare, feature: 'guestbook' as const },
    { path: '/commission', label: '约稿', icon: Palette, feature: 'commission' as const },
    { path: '/qna', label: '问答', icon: PenTool, feature: 'qna' as const },
    { path: '/about', label: '关于', icon: Info, feature: 'home' as const },
  ].filter(item => features[item.feature]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full shadow-lg group-hover:scale-110 transition-transform overflow-hidden border-2 border-white">
            {displayProfile?.avatar ? (
              <img src={displayProfile.avatar} alt="头像" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-fur-lightbrown to-fur-peach flex items-center justify-center">
                <span className="text-white text-xl">🦊</span>
              </div>
            )}
          </div>
          <span className="text-xl font-bold gradient-text hidden sm:block">
            {siteConfig?.useProfileName ? (displayProfile?.name || siteConfig.title || 'furpage™') : (siteConfig?.title || 'furpage™')}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-fur-lightbrown to-fur-peach text-white shadow-md'
                    : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          className="lg:hidden p-2 rounded-full hover:bg-white/50 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-lg border-t border-fur-beige/30">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-fur-lightbrown/20 to-fur-peach/20 text-fur-lightbrown'
                        : 'text-gray-600 hover:bg-fur-beige/30'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}