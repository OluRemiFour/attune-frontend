import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { WhyDifferentSection } from '@/components/landing/WhyDifferentSection';
import { DemoPreviewSection } from '@/components/landing/DemoPreviewSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { Navbar } from '@/components/landing/Navbar';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onConnectGmail: () => void;
  onSetGoals: () => void;
  onDashboard: () => void;
  isConnected: boolean;
}

export function LandingPage({ onConnectGmail, onSetGoals, onDashboard, isConnected }: LandingPageProps) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar 
        onConnectGmail={onConnectGmail}
        onDashboard={onDashboard}
        isConnected={isConnected}
      />
      
      <main className="pt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <HeroSection
            onConnectGmail={onConnectGmail}
            onGetStarted={onSetGoals}
          />
        </motion.div>
        
        <motion.div 
          id="how-it-works"
          className="my-[120px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ delay: 0.1 }}
        >
          <HowItWorksSection />
        </motion.div>
        
        <motion.div 
          id="features"
          className="my-[120px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ delay: 0.2 }}
        >
          <WhyDifferentSection />
        </motion.div>
        
        <motion.div 
          id="demo"
          className="my-[120px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ delay: 0.3 }}
        >
          <DemoPreviewSection />
        </motion.div>
        
        <motion.div
          className="mt-[120px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ delay: 0.4 }}
        >
          <CTASection
            onConnectGmail={onConnectGmail}
            onSetGoals={onSetGoals}
          />
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}

