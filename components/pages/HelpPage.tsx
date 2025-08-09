

import React from 'react';
import { Page } from '../../App';

const FAQItem: React.FC<{ question: string, children: React.ReactNode }> = ({ question, children }) => (
    <div className="py-6 border-b border-white/10">
        <h3 className="font-sora text-xl font-bold text-white mb-3">{question}</h3>
        <div className="text-gray-400 leading-relaxed space-y-3">{children}</div>
    </div>
);

interface HelpPageProps {
    onNavigate: (page: Page) => void;
}

const HelpPage: React.FC<HelpPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-lg animate-fade-in">
      <h1 className="font-sora text-4xl md:text-5xl font-extrabold text-white mb-4">Help & Support Center</h1>
      <p className="text-gray-400 mb-10">Have questions? We've got answers. If you can't find what you're looking for, feel free to reach out directly.</p>

      <div className="divide-y divide-white/10">
        <FAQItem question="How does the AI work? What model are you using?">
            <p>ContentJet AI uses Google's powerful Gemini family of models, specifically `gemini-2.5-flash` for its speed and quality. When you enter a prompt, our "Jet Engine™" analyzes your idea, desired emotions, and target platform to craft content designed to be highly engaging and effective.</p>
        </FAQItem>
        <FAQItem question="Is ContentJet AI really free?">
            <p>Yes, the ContentJet AI application is completely free to use during our public beta period. This allows us to gather valuable feedback while providing a powerful tool to the creator community. Enjoy unlimited content generation while we continue to improve the platform.</p>
        </FAQItem>
        <FAQItem question="Where is my data stored? Is it private?">
            <p>Your privacy is our highest priority. The app is designed to be completely private. We do not store your prompts, your generated content, or your API key on our servers. All your saved posts and settings are stored locally in your browser, which means only you have access to them.</p>
            <p>For a detailed explanation of our security measures, please read our full <button onClick={() => onNavigate('privacy')} className="bg-transparent border-none p-0 cursor-pointer text-accent-start hover:underline">Privacy Policy</button>.</p>
        </FAQItem>
        <FAQItem question="Why do some generations fail or return errors?">
            <p>AI generation can sometimes fail for a few reasons. It could be due to a temporary issue with the Google Gemini API, a safety filter being triggered by the prompt or the AI's response, or a network connectivity problem. If you encounter a persistent issue, try rephrasing your prompt or simplifying the idea.</p>
        </FAQItem>
        <FAQItem question="I found a bug or have a feature request. What should I do?">
            <p>We'd love to hear from you! Feedback from our early creators is what helps us build the best app in the world. Please send a detailed description of the bug (including what you were doing when it happened) or your feature idea to our founder's email address below.</p>
        </FAQItem>
      </div>

      <div className="mt-12 text-center p-8 bg-black/20 rounded-xl">
        <h2 className="font-sora text-2xl font-bold text-white">Still Have Questions?</h2>
        <p className="text-gray-400 mt-2 mb-4">Get in touch directly. Your feedback is what fuels our jet engine.</p>
        <a 
            href="mailto:hemaprabho37@gmail.com"
            className="group relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-white transition-all duration-300 bg-[#1A1A1A] rounded-lg shadow-lg hover:shadow-accent-start/50"
          >
            <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-300 ease-out bg-gradient-to-br from-accent-start to-accent-end group-hover:w-full group-hover:h-full"></span>
            <span className="relative">📧 Contact Founder</span>
          </a>
      </div>
    </div>
  );
};

export default HelpPage;