import React from 'react';
import { Link } from 'react-router-dom';
import { colors } from '../../styles/colors';

const Home: React.FC = () => {
  return (
    <div className="bg-[#FAF3E0]"> 
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#F5E9E2] to-[#FAF3E0]"> 
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-[#8B7355] sm:text-5xl md:text-6xl"> 
              <span className="block">Create Beautiful</span>
              <span className="block text-[#D4B996]">Digital Wedding Invitations</span> 
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-[#6B5B4E] sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Design and share your perfect wedding invitation. Easy to customize, beautiful to share.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/auth/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#FAF3E0] bg-[#D4B996] hover:bg-[#C4A576] transition-colors duration-200 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  to="/features"
                  className="w-full flex items-center justify-center px-8 py-3 border border-[#D4B996] text-base font-medium rounded-md text-[#8B7355] bg-white hover:bg-[#F5E9E2] transition-colors duration-200 md:py-4 md:text-lg md:px-10"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-[#D4B996] font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-[#8B7355] sm:text-4xl">
              Everything you need for your digital invitation
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  title: 'Easy Customization',
                  description:
                    'Customize every aspect of your invitation with our intuitive editor.',
                },
                {
                  title: 'Beautiful Themes',
                  description:
                    'Choose from our collection of professionally designed themes.',
                },
                {
                  title: 'Digital RSVP',
                  description:
                    'Manage your guest list with our built-in RSVP system.',
                },
                {
                  title: 'Share Anywhere',
                  description:
                    'Share your invitation via link, email, or social media.',
                },
              ].map((feature) => (
                <div key={feature.title} className="relative p-6 bg-[#F5E9E2] rounded-lg hover:bg-[#E5D4B7] transition-colors duration-200">
                  <div className="relative">
                    <h3 className="text-lg leading-6 font-medium text-[#8B7355]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-base text-[#6B5B4E]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-[#D4B996] to-[#C4A576]"> 
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to create your invitation?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-[#FAF3E0]">
            Start creating your perfect wedding invitation today.
          </p>
          <Link
            to="/auth/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#8B7355] bg-white hover:bg-[#F5E9E2] transition-colors duration-200 sm:w-auto"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
