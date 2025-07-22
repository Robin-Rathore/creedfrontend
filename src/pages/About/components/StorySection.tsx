"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Lightbulb, Target, Users } from "lucide-react";

export const StorySection: React.FC = () => {
  const milestones = [
    {
      year: "2019",
      title: "The Beginning",
      description:
        "Started as a small aquarium enthusiast community with a vision to make aquatic life accessible to everyone.",
    },
    {
      year: "2020",
      title: "First Store",
      description:
        "Opened our first physical store, offering premium aquatic products and expert consultation services.",
    },
    {
      year: "2021",
      title: "Online Expansion",
      description:
        "Launched our e-commerce platform, reaching customers nationwide with our curated product selection.",
    },
    {
      year: "2022",
      title: "Community Growth",
      description:
        "Built a thriving community of 10,000+ aquarium enthusiasts sharing knowledge and experiences.",
    },
    {
      year: "2023",
      title: "Innovation Focus",
      description:
        "Introduced cutting-edge aquatic technology and sustainable practices to our product lineup.",
    },
    {
      year: "2024",
      title: "Global Reach",
      description:
        "Expanded internationally, bringing our passion for aquatic life to customers worldwide.",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion",
      description:
        "We're driven by genuine love for aquatic life and creating beautiful underwater ecosystems.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Constantly seeking new technologies and methods to improve the aquarium experience.",
    },
    {
      icon: Target,
      title: "Quality",
      description:
        "Every product is carefully selected and tested to meet our high standards of excellence.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building lasting relationships with customers and fostering a supportive aquarium community.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Story Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Story
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From humble beginnings to becoming a trusted name in the aquatic
            industry, our journey has been driven by passion, innovation, and an
            unwavering commitment to our customers.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--medium)] to-[var(--dark)] rounded-full flex items-center justify-center text-white font-bold">
                        {milestone.year.slice(-2)}
                      </div>
                      <div>
                        <div className="text-sm text-[var(--medium)] font-semibold">
                          {milestone.year}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[var(--medium)] transition-colors">
                          {milestone.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Values
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The principles that guide everything we do and shape our commitment
            to excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300 text-center group">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-[var(--lightest)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--light)] transition-colors">
                    <value.icon className="h-8 w-8 text-[var(--medium)]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--medium)] transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
