"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, Twitter, Mail } from "lucide-react";

export const TeamSection: React.FC = () => {
  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Marine biologist turned entrepreneur with 15+ years in aquatic industry.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sarah@Creed.com",
      },
    },
    {
      name: "Michael Chen",
      role: "Head of Product",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Expert in aquarium technology and sustainable aquatic solutions.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "michael@Creed.com",
      },
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Experience Director",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Passionate about creating exceptional customer journeys and building community.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "emily@Creed.com",
      },
    },
    {
      name: "David Kim",
      role: "Technical Lead",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Full-stack developer specializing in e-commerce and aquarium automation.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "david@Creed.com",
      },
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The passionate individuals behind Creed, dedicated to bringing you
            the best aquatic experience.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden">
                <div className="relative overflow-hidden">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Social Links */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[var(--medium)] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-[var(--medium)] font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Join Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center mt-16"
        >
          <Card className="border-0 shadow-sm bg-gradient-to-r from-[var(--lightest)] to-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Join Our Team
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                We're always looking for passionate individuals who share our
                love for aquatic life and commitment to excellence. Explore
                career opportunities with us.
              </p>
              <Button className="bg-[var(--medium)] hover:bg-[var(--dark)] text-white">
                View Open Positions
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
