import { motion } from "framer-motion";
import { 
  ShieldCheckIcon, 
  ClockIcon, 
  StarIcon, 
  UsersIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  HeartIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const team = [
  {
    name: "Rahul Sharma",
    role: "Founder & CEO",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "15+ years in tech and service industry"
  },
  {
    name: "Ankit Verma",
    role: "CTO",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    bio: "Ex-Google, expert in scalable platforms"
  },
  {
    name: "Priya Mehta",
    role: "Operations Head",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Former operations lead at Amazon"
  },
  {
    name: "Sneha Patel",
    role: "Customer Success",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    bio: "Passionate about customer experience"
  }
];

const features = [
  {
    icon: ShieldCheckIcon,
    title: "Verified Professionals",
    description: "All service providers undergo rigorous background checks and skill verification"
  },
  {
    icon: ClockIcon,
    title: "24/7 Availability",
    description: "Find emergency services anytime, anywhere. We're always here when you need us"
  },
  {
    icon: StarIcon,
    title: "Quality Guaranteed",
    description: "Every service is backed by our satisfaction guarantee and quality standards"
  },
  {
    icon: UsersIcon,
    title: "Community Trusted",
    description: "Join thousands of satisfied customers who trust our platform daily"
  }
];

const values = [
  {
    icon: CheckCircleIcon,
    title: "Integrity",
    description: "We believe in transparent pricing and honest communication with our customers"
  },
  {
    icon: GlobeAltIcon,
    title: "Accessibility",
    description: "Making quality services accessible to everyone, everywhere"
  },
  {
    icon: HeartIcon,
    title: "Customer First",
    description: "Every decision we make is centered around customer satisfaction and trust"
  },
  {
    icon: LightBulbIcon,
    title: "Innovation",
    description: "Continuously improving our platform to serve you better"
  }
];

export default function About() {
  return (
    <div className="bg-background text-text overflow-hidden">

      {/* HERO */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 text-white">

        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{opacity:0,y:40}}
            animate={{opacity:1,y:0}}
            transition={{duration:0.6}}
            className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto"
          >
            Connecting People With Trusted Local Professionals
          </motion.h1>

          <motion.p 
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{duration:0.6,delay:0.2}}
            className="text-primary-100 max-w-3xl mx-auto mt-6 text-lg md:text-xl"
          >
            Our marketplace helps customers instantly find reliable electricians,
            plumbers, tutors, and hundreds of local professionals within minutes.
          </motion.p>

          <motion.div 
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{duration:0.6,delay:0.4}}
            className="flex flex-col sm:flex-row justify-center gap-4 mt-10"
          >
            <button className="px-8 py-4 bg-surface text-primary-600 rounded-lg font-semibold hover:bg-gray-50 transition transform hover:scale-105">
              Find a Service
            </button>

            <button className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-surface hover:text-primary-600 transition transform hover:scale-105">
              Become a Provider
            </button>
          </motion.div>
        </div>

      </section>


      {/* STATS */}
      <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["10,000+", "Jobs Completed"],
            ["2,500+", "Verified Professionals"],
            ["40+", "Cities Covered"],
            ["4.8★", "Customer Rating"]
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{opacity:0,y:20}}
              whileInView={{opacity:1,y:0}}
              transition={{duration:0.5,delay:i*0.1}}
              viewport={{once:true}}
              className="p-8 bg-surface rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-primary-600">{item[0]}</h3>
              <p className="text-muted mt-2 font-medium">{item[1]}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* FEATURES */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{opacity:0,y:20}}
            whileInView={{opacity:1,y:0}}
            transition={{duration:0.6}}
            viewport={{once:true}}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Why Choose Service Platform?
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              We're committed to providing the best service experience for both customers and providers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{opacity:0,y:20}}
                whileInView={{opacity:1,y:0}}
                transition={{duration:0.5,delay:i*0.1}}
                viewport={{once:true}}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-600 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-text mb-3">{feature.title}</h3>
                <p className="text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* STORY */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{opacity:0,x:-50}}
              whileInView={{opacity:1,x:0}}
              transition={{duration:0.6}}
              viewport={{once:true}}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-text mb-6">
                Our Story
              </h2>

              <p className="text-muted leading-relaxed mb-6">
                The idea started when we struggled to find reliable home service
                professionals. Endless phone calls, unreliable providers, and no
                transparency made simple tasks frustrating.
              </p>

              <p className="text-muted leading-relaxed mb-6">
                We built this platform to solve that problem — a trusted marketplace
                where customers can discover verified professionals and book
                services instantly.
              </p>

              <p className="text-muted leading-relaxed">
                Today, we're proud to serve thousands of customers across the country,
                making home services simple, reliable, and accessible for everyone.
              </p>
            </motion.div>

            <motion.div
              initial={{opacity:0,x:50}}
              whileInView={{opacity:1,x:0}}
              transition={{duration:0.6}}
              viewport={{once:true}}
              className="space-y-6"
            >
              {[
                ["2024", "Idea was born from personal frustration"],
                ["Early 2025", "Platform launched with 100+ providers"],
                ["Mid 2025", "Expanded to 20+ major cities"],
                ["2026", "Reached 10,000+ completed jobs milestone"]
              ].map((item,i)=>(
                <motion.div
                  key={i}
                  initial={{opacity:0,x:20}}
                  whileInView={{opacity:1,x:0}}
                  transition={{duration:0.5,delay:i*0.1}}
                  viewport={{once:true}}
                  className="flex items-start gap-4"
                >
                  <div className="w-3 h-3 bg-primary-600 rounded-full mt-2 flex-shrink-0"/>
                  <div className="bg-surface p-4 rounded-lg shadow-sm border border-border flex-1">
                    <h4 className="font-semibold text-text">{item[0]}</h4>
                    <p className="text-muted text-sm mt-1">{item[1]}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>


      {/* VALUES */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{opacity:0,y:20}}
            whileInView={{opacity:1,y:0}}
            transition={{duration:0.6}}
            viewport={{once:true}}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{opacity:0,y:20}}
                whileInView={{opacity:1,y:0}}
                transition={{duration:0.5,delay:i*0.1}}
                viewport={{once:true}}
                className="p-6 bg-background rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <value.icon className="w-10 h-10 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold text-text mb-3">{value.title}</h3>
                <p className="text-muted leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* TEAM */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{opacity:0,y:20}}
            whileInView={{opacity:1,y:0}}
            transition={{duration:0.6}}
            viewport={{once:true}}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              The passionate individuals driving our mission forward
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member,i)=>(
              <motion.div
                key={i}
                initial={{opacity:0,y:20}}
                whileInView={{opacity:1,y:0}}
                transition={{duration:0.5,delay:i*0.1}}
                viewport={{once:true}}
                whileHover={{y:-8}}
                className="bg-surface rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
              >
                <div className="aspect-w-1 aspect-h-1 overflow-hidden">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-text mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-muted text-sm">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* MISSION & VISION */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{opacity:0,x:-50}}
              whileInView={{opacity:1,x:0}}
              transition={{duration:0.6}}
              viewport={{once:true}}
              className="bg-gradient-to-br from-primary-50 to-secondary-50 p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-bold text-text mb-4">Our Mission</h3>
              <p className="text-muted leading-relaxed">
                To revolutionize the service industry by creating a trusted platform that 
                connects customers with verified professionals, making quality services 
                accessible, reliable, and transparent for everyone.
              </p>
            </motion.div>

            <motion.div
              initial={{opacity:0,x:50}}
              whileInView={{opacity:1,x:0}}
              transition={{duration:0.6}}
              viewport={{once:true}}
              className="bg-gradient-to-br from-accent-50 to-primary-50 p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-bold text-text mb-4">Our Vision</h3>
              <p className="text-muted leading-relaxed">
                To become the world's most trusted service marketplace, empowering millions 
                of service providers and customers to connect seamlessly, fostering economic 
                growth and community development.
              </p>
            </motion.div>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{opacity:0,y:20}}
            whileInView={{opacity:1,y:0}}
            transition={{duration:0.6}}
            viewport={{once:true}}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Join Our Growing Network?
          </motion.h2>

          <motion.p
            initial={{opacity:0,y:20}}
            whileInView={{opacity:1,y:0}}
            transition={{duration:0.6,delay:0.1}}
            viewport={{once:true}}
            className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto"
          >
            Thousands of customers trust our platform to find reliable services. 
            Join us today and experience the difference.
          </motion.p>

          <motion.div
            initial={{opacity:0,y:20}}
            whileInView={{opacity:1,y:0}}
            transition={{duration:0.6,delay:0.2}}
            viewport={{once:true}}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-10 py-4 bg-surface text-primary-600 rounded-xl font-semibold hover:bg-gray-50 transition transform hover:scale-105">
              Get Started as Customer
            </button>
            <button className="px-10 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-surface hover:text-primary-600 transition transform hover:scale-105">
              Join as Provider
            </button>
          </motion.div>
        </div>
      </section>

    </div>
  );
}