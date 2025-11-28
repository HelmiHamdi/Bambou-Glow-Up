import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Navigation',
      links: [
        { label: 'Accueil', href: '#accueil' },
        { label: 'Particien', href : '#praticiens' },
        { label: 'Avant / Après', href: '#beforeafter' },
        { label: 'Contact', href: '#contact' },
      ]
    },
    {
      title: 'Légal',
      links: [
        { label: 'Mentions légales', href: '/mentions-legales' },
        { label: 'Politique de confidentialité', href: '/politique-confidentialite' },
        { label: 'Conditions d\'utilisation', href: '/conditions-utilisation' },
        { label: 'Partenariat', href: '/partenariat' },
      ]
    },
    {
      title: 'Contact',
      links: [
        { label: 'contact@bambou.tn', href: 'mailto:contact@bambou.tn', icon: Mail },
        { label: '+216 12 345 678', href: 'tel:+21612345678', icon: Phone },
        { label: 'Tunis, Tunisia', href: '#', icon: MapPin },
      ]
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ];

  return (
    <footer className="bg-primary-800 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary-500 font-bold text-xl">B</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Bambou</h3>
                <p className="text-accent-300 text-sm">Glow Up</p>
              </div>
            </Link>
            <p className="text-gray-300 mb-4">
              Transformez votre histoire avec Bambou Glow Up. Une expérience de relooking complète pour révéler votre beauté intérieure.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center hover:bg-accent-500 transition-colors duration-200"
                    title={social.name}
                    aria-label={social.name}
                  >
                    <IconComponent size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-white mb-4 text-lg">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={linkIndex} className="flex items-start space-x-2">
                      {IconComponent && (
                        <IconComponent size={16} className="text-accent-300 mt-0.5 flex-shrink-0" />
                      )}
                      {link.path ? (
                        <Link
                          to={link.path}
                          className="text-gray-300 hover:text-accent-300 transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="text-gray-300 hover:text-accent-300 transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-primary-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Bambou Glow Up. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm flex items-center">
                Made with <Heart size={16} className="text-red-500 mx-1" /> in Tunisia
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;