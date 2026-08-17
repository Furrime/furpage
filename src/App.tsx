import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingParticles from "@/components/FloatingParticles";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Gallery from "@/pages/Gallery";
import Fursuit from "@/pages/Fursuit";
import Diary from "@/pages/Diary";
import Friends from "@/pages/Friends";
import Guestbook from "@/pages/Guestbook";
import Commission from "@/pages/Commission";
import QNA from "@/pages/QNA";
import About from "@/pages/About";
import Changelog from "@/pages/Changelog";
import AdminLogin from "@/pages/AdminLogin";
import AdminPanel from "@/pages/AdminPanel";
import AdminInit from "@/pages/AdminInit";

interface ConfigFeatures {
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

export interface ProfileData {
  id: string;
  name: string;
  species: string;
  gender: string;
  age: number;
  height: number;
  fur_color: string;
  personality: string;
  likes: string[];
  dislikes: string[];
  bio: string;
  avatar: string;
  gallery: string[];
  habits: string;
  backstory: string;
  world_view: string;
  taboos: string;
  created_at: string;
}

interface SiteConfig {
  site: {
    title: string;
    subtitle: string;
    background: string;
    backgroundType: 'color' | 'image' | 'gradient';
    backgroundColor: string;
    useProfileName: boolean;
    displayProfileId: string;
  };
  profiles: ProfileData[];
  activeProfileId: string;
  features: ConfigFeatures;
}

interface ProfileContextType {
  profiles: ProfileData[];
  activeProfileId: string;
  selectedProfileId: string | null;
  setSelectedProfileId: (id: string | null) => void;
  getActiveProfile: () => ProfileData | undefined;
  getDisplayProfile: () => ProfileData | undefined;
}

export const ProfileContext = createContext<ProfileContextType | null>(null);

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

export default function App() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async (retryCount = 0) => {
    try {
      setError(null);
      const response = await fetch('/api/admin/config', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setConfig(data.data);
        
        const profiles = data.data.profiles || [];
        const activeProfileId = data.data.activeProfileId || '';
        const activeProfile = profiles.find((p: ProfileData) => p.id === activeProfileId) || profiles[0];
        
        const siteTitle = data.data.site?.title || 'furpage™';
        let finalTitle = siteTitle;

        if (data.data.site?.useProfileName && activeProfile?.name) {
          finalTitle = `${activeProfile.name} - furpage™`;
        } else {
          finalTitle = `${siteTitle} - furpage™`;
        }
        document.title = finalTitle;
        
        const favicon = activeProfile?.avatar || data.data.site?.favicon || '';
        if (favicon) {
          let faviconEl = document.querySelector('link[rel="icon"]');
          if (!faviconEl) {
            faviconEl = document.createElement('link');
            faviconEl.setAttribute('rel', 'icon');
            document.head.appendChild(faviconEl);
          }
          faviconEl.setAttribute('href', favicon);
          faviconEl.setAttribute('type', 'image/png');
        }
      }
    } catch (error) {
      console.error('Failed to fetch config:', error);
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => fetchConfig(retryCount + 1), delay);
      } else {
        setError('网络连接失败，请刷新页面重试');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    fetchConfig();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fur-cream">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fur-peach border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fur-cream p-4">
        <div className="text-center glass-card p-8 max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-fur-peach text-white font-medium rounded-lg hover:opacity-90 transition-all"
          >
            点击重试
          </button>
        </div>
      </div>
    );
  }

  const features = config?.features || {
    home: true,
    profile: true,
    gallery: true,
    fursuit: true,
    diary: true,
    friends: true,
    guestbook: true,
    commission: true,
    extras: true,
    qna: true,
  };

  const profiles = config?.profiles || [];
  const activeProfileId = config?.activeProfileId || '';
  const displayProfileId = config?.site?.displayProfileId || '';

  const getActiveProfile = () => {
    if (selectedProfileId) {
      return profiles.find(p => p.id === selectedProfileId);
    }
    return profiles.find(p => p.id === activeProfileId) || profiles[0];
  };

  const getDisplayProfile = () => {
    if (profiles.length === 1) {
      return profiles[0];
    }
    if (displayProfileId) {
      return profiles.find(p => p.id === displayProfileId);
    }
    return profiles.find(p => p.id === activeProfileId) || profiles[0];
  };

  const getBackgroundStyle = () => {
    if (!config?.site) return {};
    const { backgroundType, background, backgroundColor } = config.site;
    
    if (backgroundType === 'image' && background) {
      return {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
    
    if (backgroundType === 'gradient') {
      return {
        background: `linear-gradient(135deg, ${backgroundColor} 0%, #FFE4E1 100%)`,
      };
    }
    
    return {
      backgroundColor: backgroundColor || '#FFF8F0',
    };
  };

  return (
    <Router>
      <div className="min-h-screen" style={getBackgroundStyle()}>
        <FloatingParticles />
        <ProfileContext.Provider value={{
          profiles,
          activeProfileId,
          selectedProfileId,
          setSelectedProfileId,
          getActiveProfile,
          getDisplayProfile,
        }}>
          <Routes>
            <Route path="/admin/*" element={
              <>
                <main className="relative z-10">
                  <Routes>
                    <Route path="init" element={<AdminInit />} />
                    <Route path="login" element={<AdminLogin />} />
                    <Route path="" element={<AdminPanel />} />
                  </Routes>
                </main>
              </>
            } />
            <Route path="/*" element={
              <>
                <Header features={features} siteConfig={config?.site} />
                <main className="relative z-10">
                  <Routes>
                    {features.home && <Route path="/" element={<Home />} />}
                    {features.profile && <Route path="/profile" element={<Profile />} />}
                    {features.gallery && <Route path="/gallery" element={<Gallery />} />}
                    {features.fursuit && <Route path="/fursuit" element={<Fursuit />} />}
                    {features.diary && <Route path="/diary" element={<Diary />} />}
                    {features.friends && <Route path="/friends" element={<Friends />} />}
                    {features.guestbook && <Route path="/guestbook" element={<Guestbook />} />}
                    {features.commission && <Route path="/commission" element={<Commission />} />}
                    {features.qna && <Route path="/qna" element={<QNA />} />}
                    <Route path="/about" element={<About />} />
                    <Route path="/changelog" element={<Changelog />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </ProfileContext.Provider>
      </div>
    </Router>
  );
}