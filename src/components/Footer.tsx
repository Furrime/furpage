import { Heart, PawPrint, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface FooterConfig {
  site: {
    title: string;
  };
  profile: {
    name: string;
  };
}

export default function Footer() {
  const [config, setConfig] = useState<FooterConfig | null>(null);

  useEffect(() => {
    fetch('/api/admin/config')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setConfig(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const siteTitle = config?.site?.title || 'furpage™';
  const profileName = config?.profile?.name || '这个兽';

  return (
    <footer className="bg-gradient-to-t from-fur-beige/50 to-transparent py-10 mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <PawPrint className="text-fur-lightbrown" size={20} />
            <span className="text-fur-lightbrown font-medium">{siteTitle}</span>
            <PawPrint className="text-fur-lightbrown" size={20} />
          </div>
          <p className="text-gray-500 text-sm mb-4">
            欢迎来到{profileName}的furpage™ ❤️
          </p>
          <p className="text-gray-400 text-xs flex items-center justify-center gap-1">
            Powered by furpage™ &copy; {new Date().getFullYear()}
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <a
              href="https://github.com/Furrime/furpage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="GitHub"
            >
              <Github size={16} />
            </a>
            <Link
              to="/admin/login"
              className="text-gray-300 text-xs hover:text-gray-500 transition-colors"
            >
              管理入口
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
