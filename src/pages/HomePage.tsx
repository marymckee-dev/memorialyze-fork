import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Heart, Mic, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import FeatureCard from '../components/home/FeatureCard';

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-500 z-0"></div>
        <div 
          className="absolute inset-0 z-10 opacity-20"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/4219896/pexels-photo-4219896.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl text-white">
            <motion.h1 
              className="text-4xl md:text-6xl font-serif font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Preserve Your Family Stories For Generations
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              TimeStitch helps you capture meaningful memories through voice recordings, 
              photos, and AI-powered prompts that inspire storytelling.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button as={Link} to="/record" size="lg" variant="secondary">
                Start Recording
                <Mic size={18} />
              </Button>
              <Button as={Link} to="/stories" size="lg" variant="outline">
                Explore Stories
                <ArrowRight size={18} />
              </Button>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">How TimeStitch Works</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Our intuitive platform makes it easy to preserve and share your most precious memories.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Mic className="text-primary-500\" size={32} />}
              title="Record Your Stories"
              description="Capture your family's stories through high-quality voice recordings with our simple recording interface."
            />
            <FeatureCard 
              icon={<BookOpen className="text-primary-500\" size={32} />}
              title="AI-Powered Prompts"
              description="Never run out of ideas with our AI-generated storytelling prompts designed to inspire meaningful memories."
            />
            <FeatureCard 
              icon={<Heart className="text-primary-500\" size={32} />}
              title="Tag Emotions & People"
              description="Add context to your memories by tagging emotions and family members to make stories more discoverable."
            />
            <FeatureCard 
              icon={<Users className="text-primary-500\" size={32} />}
              title="Family Tree Integration"
              description="Connect stories to your family tree to create a rich tapestry of interwoven family narratives."
            />
            <FeatureCard 
              icon={
                <svg width="32\" height="32\" viewBox="0 0 24 24\" fill="none\" stroke="currentColor\" className="text-primary-500">
                  <rect x="4\" y="4\" width="16\" height="16\" rx="2" />
                  <path d="M4 12h16" />
                  <path d="M12 4v16" />
                </svg>
              }
              title="Multimedia Support"
              description="Enhance your stories with photos and documents to create a complete memory archive."
            />
            <FeatureCard 
              icon={
                <svg width="32\" height="32\" viewBox="0 0 24 24\" fill="none\" stroke="currentColor\" className="text-primary-500">
                  <path d="M12 2v4" />
                  <path d="M12 18v4" />
                  <path d="M4.93 4.93l2.83 2.83" />
                  <path d="M16.24 16.24l2.83 2.83" />
                  <path d="M2 12h4" />
                  <path d="M18 12h4" />
                  <path d="M4.93 19.07l2.83-2.83" />
                  <path d="M16.24 7.76l2.83-2.83" />
                </svg>
              }
              title="Private & Secure"
              description="Your memories stay private with end-to-end encryption and granular sharing controls."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-serif font-bold mb-4">Start Preserving Your Family Legacy Today</h2>
                <p className="text-lg text-neutral-600 mb-8">
                  Don't let precious memories fade away. Begin capturing your family stories with TimeStitch.
                </p>
                <div>
                  <Button as={Link} to="/record" size="lg" variant="primary">
                    Begin Your Journey
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
              <div 
                className="h-64 md:h-auto"
                style={{
                  backgroundImage: "url('https://images.pexels.com/photos/7120363/pexels-photo-7120363.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;