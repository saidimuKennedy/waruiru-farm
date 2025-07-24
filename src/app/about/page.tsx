"use client";

import {
  Leaf,
  Heart,
  Users,
  Shield,
  Target,
  Eye,
  ShoppingBag,
  Phone,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AboutPage = () => {
  const values = [
    {
      icon: Leaf,
      title: "Regenerative Agriculture",
      description:
        "We nurture the soil's natural ecosystem, building biodiversity and carbon sequestration for a resilient food system that heals the earth with every harvest.",
      stat: "100% Organic",
    },
    {
      icon: Shield,
      title: "Uncompromising Quality",
      description:
        "From seed selection to harvest timing, every decision is made with quality in mind. Our produce is picked at peak ripeness and delivered within 24 hours.",
      stat: "24hr Fresh",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "We believe food connects us all. Through fair partnerships, local sourcing, and transparent practices, we strengthen our community one relationship at a time.",
      stat: "Local Partners",
    },
    {
      icon: Heart,
      title: "Passionate Transparency",
      description:
        "Farming is our calling. We open our doors, share our methods, and invite you to see exactly how your food grows from our soil to your table.",
      stat: "Open Farm",
    },
  ];

  const galleryImages = [
    {
      src: "https://res.cloudinary.com/dq3wkbgts/image/upload/v1753168518/photo-1720353967543-f95e122b795d_ykyi7c.jpg",
      alt: "Corriandor in the field",
      caption: "Corriandor in the field",
    },
    {
      src: "https://res.cloudinary.com/dq3wkbgts/image/upload/v1753168650/ripe_tomatoes_kynqbm.avif",
      alt: "Vibrant red ripe tomatoes on the vine",
      caption: "Vine-ripened tomatoes",
    },
    {
      src: "https://res.cloudinary.com/dq3wkbgts/image/upload/v1753291674/afrcan_farmer_carrots_yhbff8.webp",
      alt: "Farmer's hands holding freshly dug carrots with soil",
      caption: "Hand-harvested carrots",
    },
    {
      src: "https://res.cloudinary.com/dq3wkbgts/image/upload/v1753291554/blue_sky_kpfkwt.png",
      alt: "Wide shot of the farm under clear blue sky",
      caption: "Our sustainable farm",
    },
  ];

  const achievements = [
    { icon: Award, title: "Certified Organic", subtitle: "Since 2020" },
    {
      icon: Star,
      title: "100+ Happy Customers",
      subtitle: "Growing community",
    },
    { icon: CheckCircle, title: "Zero Pesticides", subtitle: "Always natural" },
    { icon: Leaf, title: "Carbon Negative", subtitle: "Healing the earth" },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

  const router = useRouter();

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Hero Section - Redesigned with Grid */}
      <motion.div
        className="relative min-h-screen flex items-center justify-center py-20" // Added vertical padding
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background with enhanced overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=1974&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent" />

        {/* Hero Content Grid */}
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-12 px-4 sm:px-6 lg:px-8 z-10 max-w-7xl mx-auto items-center">
          {/* Left Side: Main Headline & Description (2/3 width on large screens) */}
          <motion.div
            className="lg:col-span-2 space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none drop-shadow-lg">
              Where Nature
              <span className="block text-green-400">Meets Purpose</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed drop-shadow-md">
              At Waruiru Farm, every seed planted is a promise to our community
              and our planet. We're not just growing food—we're cultivating a
              sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                onClick={() => router.push("/quote")}
              >
                <ShoppingBag className="h-5 w-5" />
                Shop Our Produce
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Link href="#our-story" passHref>
                {" "}
                {/* Link to Our Story section */}
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg rounded-full backdrop-blur-sm bg-white/10 transform hover:scale-105 transition-all duration-300"
                >
                  Learn Our Story
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Side: Vertical Rule and New Content (1/3 width on large screens) */}
          <motion.div
            className="lg:col-span-1 flex items-center justify-center lg:justify-end py-8 lg:py-0" // Centered on small, right-aligned on large
            initial={{ opacity: 0, x: 50 }} // Animate from right
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="hidden lg:block h-64 w-px bg-white/50 mr-12"></div>{" "}
            {/* Vertical Rule for large screens */}
            <div className="text-center lg:text-left max-w-xs lg:max-w-none">
              {" "}
              {/* Constrain width on small, full on large */}
              <p className="text-2xl font-semibold text-white mb-4 drop-shadow-md">
                "Nourishing the land, enriching lives – one harvest at a time."
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                We are dedicated to sustainable practices that ensure the health
                of our soil and the vitality of our produce, bringing you the
                freshest ingredients with integrity.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Achievements Strip */}
      <motion.section
        className="bg-green-50 py-16"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4 group-hover:bg-green-200 transition-colors duration-300">
                  <achievement.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {achievement.title}
                </h3>
                <p className="text-gray-600">{achievement.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Our Story - Enhanced */}
      <motion.section
        id="our-story" // Added ID for linking
        className="py-24 px-4 sm:px-6 lg:px-8 bg-white"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeInUp}>
              <div className="relative">
                <img
                  src="/kennedy.png"
                  alt="Farmer Kennedy at Waruiru Farm"
                  className="rounded-3xl shadow-2xl w-full h-auto object-cover aspect-square"
                />
                <div className="absolute -bottom-6 -right-6 bg-green-600 text-white p-6 rounded-2xl shadow-xl">
                  <p className="text-3xl font-bold">5+</p>
                  <p className="text-sm">Years of Excellence</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-8">
              <div>
                <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  From Seed to
                  <span className="text-green-600"> Success</span>
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  Waruiru Farm began with Kennedy's vision: to prove that
                  farming can heal both the earth and community. What started as
                  an experimental plot has grown into a thriving ecosystem that
                  nourishes families and businesses across our region.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Every morning, we wake up knowing that our work goes beyond
                  growing food. We're growing trust, sustainability, and a
                  better future for the next generation. Our regenerative
                  practices don't just maintain the soil—they make it richer
                  year after year.
                </p>
              </div>

              <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-gray-700 italic">
                  "We don't just grow vegetables—we grow relationships, trust,
                  and a healthier community."
                  <span className="block text-sm text-gray-500 mt-1">
                    — Kennedy, Founder
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* New: From Humble Beginnings (Bloggish Section) */}
      <motion.section
        className="bg-gradient-to-br from-green-50 to-white py-24 px-4 sm:px-6 lg:px-8" // Lighter background for a softer feel
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              From a Dream to a Farm
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The journey of Waruiru Farm began with a single vision and a lot
              of hard work.
            </p>
          </motion.div>

          <div className="space-y-12">
            <motion.div
              variants={fadeInUp}
              className="flex flex-col md:flex-row gap-10 items-center"
            >
              <div className="md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1533062618053-d51e617307ec?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Placeholder for a humble beginning image
                  alt="Early days of Waruiru Farm"
                  className="rounded-3xl shadow-xl w-full h-auto object-cover aspect-video"
                />
              </div>
              <div className="hidden lg:block h-64 w-px bg-black/50 mr-12"></div>{" "}
              <div className="md:w-1/2 space-y-6 text-gray-700">
                <h3 className="text-3xl font-bold text-gray-900">
                  The First Seed
                </h3>
                <p className="text-lg leading-relaxed">
                  My journey into farming wasn't inherited; it was forged from a
                  deep desire to connect with the earth and provide truly
                  healthy food. It started with a small patch of land, a few
                  hand tools, and countless hours of learning, experimenting,
                  and sometimes, failing. Every sunrise brought new lessons, and
                  every successful sprout fueled the dream.
                </p>
                <p className="text-lg leading-relaxed">
                  There were days of doubt, of relentless sun, and unexpected
                  challenges. But the vision of a thriving, sustainable farm,
                  rooted in community values, kept me going. It was about more
                  than just growing crops; it was about cultivating a future
                  where food is grown with integrity and accessible to all.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col md:flex-row-reverse gap-10 items-center"
            >
              <div className="md:w-1/2">
                <img
                  src="https://res.cloudinary.com/dq3wkbgts/image/upload/v1753277027/harvest_eowsmt.avif"
                  alt="Growth and expansion of Waruiru Farm"
                  className="rounded-3xl shadow-xl w-full h-auto object-cover aspect-video"
                />
              </div>
              <div className="hidden lg:block h-64 w-px bg-black/50 mr-12"></div>{" "}
              <div className="md:w-1/2 space-y-6 text-gray-700">
                <h3 className="text-3xl font-bold text-gray-900">
                  Growing Beyond Expectations
                </h3>
                <p className="text-lg leading-relaxed">
                  As the farm grew, so did our understanding of regenerative
                  practices. We embraced methods that not only yielded bountiful
                  harvests but also enriched the soil, conserved water, and
                  supported local biodiversity. This commitment to ecological
                  balance became the cornerstone of Waruiru Farm.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, Waruiru Farm stands as a testament to what passion,
                  perseverance, and a deep respect for nature can achieve. We're
                  proud to share our story, our produce, and our vision for a
                  healthier, more connected world. Thank you for being a part of
                  our journey.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center pt-8">
              <p className="text-xl italic text-gray-600">
                "Every great harvest begins with a single, hopeful seed."
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Our Values - Enhanced */}
      <motion.section
        className="py-24 px-4 sm:px-6 lg:px-8 bg-white"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              What Sets Us Apart
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These aren't just values—they're our daily commitments that ensure
              every interaction with Waruiru Farm exceeds your expectations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-green-200 transform hover:-translate-y-2"
              >
                <div className="absolute top-6 right-6 text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  {value.stat}
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Gallery - Enhanced */}
      <motion.section
        className="py-24 bg-gray-50"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Life at the Farm
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Step into our world where every day brings new growth, fresh
              harvests, and the satisfaction of nurturing life from the ground
              up.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-semibold">{image.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action - Enhanced */}
      <motion.section
        className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1970&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-700/90" />

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <motion.div variants={fadeInUp}>
            <h2 className="text-6xl font-bold mb-8 leading-tight">
              Ready to Taste the
              <span className="block text-green-300"> Difference?</span>
            </h2>
            <p className="text-xl mb-12 text-green-100 max-w-3xl mx-auto leading-relaxed">
              Experience the exceptional quality and freshness that comes from
              regenerative farming. Join our growing community of conscious
              consumers who choose quality over convenience.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link href="/quote" passHref>
              <Button
                size="lg"
                className="bg-white text-green-700 hover:bg-green-50 font-bold py-4 px-10 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <ShoppingBag className="h-6 w-6" />
                Get Fresh Produce
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-green-700 font-bold py-4 px-10 text-lg rounded-full backdrop-blur-sm bg-white/10 transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <Phone className="h-6 w-6" />
                Let's Talk
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;
