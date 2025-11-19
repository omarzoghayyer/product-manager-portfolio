import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Mail, Linkedin, CheckCircle, Target, BarChart3, Cog } from "lucide-react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_0i548of";
const EMAILJS_TEMPLATE_ID = "template_p5yszrn";
const EMAILJS_PUBLIC_KEY = "GVxmLfLxJ1vfsQIeQ";

// ✅ Initialize EmailJS with your public key
emailjs.init(EMAILJS_PUBLIC_KEY);

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const templateParams = {
        title: "New Message",
        name: formData.name,
        email: formData.email,
        message: formData.message,
        time: new Date().toLocaleString(),
      };

      // ✅ Use 3-arg send (serviceId, templateId, params) after init
      const res = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log("EmailJS success:", res);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Error sending email via EmailJS:", err);
      alert(
        "Something went wrong sending your message. You can also email me directly at sfzoghayyer@gmail.com."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Me</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Say hi or share something interesting-automation, ML, telemetry, game tech, or anything you think I’d enjoy.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">What I’m Into</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Problem Diagnosis</h3>
                    <p className="text-gray-600 text-sm">
                      Find root causes and high-leverage fixes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Telemetry & Analytics</h3>
                    <p className="text-gray-600 text-sm">
                      Signals over noise; dashboards that drive action.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Cog className="w-6 h-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Automation & AI</h3>
                    <p className="text-gray-600 text-sm">
                      Guardrails in pipelines; ML where it moves the needle.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-gray-100 p-8">
              <h3 className="font-semibold mb-4">Other Ways to Connect</h3>
              <div className="space-y-3">
                <a
                  href="mailto:sfzoghayyer@gmail.com"
                  className="flex items-center gap-3 text-gray-700 hover:text-[var(--primary)] transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>sfzoghayyer@gmail.com</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/omarzoghayyer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-[var(--primary)] transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-2xl font-bold mb-6">Send a Note</h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Message sent—thanks!
                  </h3>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Send Another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Name
                    </label>
                    <Input
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <Input
                      required
                      type="email"
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      required
                      placeholder="Say hi or drop a link…"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="min-h-[160px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[var(--primary)] hover:bg-[var(--primary-light)] h-12 text-base"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
