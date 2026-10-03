import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User as UserIcon, Building2, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AccountType, User } from '../../types';
import { ALL_STATE_NAMES, getCitiesForState } from '../../data/locations';
import { marketplaceStore } from '../../services/marketplaceStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
  defaultAccountType?: AccountType;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
  defaultAccountType = 'Customer'
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [accountType, setAccountType] = useState<AccountType>(defaultAccountType);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [state, setState] = useState('Lagos');
  const [city, setCity] = useState('Ikeja');
  const [businessName, setBusinessName] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleStateChange = (newState: string) => {
    setState(newState);
    const cities = getCitiesForState(newState);
    setCity(cities[0] || 'Center');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password.trim()) {
          throw new Error('Please enter both your email and password.');
        }
        const user = marketplaceStore.loginUser(email.trim());
        setLoading(false);
        onSuccess(user);
        onClose();
      } else if (mode === 'register') {
        if (!fullName.trim()) throw new Error('Please enter your full name.');
        if (!email.trim()) throw new Error('Please provide an email address.');
        if (!phoneNumber.trim()) throw new Error('Please enter a Nigerian phone or WhatsApp number.');
        if (!password.trim() || password.length < 6) throw new Error('Password must be at least 6 characters.');

        const newUser = marketplaceStore.registerUser({
          fullName: fullName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          state,
          city,
          accountType,
          businessName: accountType === 'Seller' ? businessName.trim() || `${fullName}'s Fashion Hub` : undefined
        });

        setLoading(false);
        onSuccess(newUser);
        onClose();
      } else if (mode === 'forgot') {
        if (!email.trim()) throw new Error('Please enter your registered email address.');
        setSuccessMsg(`Password reset instructions sent to ${email.trim()} (Demo simulated).`);
        setLoading(false);
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  // Quick switch for demo convenience
  const handleQuickLogin = (demoEmail: string) => {
    setError(null);
    try {
      const user = marketplaceStore.loginUser(demoEmail);
      onSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#047857] text-white px-6 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-200 tracking-wider uppercase">
              <span>GERALD FASHION HUB</span>
            </div>
            <h3 className="text-xl font-bold font-serif text-white mt-0.5">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Create Your Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-emerald-100 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Toggle for Login/Register */}
        {mode !== 'forgot' && (
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 py-3 text-xs font-semibold text-center transition-colors border-b-2 ${
                mode === 'login'
                  ? 'border-[#047857] text-[#047857] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`flex-1 py-3 text-xs font-semibold text-center transition-colors border-b-2 ${
                mode === 'register'
                  ? 'border-[#047857] text-[#047857] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Register (Customer / Seller)
            </button>
          </div>
        )}

        {/* Body Form */}
        <div className="p-6">
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                {/* Account Type Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    I want to register as:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAccountType('Customer')}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                        accountType === 'Customer'
                          ? 'border-[#047857] bg-emerald-50 text-emerald-900'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Customer (Buy & Explore)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('Seller')}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                        accountType === 'Seller'
                          ? 'border-[#047857] bg-emerald-50 text-emerald-900'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Seller / Fashion Designer
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Gerald Uzor"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#047857]"
                    />
                    <UserIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

                {/* Business Name if Seller */}
                {accountType === 'Seller' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Fashion Brand / Shop Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Uzor Couture & Fabrics"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#047857]"
                      />
                      <Building2 className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>
                )}

                {/* Phone & WhatsApp */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nigerian Phone / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 0803 123 4567"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#047857]"
                    />
                    <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

                {/* State & City Location System per Requirement 6 */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      State (All 36 + FCT) *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full py-2 px-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#047857]"
                    >
                      {ALL_STATE_NAMES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      City / Area *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full py-2 px-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#047857]"
                    >
                      {getCitiesForState(state).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#047857]"
                />
                <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            {/* Password */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Password *
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-emerald-800 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#047857]"
                  />
                  <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#047857] hover:bg-[#065F46] text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Please wait...' : (
                mode === 'login' ? 'Sign In to Account' :
                mode === 'register' ? 'Complete Registration' : 'Send Reset Link'
              )}
            </button>
          </form>

          {/* Quick Demo Pre-filled Accounts */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Quick One-Click Demo Accounts:
            </p>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('chioma.adebayo@gmail.com')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
              >
                <div>
                  <span className="font-semibold text-slate-800">Chioma Adebayo</span>
                  <span className="text-slate-500 block text-[10px]">Customer · Lagos</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">Log In as Customer →</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('amina@bellofabrics.ng')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
              >
                <div>
                  <span className="font-semibold text-slate-800">Amina Bello</span>
                  <span className="text-slate-500 block text-[10px]">Seller (Fabrics & Lace) · Abuja</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">Log In as Seller →</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('gerald@geraldfashionhub.ng')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-50 text-left transition-colors"
              >
                <div>
                  <span className="font-semibold text-emerald-950">Mr. Gerald Uzor (Founder)</span>
                  <span className="text-emerald-700 block text-[10px]">Platform Administrator</span>
                </div>
                <span className="text-[11px] text-emerald-800 font-semibold">Log In as Admin →</span>
              </button>
            </div>
          </div>

          {mode === 'forgot' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-emerald-800 hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
