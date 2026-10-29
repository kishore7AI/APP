import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Sparkles, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEnrollment } from '../../hooks/useEnrollment';
import Button from '../../components/ui/Button';

export default function PricingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { membership, setMembership } = useEnrollment();

  const plans = [
    {
      name: 'Single Course',
      planKey: 'single',
      price: '₹2,000',
      period: 'one-time',
      description: 'Ideal if you only need mastery in one specific topic or technology stack.',
      popular: false,
      cta: 'Browse & Pick Course',
      href: '/courses',
      features: [
        'Full lifetime access to 1 chosen course',
        'Available on tracks with published Polar checkout',
        'Downloadable project source code',
        'Progress saving & resume playback',
        'Certificate of completion',
      ],
    },
    {
      name: 'Monthly Membership',
      planKey: 'monthly',
      price: '₹5,000',
      period: 'per month',
      description: 'Full unhindered access to all existing and newly released courses as long as active.',
      popular: true,
      cta: 'Start Monthly Access',
      href: '/signup?plan=monthly',
      features: [
        'Unlimited access to ALL courses (even without Polar product ID)',
        'Immediate access to new monthly releases',
        'Cancel anytime via Polar customer portal',
        'Access retained until end of paid billing cycle',
        'Priority instructor Q&A assistance',
      ],
    },
    {
      name: 'Lifetime Pass',
      planKey: 'lifetime',
      price: '₹25,000',
      period: 'one-time payment',
      description: 'The ultimate investment. Every current course and every future course, forever.',
      popular: false,
      cta: 'Get Lifetime Pass',
      href: '/signup?plan=lifetime',
      features: [
        'Permanent access to EVERYTHING on NxtLearnn',
        'All courses unlocked automatically',
        'Direct Discord creator office hours channel',
        'Early beta access to draft curriculum',
        'No recurring fees or subscription fatigue',
      ],
    },
  ];

  const handlePlanClick = (plan) => {
    if (plan.planKey === 'single') {
      navigate('/courses');
      return;
    }
    if (isAuthenticated) {
      setMembership(plan.planKey);
      alert(`🎉 Success! Your ${plan.name} is now active. All courses are unlocked for you!`);
      navigate('/courses');
    } else {
      navigate(plan.href);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Straightforward Investment</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          Predictable pricing for every learning journey
        </h1>
        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400">
          Pick the option that fits your budget. No hidden fees. Cancel monthly plans anytime in one click.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            whileHover={{ y: -5 }}
            className={`relative flex flex-col justify-between p-8 rounded-3xl transition-all duration-300 ${
              plan.popular
                ? 'bg-gradient-to-b from-indigo-950/40 via-[#080d1a] to-[#080d1a] border-2 border-indigo-500 shadow-2xl shadow-indigo-500/15'
                : 'bg-white dark:bg-[#080d1a] border border-gray-200 dark:border-white/[0.08] shadow-sm hover:border-slate-300 dark:hover:border-white/[0.18]'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white tracking-wide shadow-md font-mono">
                MOST POPULAR
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 min-h-[36px] leading-relaxed">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium font-mono">{plan.period}</span>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-white/[0.08] space-y-3">
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-200 uppercase tracking-wider">
                  Included benefits:
                </p>
                <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-300">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              {membership === plan.planKey ? (
                <div className="w-full py-3 px-6 rounded-xl text-center font-bold text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Current Active Plan</span>
                </div>
              ) : (
                <Button
                  onClick={() => handlePlanClick(plan)}
                  variant={plan.popular ? 'primary' : 'secondary'}
                  size="lg"
                  className="w-full text-center font-bold text-sm shadow-md"
                >
                  {plan.cta}
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-3xl mx-auto space-y-8 pt-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121824] border border-gray-200 dark:border-gray-800 space-y-2">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-500" />
              What happens if I cancel my monthly subscription?
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 pl-6">
              You retain 100% full course access until the end of your current paid billing period. After that date passes, access gently pauses with no surprise charges.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#121824] border border-gray-200 dark:border-gray-800 space-y-2">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-500" />
              Does the Lifetime Pass include future courses?
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 pl-6">
              Yes! Any course published on NxtLearnn in the future will automatically unlock on your dashboard with zero extra cost.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#121824] border border-gray-200 dark:border-gray-800 space-y-2">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-500" />
              How are payments processed?
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 pl-6">
              All transactions are securely handled through Polar.sh with end-to-end encryption. We never see or store your credit card details.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
